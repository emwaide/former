import { useMemo } from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { HeroSection } from '../../components/dashboard/HeroSection';
import { WeeklyChangeCard } from '../../components/dashboard/WeeklyChangeCard';
import { MetricsGrid } from '../../components/dashboard/MetricsGrid';
import { StreakCard } from '../../components/dashboard/StreakCard';
import { GuidanceCard } from '../../components/dashboard/GuidanceCard';
import { EmptyState } from '../../components';
import type { MetricTileProps } from '../../components/dashboard/MetricTile';

import { useUser } from '../../hooks/useUser';
import { useReadings } from '../../hooks/useReadings';
import { useAnalytics, Analytics } from '../../hooks/useAnalytics';
import {
  formatDate,
  formatWeight,
  formatWeeklyChange,
  sortReadingsDesc,
} from '../../utils/format';
import { kgToLb } from '../../lib/metrics';
import { Reading, UserProfile, UnitSystem } from '../../types/db';

const toDateKey = (iso: string) => iso.split('T')[0];

const kgToPreferred = (value: number, unit: UnitSystem) =>
  unit === 'imperial' ? kgToLb(value) : value;

const formatMass = (valueKg: number, unit: UnitSystem) =>
  unit === 'imperial'
    ? `${kgToLb(valueKg).toFixed(1)} lb`
    : `${valueKg.toFixed(1)} kg`;

const composeMomentumCaption = (previousWeight: string, date?: string) =>
  date
    ? `Previously ${previousWeight} on ${date}.`
    : `Previously ${previousWeight} on your last check-in.`;

const clamp = (value: number, min = 0, max = 1) =>
  Math.max(min, Math.min(max, value));

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

type Guidance = { message: string; actionLabel?: string } | null;

const buildGuidance = (latest: Reading, previous: Reading | undefined): Guidance => {
  if (!previous) return null;

  const muscleDelta = latest.skeletalMusclePct - previous.skeletalMusclePct;
  if (muscleDelta <= -2) {
    return {
      message: 'Muscle dipping this week — a rest day may help recovery.',
    };
  }

  const waterDelta = latest.bodyWaterPct - previous.bodyWaterPct;
  if (waterDelta <= -2) {
    return {
      message: 'Hydration dipped — add a glass before lunch.',
      actionLabel: 'Log hydration',
    };
  }

  const fatDelta = latest.bodyFatPct - previous.bodyFatPct;
  if (fatDelta >= 2) {
    return {
      message: 'Body fat nudged up — lean on whole foods tonight.',
    };
  }
  if (fatDelta <= -2) {
    return {
      message: 'Body fat trending down — keep protein steady and sleep consistent.',
    };
  }
  return null;
};

type DashboardMetric = {
  id: string;
  label: string;
  value: string;
  unit: string;
  deltaLabel: string;
  metaLabel: string;
  accentColor: string;
  icon: MetricTileProps['icon'];
  tone?: 'positive' | 'negative' | 'neutral';
};

type DeltaResult = { text: string; tone: 'positive' | 'negative' | 'neutral' };

const formatDeltaLabel = (
  value: number,
  unit: string,
  positiveChangeIsGood: boolean,
): DeltaResult => {
  if (Math.abs(value) < 0.1) {
    return { text: 'Holding steady vs start', tone: 'neutral' as const };
  }
  const direction = value < 0 ? 'Down' : 'Up';
  const isPositiveChange = value >= 0;
  const tone =
    (isPositiveChange && positiveChangeIsGood) || (!isPositiveChange && !positiveChangeIsGood)
      ? 'positive'
      : 'negative';
  const formattedUnit = unit ? ` ${unit}` : '';
  return {
    text: `${direction} ${Math.abs(value).toFixed(1)}${formattedUnit} since start`,
    tone,
  };
};

const formatPercentDeltaLabel = (
  value: number,
  positiveChangeIsGood: boolean,
  precision = 1,
): DeltaResult => {
  if (Math.abs(value) < 0.1) {
    return { text: 'Holding steady vs start', tone: 'neutral' as const };
  }
  const direction = value < 0 ? 'Down' : 'Up';
  const isPositiveChange = value >= 0;
  const tone =
    (isPositiveChange && positiveChangeIsGood) || (!isPositiveChange && !positiveChangeIsGood)
      ? 'positive'
      : 'negative';
  return {
    text: `${direction} ${Math.abs(value).toFixed(precision)} pts since start`,
    tone,
  };
};

