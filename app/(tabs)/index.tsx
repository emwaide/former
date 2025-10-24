import { useMemo } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { HeroSection } from '../../components/dashboard/HeroSection';
import { LogCTA } from '../../components/dashboard/LogCTA';
import { WeeklyChangeCard } from '../../components/dashboard/WeeklyChangeCard';
import { MetricsGrid } from '../../components/dashboard/MetricsGrid';
import { StreakCard } from '../../components/dashboard/StreakCard';
import { GuidanceCard } from '../../components/dashboard/GuidanceCard';
import { palette, spacing } from '../../components/dashboard/constants';
import { EmptyState } from '../../components';
import { useUser } from '../../hooks/useUser';
import { useReadings } from '../../hooks/useReadings';
import { useAnalytics, Analytics } from '../../hooks/useAnalytics';
import { formatDate, formatWeight, formatWeeklyChange, sortReadingsDesc } from '../../utils/format';
import { kgToLb } from '../../lib/metrics';
import { Reading, UserProfile, UnitSystem } from '../../types/db';

const LoadingState = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color={palette.blueLight} />
  </View>
);

const toDateKey = (iso: string) => iso.split('T')[0];

const kgToPreferred = (value: number, unit: UnitSystem) => (unit === 'imperial' ? kgToLb(value) : value);

const formatMass = (valueKg: number, unit: UnitSystem) =>
  unit === 'imperial' ? `${kgToLb(valueKg).toFixed(1)} lb` : `${valueKg.toFixed(1)} kg`;

const composeMomentumCaption = (previousWeight: string, date?: string) =>
  date ? `Previously ${previousWeight} on ${date}.` : `Previously ${previousWeight} on your last check-in.`;

const clamp = (value: number, min = 0, max = 1) => Math.max(min, Math.min(max, value));

const buildLoggedDays = (readings: Reading[]): boolean[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const uniqueDays = new Set(readings.map((reading) => toDateKey(reading.takenAt)));

  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date(today);
    day.setDate(day.getDate() - (6 - index));
    const key = day.toISOString().split('T')[0];
    return uniqueDays.has(key);
  });
};

const metricHeadlineFromDelta = (prefix: string, delta: number, unit: string) => {
  if (Math.abs(delta) < 0.1) return `${prefix} steady`;
  const direction = delta < 0 ? '↓' : '↑';
  return `${prefix} ${direction} ${Math.abs(delta).toFixed(1)} ${unit}`;
};

const metricHeadlineFromPercentDelta = (prefix: string, delta: number) => {
  if (Math.abs(delta) < 0.1) return `${prefix} steady`;
  const direction = delta < 0 ? '↓' : '↑';
  return `${prefix} ${direction} ${Math.abs(delta).toFixed(1)}%`;
};

type Guidance = { message: string; actionLabel?: string } | null;

const buildGuidance = (latest: Reading, previous: Reading | undefined): Guidance => {
  if (!previous) {
    return null;
  }
  const muscleDelta = latest.skeletalMusclePct - previous.skeletalMusclePct;
  if (muscleDelta <= -2) {
    return { message: 'Muscle dipping this week — a rest day may help recovery.' };
  }
  const waterDelta = latest.bodyWaterPct - previous.bodyWaterPct;
  if (waterDelta <= -2) {
    return { message: 'Hydration dipped — add a glass before lunch.', actionLabel: 'Log hydration' };
  }
  const fatDelta = latest.bodyFatPct - previous.bodyFatPct;
  if (fatDelta >= 2) {
    return { message: 'Body fat nudged up — lean on whole foods tonight.' };
  }
  if (fatDelta <= -2) {
    return { message: 'Body fat trending down — keep protein steady and sleep consistent.' };
  }
  return null;
};

type DashboardMetric = {
  id: string;
  label: string;
  headline: string;
  subtext: string;
  icon: string;
  accentColor: string;
  progress: number;
};

const buildMetrics = (
  latest: Reading,
  first: Reading,
  progressFraction: number,
  unit: UnitSystem,
): DashboardMetric[] => {
  const weightDelta = kgToPreferred(latest.weightKg - first.weightKg, unit);
  const weightUnit = unit === 'imperial' ? 'lb' : 'kg';
  const fatDelta = latest.bodyFatPct - first.bodyFatPct;
  const muscleDelta = kgToPreferred(latest.muscleMassKg - first.muscleMassKg, unit);
  const proteinDelta = latest.proteinPct - first.proteinPct;
  const waterDelta = latest.bodyWaterPct - first.bodyWaterPct;
  const visceralDelta = latest.visceralFatIdx - first.visceralFatIdx;

  return [
    {
      id: 'weight',
      label: 'Weight',
      headline: metricHeadlineFromDelta('Weight', weightDelta, weightUnit),
      subtext: `Current ${formatWeight(latest.weightKg, unit)} · Start ${formatWeight(first.weightKg, unit)}`,
      icon: 'trending-down',
      accentColor: palette.navy,
      progress: clamp(progressFraction),
    },
    {
      id: 'bodyFat',
      label: 'Body Fat %',
      headline: metricHeadlineFromPercentDelta('Fat', fatDelta),
      subtext: `Current ${latest.bodyFatPct.toFixed(1)}% · Start ${first.bodyFatPct.toFixed(1)}%`,
      icon: 'pie-chart',
      accentColor: palette.errorSoft,
      progress: clamp(first.bodyFatPct ? 1 - latest.bodyFatPct / first.bodyFatPct : 0.5),
    },
    {
      id: 'muscle',
      label: 'Muscle Mass',
      headline: metricHeadlineFromDelta('Muscle', muscleDelta, weightUnit),
      subtext: `Current ${formatMass(latest.muscleMassKg, unit)} · Start ${formatMass(first.muscleMassKg, unit)}`,
      icon: 'activity',
      accentColor: palette.successSoft,
      progress: clamp(first.muscleMassKg ? latest.muscleMassKg / first.muscleMassKg : 0.5),
    },
    {
      id: 'protein',
      label: 'Protein %',
      headline: metricHeadlineFromPercentDelta('Protein', proteinDelta),
      subtext: `Current ${latest.proteinPct.toFixed(1)}% · Start ${first.proteinPct.toFixed(1)}%`,
      icon: 'droplet',
      accentColor: palette.blueLight,
      progress: clamp(latest.proteinPct / 100),
    },
    {
      id: 'water',
      label: 'Water %',
      headline: metricHeadlineFromPercentDelta('Water', waterDelta),
      subtext: `Current ${latest.bodyWaterPct.toFixed(1)}% · Start ${first.bodyWaterPct.toFixed(1)}%`,
      icon: 'cloud-rain',
      accentColor: palette.blueLight,
      progress: clamp(latest.bodyWaterPct / 100),
    },
    {
      id: 'visceral',
      label: 'Visceral Fat',
      headline: Math.abs(visceralDelta) < 0.1
        ? 'Visceral steady'
        : `Visceral ${visceralDelta < 0 ? '↓' : '↑'} ${Math.abs(visceralDelta).toFixed(1)}`,
      subtext: `Current ${latest.visceralFatIdx.toFixed(1)} · Start ${first.visceralFatIdx.toFixed(1)}`,
      icon: 'shield',
      accentColor: palette.navy,
      progress: clamp(1 - latest.visceralFatIdx / Math.max(first.visceralFatIdx, 20)),
    },
  ];
};

