import { useMemo } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen, EmptyState } from '../../components';
import { useTheme } from '../../theme';
import { useUser } from '../../hooks/useUser';
import { useReadings } from '../../hooks/useReadings';
import { useAnalytics } from '../../hooks/useAnalytics';
import { formatDate, formatWeight, formatWeeklyChange, sortReadingsDesc } from '../../utils/format';
import { countRecentLogs } from '../../utils/logs';
import { kgToLb } from '../../lib/metrics';
import { DashboardScreen } from './DashboardScreen';
import { Reading } from '../../types/db';
import { beachPalette } from '../../components/dashboard/palette';

const LoadingState = () => {
  const { tokens } = useTheme();

  return (
    <Screen scrollable={false} padded={false}>
      <View
        style={{
          flex: 1,
          backgroundColor: tokens.colors.background,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ActivityIndicator size="large" color={tokens.colors.accentSecondary} />
      </View>
    </Screen>
  );
};

const composeMomentumCaption = (weight: string, date?: string) => {
  if (!date) {
    return `Previously ${weight} on your last check-in.`;
  }
  return `Previously ${weight} on ${date}.`;
};

const toDateKey = (iso: string) => {
  const date = new Date(iso);
  date.setHours(0, 0, 0, 0);
  return date.toDateString();
};

const buildConsistencyDays = (readings: Reading[]) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const uniqueDays = new Set(readings.map((reading) => toDateKey(reading.takenAt)));

  return Array.from({ length: 7 }).map((_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - index));
    const label = date.toLocaleDateString(undefined, { weekday: 'short' });
    const key = date.toDateString();
    return { label, filled: uniqueDays.has(key) };
  });
};

const longestStreak = (readings: Reading[]) => {
  if (readings.length === 0) return 0;
  const uniqueDays = Array.from(new Set(readings.map((reading) => toDateKey(reading.takenAt)))).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime(),
  );
  let best = 0;
  let current = 0;
  let previousDate: Date | null = null;

  uniqueDays.forEach((day) => {
    const date = new Date(day);
    if (!previousDate) {
      current = 1;
      best = Math.max(best, current);
      previousDate = date;
      return;
    }
    const diff = Math.round((date.getTime() - previousDate.getTime()) / (1000 * 60 * 60 * 24));
    if (diff === 1) {
      current += 1;
    } else {
      current = 1;
    }
    best = Math.max(best, current);
    previousDate = date;
  });

  return best;
};

const convertWeightValue = (weightKg: number, unit: 'imperial' | 'metric') =>
  unit === 'imperial' ? kgToLb(weightKg) : weightKg;