const buildMetrics = (
  latest: Reading,
  first: Reading,
  unit: UnitSystem,
): DashboardMetric[] => {
  const accentColor = '#37D0B4';
  const weightDelta = kgToPreferred(latest.weightKg - first.weightKg, unit);
  const weightUnit = unit === 'imperial' ? 'lb' : 'kg';
  const fatDelta = latest.bodyFatPct - first.bodyFatPct;
  const muscleDelta = kgToPreferred(
    latest.muscleMassKg - first.muscleMassKg,
    unit,
  );
  const proteinDelta = latest.proteinPct - first.proteinPct;
  const waterDelta = latest.bodyWaterPct - first.bodyWaterPct;
  const visceralDelta = latest.visceralFatIdx - first.visceralFatIdx;

  const weightDeltaResult = formatDeltaLabel(weightDelta, weightUnit, false);
  const muscleDeltaResult = formatDeltaLabel(muscleDelta, weightUnit, true);
  const visceralDeltaResult = formatDeltaLabel(visceralDelta, 'level', false);
  const proteinDeltaResult = formatPercentDeltaLabel(proteinDelta, true);
  const waterDeltaResult = formatPercentDeltaLabel(waterDelta, true);
  const fatDeltaResult = formatPercentDeltaLabel(fatDelta, false);

  const weightBadge = Math.abs(weightDelta) < 0.1
    ? 'Holding steady'
    : `${weightDelta > 0 ? '+' : ''}${Math.abs(weightDelta).toFixed(1)} ${weightUnit}`;
  const fatBadge = Math.abs(fatDelta) < 0.1
    ? 'Holding steady'
    : `${fatDelta > 0 ? '+' : ''}${Math.abs(fatDelta).toFixed(1)}%`;
  const muscleBadge = Math.abs(muscleDelta) < 0.1
    ? 'Holding steady'
    : `${muscleDelta > 0 ? '+' : ''}${Math.abs(muscleDelta).toFixed(1)} ${weightUnit}`;
  const proteinBadge = Math.abs(proteinDelta) < 0.1
    ? 'Holding steady'
    : `${proteinDelta > 0 ? '+' : ''}${Math.abs(proteinDelta).toFixed(1)}%`;
  const waterBadge = Math.abs(waterDelta) < 0.1
    ? 'Holding steady'
    : `${waterDelta > 0 ? '+' : ''}${Math.abs(waterDelta).toFixed(1)}%`;
  const visceralBadge = Math.abs(visceralDelta) < 0.1
    ? 'Holding steady'
    : `${visceralDelta > 0 ? '+' : ''}${Math.abs(visceralDelta).toFixed(0)} lvl`;

  const currentWeightDisplay = formatWeight(latest.weightKg, unit);
  const [weightValuePart, ...weightUnitParts] = currentWeightDisplay.split(' ');
  const currentWeightValue = weightValuePart;
  const currentWeightUnit = weightUnitParts.join(' ');

  const currentMuscleDisplay = formatMass(latest.muscleMassKg, unit);
  const [muscleValuePart, ...muscleUnitParts] = currentMuscleDisplay.split(' ');
  const currentMuscleValue = muscleValuePart;
  const currentMuscleUnit = muscleUnitParts.join(' ');

  return [
    {
      id: 'weight',
      label: 'Weight',
      value: currentWeightValue,
      unit: currentWeightUnit,
      deltaLabel: weightBadge,
      metaLabel:
        weightDeltaResult.tone === 'positive'
          ? 'Consistent downward trend'
          : weightDeltaResult.tone === 'negative'
            ? 'Weight trending upward'
            : 'Holding steady',
      accentColor,
      icon: 'trending-down',
      tone: weightDeltaResult.tone,
    },
    {
      id: 'bodyFat',
      label: 'Body Fat',
      value: latest.bodyFatPct.toFixed(1),
      unit: '%',
      deltaLabel: fatBadge,
      metaLabel:
        fatDeltaResult.tone === 'positive'
          ? 'Healthy reduction rate'
          : fatDeltaResult.tone === 'negative'
            ? 'Slight increase — monitor'
            : 'Stable vs start',
      accentColor,
      icon: 'percent',
      tone: fatDeltaResult.tone,
    },
    {
      id: 'muscle',
      label: 'Muscle Mass',
      value: currentMuscleValue,
      unit: currentMuscleUnit,
      deltaLabel: muscleBadge,
      metaLabel:
        muscleDeltaResult.tone === 'positive'
          ? 'Building lean tissue'
          : muscleDeltaResult.tone === 'negative'
            ? 'Watch recovery this week'
            : 'Maintaining lean mass',
      accentColor,
      icon: 'activity',
      tone: muscleDeltaResult.tone,
    },
    {
      id: 'protein',
      label: 'Protein',
      value: latest.proteinPct.toFixed(1),
      unit: '%',
      deltaLabel: proteinBadge,
      metaLabel:
        proteinDeltaResult.tone === 'positive'
          ? 'Good protein retention'
          : proteinDeltaResult.tone === 'negative'
            ? 'Slight dip — add a serving'
            : 'On track with intake',
      accentColor,
      icon: 'bar-chart-2',
      tone: proteinDeltaResult.tone,
    },
    {
      id: 'water',
      label: 'Water',
      value: latest.bodyWaterPct.toFixed(1),
      unit: '%',
      deltaLabel: waterBadge,
      metaLabel:
        waterDeltaResult.tone === 'positive'
          ? 'Well hydrated'
          : waterDeltaResult.tone === 'negative'
            ? 'Hydration dipped — add fluids'
            : 'Hydration holding steady',
      accentColor,
      icon: 'droplet',
      tone: waterDeltaResult.tone,
    },
    {
      id: 'visceral',
      label: 'Visceral Fat',
      value: latest.visceralFatIdx.toFixed(1),
      unit: 'lvl',
      deltaLabel: visceralBadge,
      metaLabel:
        visceralDeltaResult.tone === 'positive'
          ? 'Improving core health'
          : visceralDeltaResult.tone === 'negative'
            ? 'Slight rise — stay mindful'
            : 'Holding within range',
      accentColor,
      icon: 'shield',
      tone: visceralDeltaResult.tone,
    },
  ];
};