type DashboardContentProps = {
  loading: boolean;
  user: UserProfile | null;
  readings: Reading[];
  analytics: Analytics;
};

export const DashboardContent = ({ loading, user, readings, analytics }: DashboardContentProps) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const sorted = useMemo(() => sortReadingsDesc(readings), [readings]);

  if (loading) {
    return <LoadingState />;
  }

  if (!user || sorted.length === 0) {
    return (
      <View style={[styles.emptyContainer, { paddingTop: insets.top + spacing.xl }]}> 
        <EmptyState
          title="No readings yet"
          description="Log your first entry to unlock weekly trends and insights."
          actionLabel="Add first reading"
          onAction={() => router.push('/(tabs)/log')}
        />
      </View>
    );
  }

  const latest = sorted[0];
  const previous = sorted[1];
  const first = sorted[sorted.length - 1];
  const progressFraction = clamp(analytics.progressPercent ?? 0);
  const startWeightLabel = formatWeight(user.startWeightKg, user.unitSystem);
  const currentWeightLabel = formatWeight(latest.weightKg, user.unitSystem);
  const goalWeightLabel = formatWeight(user.targetWeightKg, user.unitSystem);
  const weeklyChangeLabel = formatWeeklyChange(analytics.weeklyChangeKg ?? 0, user.unitSystem);
  const previousWeightLabel = previous ? formatWeight(previous.weightKg, user.unitSystem) : currentWeightLabel;
  const previousCheckInDate = previous ? formatDate(previous.takenAt) : undefined;
  const weeklySubtext = composeMomentumCaption(previousWeightLabel, previousCheckInDate);
  const weeklySeries = (analytics.weeklyActualKg ?? []).map((point) => kgToPreferred(point.weightKg, user.unitSystem));
  const metrics = buildMetrics(latest, first, progressFraction, user.unitSystem);
  const loggedDays = buildLoggedDays(sorted);
  const loggedCount = loggedDays.filter(Boolean).length;
  const guidance = buildGuidance(latest, previous);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <HeroSection
          name={user.name}
          startLabel={startWeightLabel}
          currentLabel={currentWeightLabel}
          goalLabel={goalWeightLabel}
          progressFraction={progressFraction}
          topInset={insets.top}
        />

        <View style={styles.section}>
          <LogCTA onPress={() => router.push('/(tabs)/log')} />
        </View>

        <View style={styles.section}>
          <WeeklyChangeCard
            changeLabel={weeklyChangeLabel}
            changeValue={analytics.weeklyChangeKg ?? 0}
            subtext={weeklySubtext}
            data={weeklySeries}
          />
        </View>

        <View style={styles.section}>
          <MetricsGrid metrics={metrics.slice(0, 6)} showMore={metrics.length > 6} />
        </View>

        <View style={styles.section}>
          <StreakCard
            loggedDays={loggedDays}
            loggedCount={Math.min(loggedCount, 7)}
            onViewHistory={() => router.push('/(tabs)/trends')}
          />
        </View>

        {guidance ? (
          <View style={[styles.section, styles.guidanceSection]}>
            <GuidanceCard
              message={guidance.message}
              actionLabel={guidance.actionLabel}
              onAction={guidance.actionLabel ? () => router.push('/(tabs)/log') : undefined}
            />
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
};

export default function DashboardRoute() {
  const { user, loading: loadingUser } = useUser();
  const { readings, loading: loadingReadings } = useReadings(user?.id);
  const analytics = useAnalytics(user, readings);

  return (
    <DashboardContent
      loading={loadingUser || loadingReadings}
      user={user}
      readings={readings}
      analytics={analytics}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.skyTint,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xl,
    paddingBottom: 120,
    gap: spacing.xl,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.skyTint,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: palette.skyTint,
    paddingHorizontal: spacing.xl,
  },
  section: {
    gap: spacing.md,
  },
  guidanceSection: {
    marginBottom: spacing.xl,
  },
});
