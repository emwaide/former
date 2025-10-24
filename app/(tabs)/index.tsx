import { useMemo } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen, EmptyState } from '../../components';
import { useTheme } from '../../theme';
import { useUser } from '../../hooks/useUser';
import { useReadings } from '../../hooks/useReadings';
import { useAnalytics } from '../../hooks/useAnalytics';
import { formatDate, formatWeight, formatWeeklyChange, sortReadingsDesc } from '../../utils/format';
import { kgToLb } from '../../lib/metrics';
import { DashboardScreen } from './DashboardScreen';
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

const convertWeightValue = (weightKg: number, unit: 'imperial' | 'metric') =>
  unit === 'imperial' ? kgToLb(weightKg) : weightKg;

export const DashboardContent = () => {
  const router = useRouter();
  const { tokens } = useTheme();
  const { user, loading: loadingUser } = useUser();
  const { readings, loading: loadingReadings } = useReadings(user?.id);
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

  const weeklyActualSeries = (analytics.weeklyActualKg ?? []).map((point) =>
    convertWeightValue(point.weightKg, user.unitSystem),
  );

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
      ]}
      footerCopy="Want to update your numbers? Tap Log below."
    />
  );
};

export default function DashboardRoute() {
  return <DashboardContent />;
}