export const DashboardContent = () => {
  const router = useRouter();
  const { tokens } = useTheme();
  const { user, loading: loadingUser } = useUser();
  const { readings, loading: loadingReadings } = useReadings();
  const analytics = useAnalytics(user, readings);
  const sorted = useMemo(() => sortReadingsDesc(readings), [readings]);

  const loading = loadingUser || loadingReadings;

  if (loading) {
    return <LoadingState />;
  }

  if (!user || readings.length === 0) {
    return (
      <Screen scrollable={false} padded={false}>
        <View
          style={{
            flex: 1,
            backgroundColor: tokens.colors.background,
            paddingHorizontal: tokens.spacing.xl,
            paddingTop: tokens.spacing['2xl'],
          }}
        >
          <EmptyState
            title="No readings yet"
            description="Track your first reading to see progress trends, predictions, and insights."
            actionLabel="Add first reading"
            onAction={() => router.push('/(tabs)/log')}
          />
        </View>
      </Screen>
    );
  }

  const latest = sorted[0];
  const previous = sorted[1] ?? sorted[0];
  const first = sorted[sorted.length - 1];

  const progressPercent = Math.round(Math.max(0, Math.min(analytics.progressPercent ?? 0, 1)) * 100);
  const startWeight = formatWeight(user.startWeightKg, user.unitSystem);
  const currentWeight = formatWeight(latest.weightKg, user.unitSystem);
  const goalWeight = formatWeight(user.targetWeightKg, user.unitSystem);
  const weeklyChangeLabel = formatWeeklyChange(analytics.weeklyChangeKg ?? 0, user.unitSystem);
  const weeklyChangeAbsolute = Math.abs(analytics.weeklyChangeKg ?? 0);
  const weeklyChangeValue = formatWeeklyChange(weeklyChangeAbsolute, user.unitSystem).replace(/^[+]/, '');
  const previousWeightLabel = formatWeight(previous.weightKg, user.unitSystem);
  const previousCheckInDate = previous ? formatDate(previous.takenAt) : undefined;
  const momentumCaption = composeMomentumCaption(previousWeightLabel, previousCheckInDate);

  const fatStart = first?.bodyFatPct ?? latest.bodyFatPct ?? 0;
  const fatCurrent = latest.bodyFatPct ?? fatStart;
  const fatDelta = fatStart - fatCurrent;
  const fatDirection = Math.abs(fatDelta) < 0.1 ? 'steady' : fatDelta > 0 ? 'down' : 'up';
  const fatHeadlineParts =
    fatDirection === 'steady'
      ? [
          { text: 'Fat ', color: beachPalette.deepNavy },
          { text: 'steady', color: beachPalette.driftwood },
        ]
      : [
          { text: 'Fat ', color: beachPalette.deepNavy },
          {
            text: `${fatDelta > 0 ? '↓' : '↑'} ${Math.abs(fatDelta).toFixed(1)}%`,
            color: fatDelta > 0 ? beachPalette.coral : beachPalette.deepNavy,
          },
        ];
  const fatProgress = Math.max(0, Math.min(1, fatStart > 0 ? (fatStart - fatCurrent) / fatStart : 0));
  const fatAccessibility =
    fatDirection === 'steady'
      ? `Body fat steady at ${fatCurrent.toFixed(1)} percent.`
      : `Body fat ${fatDelta > 0 ? 'decreased' : 'increased'} ${Math.abs(fatDelta).toFixed(1)} percent this week. Current ${fatCurrent.toFixed(1)} percent, ${
          fatDelta > 0 ? 'down' : 'up'
        } from ${fatStart.toFixed(1)} percent.`;

  const muscleScore = analytics.muscleScore ?? 0;
  const muscleScoreLabel = `${Math.round(muscleScore)} / 100`;
  const muscleStatus = muscleScore >= 80 ? 'Muscle thriving' : muscleScore >= 60 ? 'Muscle steady' : 'Muscle focus';
  const muscleTrend = muscleScore >= 70 ? 'Stable' : muscleScore >= 50 ? 'Watch' : 'Rebuild';
  const muscleProgress = Math.min(1, Math.max(0, muscleScore / 100));
  const muscleAccessibility = `Muscle tone score ${muscleScoreLabel}. Trend ${muscleTrend}.`;

  const weeklyLogs = analytics.logsThisWeek ?? countRecentLogs(readings);
  const bestStreak = longestStreak(readings);
  const consistencyDays = buildConsistencyDays(readings);
  const consistencyAccessibility = `Logged ${weeklyLogs} of 7 days this week. Best streak ${bestStreak} days. ${consistencyDays
    .map((day) => `${day.label} ${day.filled ? 'logged' : 'not logged'}`)
    .join(', ')}.`;

  const weeklyActualSeries = (analytics.weeklyActualKg ?? []).map((point) =>
    convertWeightValue(point.weightKg, user.unitSystem),
  );
  const weeklyPredictedSeries = (analytics.predictedWeights ?? [])
    .slice(0, weeklyActualSeries.length)
    .map((point) => convertWeightValue(point.targetWeightKg, user.unitSystem));

  const heroSummary =
    weeklyChangeAbsolute < 0.1
      ? 'Holding steady this week — keep noting your wins.'
      : analytics.weeklyChangeKg <= 0
      ? `Down ${weeklyChangeValue} this week — steady progress.`
      : `Up ${weeklyChangeValue} this week — adjust as needed.`;

  const heroAccessibility = `Goal progress ${progressPercent} percent to goal. ${heroSummary} Start ${startWeight}, current ${currentWeight}, goal ${goalWeight}.`;
  const momentumAccessibility = `This week's change ${weeklyChangeLabel}. ${momentumCaption}`;

  return (
    <DashboardScreen
      hero={{
        name: user.name ?? 'there',
        goalPercent: progressPercent,
        weeklySummary: heroSummary,
        weightSummary: [
          { label: 'Start', value: startWeight },
          { label: 'Current', value: currentWeight },
          { label: 'Goal', value: goalWeight },
        ],
        accessibilityLabel: heroAccessibility,
      }}
      momentum={{
        changeValue: weeklyChangeLabel,
        caption: momentumCaption,
        sparklinePoints: weeklyActualSeries,
        accessibilityLabel: momentumAccessibility,
      }}
      compositions={[
        {
          key: 'body-fat',
          title: 'BODY FAT',
          iconName: 'droplet',
          headline: fatHeadlineParts,
          progress: { value: fatProgress, color: fatDelta > 0 ? beachPalette.coral : beachPalette.deepNavy },
          stats: [
            { label: 'Current', value: `${fatCurrent.toFixed(1)}%` },
            { label: 'Start', value: `${fatStart.toFixed(1)}%` },
          ],
          accessibilityLabel: fatAccessibility,
        },
        {
          key: 'muscle-tone',
          title: 'MUSCLE TONE',
          iconName: 'activity',
          headline: [{ text: muscleStatus, color: beachPalette.seaGreen }],
          progress: { value: muscleProgress, color: beachPalette.seaGreen },
          stats: [
            { label: 'Score', value: muscleScoreLabel },
            { label: 'Trend', value: muscleTrend },
          ],
          accessibilityLabel: muscleAccessibility,
        },
      ]}
      consistency={{
        loggedSummary: `${Math.min(weeklyLogs, 7)} of 7 days logged this week`,
        streakSummary: `Best streak: ${bestStreak} day${bestStreak === 1 ? '' : 's'}`,
        days: consistencyDays,
        accessibilityLabel: consistencyAccessibility,
      }}
      weeklyTrend={
        weeklyActualSeries.length > 1
          ? {
              actual: weeklyActualSeries,
              predicted: weeklyPredictedSeries,
              deltaLabel: weeklyChangeLabel,
              accessibilityLabel: `Weight trend actual versus predicted. ${heroSummary}`,
            }
          : undefined
      }
      footerCopy="Want to update your numbers? Tap Log below."
    />
  );
};

export default function DashboardRoute() {
  return <DashboardContent />;
}