type DashboardContentProps = {
  loading: boolean;
  user: UserProfile | null;
  readings: Reading[];
  analytics: Analytics;
};

export const DashboardContent = ({
  loading,
  user,
  readings,
  analytics,
}: DashboardContentProps) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const sorted = useMemo(() => sortReadingsDesc(readings), [readings]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#37D0B4" />
      </View>
    );
  }

  if (!user || sorted.length === 0) {
    return (
      <View className="flex-1 bg-background">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            paddingTop: insets.top + 32,
            paddingHorizontal: 24,
            paddingBottom: 40,
          }}
          showsVerticalScrollIndicator={false}
        >
          <EmptyState
            title="No readings yet"
            description="Log your first entry to unlock weekly trends and insights."
            actionLabel="Add first reading"
            onAction={() => router.push('/(tabs)/log')}
          />
        </ScrollView>
      </View>
    );
  }

  const latest = sorted[0];
  const previous = sorted[1];
  const first = sorted[sorted.length - 1];

  const progressFraction = clamp(analytics.progressPercent ?? 0);

  const startWeightLabel = formatWeight(
    user.startWeightKg,
    user.unitSystem,
  );
  const currentWeightLabel = formatWeight(
    latest.weightKg,
    user.unitSystem,
  );
  const goalWeightLabel = formatWeight(
    user.targetWeightKg,
    user.unitSystem,
  );

  const weeklyChangeLabel = formatWeeklyChange(
    analytics.weeklyChangeKg ?? 0,
    user.unitSystem,
  );
  const weeklyChangeValue = analytics.weeklyChangeKg ?? 0;
  const weeklyChangeSubtitle = composeMomentumCaption(
    formatWeight(previous?.weightKg ?? latest.weightKg, user.unitSystem),
    previous ? formatDate(previous.takenAt) : undefined,
  );

  const metrics = buildMetrics(latest, first, user.unitSystem);
  const guidance = buildGuidance(latest, previous);
  const loggedDays = buildLoggedDays(sorted);

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <HeroSection
          name={user.name}
          startLabel={startWeightLabel}
          currentLabel={currentWeightLabel}
          goalLabel={goalWeightLabel}
          progressFraction={progressFraction}
          topInset={insets.top}
        />

        <View className="px-6">
          <View className="mt-6 flex-col gap-6">
            <WeeklyChangeCard
              changeLabel={weeklyChangeLabel}
              changeValue={weeklyChangeValue}
              subtext={weeklyChangeSubtitle}
              data={(analytics.weeklySeries ?? []).map((point) => point.value)}
            />

            <MetricsGrid metrics={metrics} />

            {guidance ? (
              <GuidanceCard
                message={guidance.message}
                actionLabel={guidance.actionLabel}
                onAction={guidance.actionLabel ? () => router.push('/(tabs)/log') : undefined}
              />
            ) : null}

            <StreakCard
              loggedDays={loggedDays}
              loggedCount={loggedDays.filter(Boolean).length}
              onViewHistory={() => router.push('/(tabs)/trends')}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default function DashboardScreen() {
  const { user, loading: userLoading } = useUser();
  const { readings, loading: readingsLoading } = useReadings();
  const { analytics, loading: analyticsLoading } = useAnalytics();

  return (
    <DashboardContent
      loading={userLoading || readingsLoading || analyticsLoading}
      user={user}
      readings={readings}
      analytics={analytics}
    />
  );
}
