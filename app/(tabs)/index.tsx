import { ReactNode, useMemo } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { HeroSection } from '../../components/dashboard/HeroSection';
import { LogCTA } from '../../components/dashboard/LogCTA';
import { WeeklyChangeCard } from '../../components/dashboard/WeeklyChangeCard';
import { MetricsGrid } from '../../components/dashboard/MetricsGrid';
import { StreakCard } from '../../components/dashboard/StreakCard';
import { GuidanceCard } from '../../components/dashboard/GuidanceCard';
import { EmptyState } from '../../components';

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
import { ThemeTokens, useTheme } from '../../theme';

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

const withAlpha = (color: string, alpha: number) => {
  if (color.startsWith('rgb')) {
    const values = color
      .replace(/rgba?\(/, '')
      .replace(')', '')
      .split(',')
      .map((value) => parseFloat(value.trim()));
    const [r = 0, g = 0, b = 0] = values.slice(0, 3);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  const sanitized = color.replace('#', '');
  const expanded =
    sanitized.length === 3
      ? sanitized
          .split('')
          .map((char) => char + char)
          .join('')
      : sanitized;
  const bigint = parseInt(expanded, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

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
  valueLabel: string;
  deltaLabel: string;
  metaLabel: string;
  accentColor: string;
  progress: number;
  tone?: 'positive' | 'negative' | 'neutral';
};

type DeltaResult = { text: string; tone: 'positive' | 'negative' | 'neutral' };

const formatDeltaLabel = (
  value: number,
  unit: string,
  positiveIsGood: boolean,
): DeltaResult => {
  if (Math.abs(value) < 0.1) {
    return { text: 'Holding steady vs start', tone: 'neutral' as const };
  }
  const direction = value < 0 ? 'Down' : 'Up';
  const tone = value < 0 === positiveIsGood ? 'positive' : 'negative';
  const formattedUnit = unit ? ` ${unit}` : '';
  return {
    text: `${direction} ${Math.abs(value).toFixed(1)}${formattedUnit} since start`,
    tone,
  };
};

const formatPercentDeltaLabel = (
  value: number,
  positiveIsGood: boolean,
  precision = 1,
): DeltaResult => {
  if (Math.abs(value) < 0.1) {
    return { text: 'Holding steady vs start', tone: 'neutral' as const };
  }
  const direction = value < 0 ? 'Down' : 'Up';
  const tone = value < 0 === positiveIsGood ? 'positive' : 'negative';
  return {
    text: `${direction} ${Math.abs(value).toFixed(precision)} pts since start`,
    tone,
  };
};

const buildMetrics = (
  latest: Reading,
  first: Reading,
  progressFraction: number,
  unit: UnitSystem,
  tokens: ThemeTokens,
): DashboardMetric[] => {
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

  const weightDeltaResult = formatDeltaLabel(weightDelta, weightUnit, true);
  const muscleDeltaResult = formatDeltaLabel(muscleDelta, weightUnit, true);
  const visceralDeltaResult = formatDeltaLabel(
    visceralDelta,
    '',
    false,
  );
  const proteinDeltaResult = formatPercentDeltaLabel(
    proteinDelta,
    true,
  );
  const waterDeltaResult = formatPercentDeltaLabel(waterDelta, true);
  const fatDeltaResult = formatPercentDeltaLabel(fatDelta, false);

  return [
    {
      id: 'weight',
      label: 'Weight',
      valueLabel: formatWeight(latest.weightKg, unit),
      deltaLabel: weightDeltaResult.text,
      metaLabel: `Start ${formatWeight(first.weightKg, unit)}`,
      accentColor: tokens.colors.brandNavy,
      progress: clamp(progressFraction),
      tone: weightDeltaResult.tone,
    },
    {
      id: 'bodyFat',
      label: 'Body Fat %',
      valueLabel: `${latest.bodyFatPct.toFixed(1)}%`,
      deltaLabel: fatDeltaResult.text,
      metaLabel: `Start ${first.bodyFatPct.toFixed(1)}%`,
      accentColor: tokens.colors.danger,
      progress: clamp(
        first.bodyFatPct
          ? 1 - latest.bodyFatPct / first.bodyFatPct
          : 0.5,
      ),
      tone: fatDeltaResult.tone,
    },
    {
      id: 'muscle',
      label: 'Muscle Mass',
      valueLabel: formatMass(latest.muscleMassKg, unit),
      deltaLabel: muscleDeltaResult.text,
      metaLabel: `Start ${formatMass(first.muscleMassKg, unit)}`,
      accentColor: tokens.colors.success,
      progress: clamp(
        first.muscleMassKg
          ? latest.muscleMassKg / first.muscleMassKg
          : 0.5,
      ),
      tone: muscleDeltaResult.tone,
    },
    {
      id: 'protein',
      label: 'Protein %',
      valueLabel: `${latest.proteinPct.toFixed(1)}%`,
      deltaLabel: proteinDeltaResult.text,
      metaLabel: `Start ${first.proteinPct.toFixed(1)}%`,
      accentColor: tokens.colors.accentSecondary,
      progress: clamp(latest.proteinPct / 100),
      tone: proteinDeltaResult.tone,
    },
    {
      id: 'water',
      label: 'Water %',
      valueLabel: `${latest.bodyWaterPct.toFixed(1)}%`,
      deltaLabel: waterDeltaResult.text,
      metaLabel: `Start ${first.bodyWaterPct.toFixed(1)}%`,
      accentColor: tokens.colors.accentSecondary,
      progress: clamp(latest.bodyWaterPct / 100),
      tone: waterDeltaResult.tone,
    },
    {
      id: 'visceral',
      label: 'Visceral Fat',
      valueLabel: latest.visceralFatIdx.toFixed(1),
      deltaLabel: visceralDeltaResult.text
        .replace(' since start', '')
        .trim(),
      metaLabel: `Start ${first.visceralFatIdx.toFixed(1)}`,
      accentColor: tokens.colors.brandNavy,
      progress: clamp(
        1 -
          latest.visceralFatIdx /
            Math.max(first.visceralFatIdx, 20),
      ),
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
  const { tokens } = useTheme();

  const themed = useMemo(() => createStyles(tokens, insets), [tokens, insets]);
  const sorted = useMemo(() => sortReadingsDesc(readings), [readings]);

  if (loading) {
    return (
      <View style={themed.loadingScreen}>
        <ActivityIndicator
          size="large"
          color={tokens.colors.accentTertiary}
        />
      </View>
    );
  }

  if (!user || sorted.length === 0) {
    return (
      <View style={themed.gradientBackground}>
        <ScrollView
          contentContainerStyle={[
            themed.scrollContainer,
            { paddingTop: insets.top + tokens.spacing.xl },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={themed.heroWrapper}>
            <EmptyState
              title="No readings yet"
              description="Log your first entry to unlock weekly trends and insights."
              actionLabel="Add first reading"
              onAction={() => router.push('/(tabs)/log')}
            />
          </View>
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

  const previousWeightLabel = previous
    ? formatWeight(previous.weightKg, user.unitSystem)
    : currentWeightLabel;
  const previousCheckInDate = previous
    ? formatDate(previous.takenAt)
    : undefined;

  const weeklySubtext = composeMomentumCaption(
    previousWeightLabel,
    previousCheckInDate,
  );

  const weeklySeries = (analytics.weeklyActualKg ?? []).map((point) =>
    kgToPreferred(point.weightKg, user.unitSystem),
  );

  const metrics = buildMetrics(
    latest,
    first,
    progressFraction,
    user.unitSystem,
    tokens,
  );

  const loggedDays = buildLoggedDays(sorted);
  const loggedCount = loggedDays.filter(Boolean).length;

  const guidance = buildGuidance(latest, previous);

  return (
    <View style={themed.gradientBackground}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={themed.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={themed.heroSpacing}>
          <HeroSection
            name={user.name}
            startLabel={startWeightLabel}
            currentLabel={currentWeightLabel}
            goalLabel={goalWeightLabel}
            progressFraction={progressFraction}
            topInset={insets.top}
          />
        </View>

        <View style={themed.sectionSpacing}>
          <LogCTA onPress={() => router.push('/(tabs)/log')} />
        </View>

        <View style={themed.sectionSpacing}>
          <View style={themed.sectionHeaderRow}>
            <Text style={themed.sectionHeaderText}>This week</Text>
            <View style={themed.sectionHeaderRule} />
          </View>

          <CardShell
            tokens={tokens}
            style={{ marginTop: tokens.spacing.sm }}
            accentCorner="topRight"
          >
            <WeeklyChangeCard
              changeLabel={weeklyChangeLabel}
              changeValue={analytics.weeklyChangeKg ?? 0}
              subtext={weeklySubtext}
              data={weeklySeries}
            />
          </CardShell>
        </View>

        <View style={themed.sectionSpacing}>
          <Text style={themed.subSectionLabel}>Body composition</Text>
          <MetricsGrid
            metrics={metrics.slice(0, 6)}
            showMore={metrics.length > 6}
          />
        </View>

        {guidance ? (
          <View style={themed.sectionSpacing}>
            <GradientInsightShell tokens={tokens}>
              <GuidanceCard
                message={guidance.message}
                actionLabel={guidance.actionLabel}
                onAction={
                  guidance.actionLabel
                    ? () => router.push('/(tabs)/log')
                    : undefined
                }
              />
            </GradientInsightShell>
          </View>
        ) : null}

        <View style={themed.sectionSpacing}>
          <StreakCard
            loggedDays={loggedDays}
            loggedCount={Math.min(loggedCount, 7)}
            onViewHistory={() => router.push('/(tabs)/trends')}
          />
        </View>

        <View style={{ height: 80 + Math.max(insets.bottom, 0) }} />
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

type CardShellProps = {
  children: ReactNode;
  tokens: ThemeTokens;
  style?: StyleProp<ViewStyle>;
  accentCorner?: 'topRight' | 'bottomLeft';
};

const CardShell = ({ children, tokens, style, accentCorner }: CardShellProps) => (
  <View style={[stylesShared.cardBase(tokens), style]}>
    {accentCorner === 'topRight' ? (
      <View style={stylesShared.cornerAccentTopRight(tokens)} />
    ) : null}
    {accentCorner === 'bottomLeft' ? (
      <View style={stylesShared.cornerAccentBottomLeft(tokens)} />
    ) : null}
    {children}
  </View>
);

type GradientInsightShellProps = {
  children: ReactNode;
  tokens: ThemeTokens;
};

const GradientInsightShell = ({ children, tokens }: GradientInsightShellProps) => (
  <View style={stylesShared.guidanceCardOuter(tokens)}>{children}</View>
);

const stylesShared = {
  cardBase: (tokens: ThemeTokens) => ({
    borderRadius: 20,
    backgroundColor: tokens.colors.card,
    padding: tokens.spacing.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: withAlpha(tokens.colors.aquaSoft, 0.45),
    shadowColor: tokens.colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    position: 'relative',
  }),
  cornerAccentTopRight: (tokens: ThemeTokens) => ({
    position: 'absolute',
    top: 0,
    right: 0,
    width: 24,
    height: 24,
    borderBottomLeftRadius: 24,
    backgroundColor: withAlpha(tokens.colors.brandLight, 0.12),
  }),
  cornerAccentBottomLeft: (tokens: ThemeTokens) => ({
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 24,
    height: 24,
    borderTopRightRadius: 24,
    backgroundColor: withAlpha(tokens.colors.brandLight, 0.12),
  }),
  guidanceCardOuter: (tokens: ThemeTokens) => ({
    borderRadius: 20,
    padding: tokens.spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: withAlpha(tokens.colors.brandMid, 0.25),
    backgroundColor:
      tokens.mode === 'dark'
        ? withAlpha(tokens.colors.brandMid, 0.2)
        : withAlpha(tokens.colors.aquaSoft, 0.32),
  }),
};

const createStyles = (tokens: ThemeTokens, insets: { top: number; bottom: number }) =>
  StyleSheet.create({
    gradientBackground: {
      flex: 1,
      backgroundColor: tokens.colors.background,
    },
    scrollContainer: {
      paddingHorizontal: tokens.spacing.md,
      paddingTop: tokens.spacing.sm,
      paddingBottom: tokens.spacing.lg + Math.max(insets.bottom, tokens.spacing.sm),
      gap: tokens.spacing.xl,
    },
    loadingScreen: {
      flex: 1,
      backgroundColor: tokens.colors.background,
      alignItems: 'center',
      justifyContent: 'center',
    },
    heroWrapper: {
      borderRadius: 44,
      backgroundColor: tokens.colors.card,
      paddingBottom: tokens.spacing.lg,
      shadowColor: tokens.colors.shadow,
      shadowOpacity: 1,
      shadowRadius: 24,
      shadowOffset: { width: 0, height: 8 },
      elevation: 4,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderColor: withAlpha(tokens.colors.mutedBorder, 0.5),
      overflow: 'hidden',
    },
    heroSpacing: {
      marginBottom: tokens.spacing.xl,
    },
    sectionSpacing: {
      gap: tokens.spacing.md,
    },
    sectionHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: tokens.spacing.sm,
    },
    sectionHeaderText: {
      color: tokens.colors.brandNavy,
      fontSize: 16,
      fontFamily: tokens.typography.fontFamilyAlt,
      letterSpacing: -0.02,
    },
    sectionHeaderRule: {
      flex: 1,
      height: 1,
      backgroundColor: withAlpha(tokens.colors.accentSecondary, 0.2),
    },
    subSectionLabel: {
      fontSize: 11,
      textTransform: 'uppercase',
      color: tokens.colors.textSecondary,
      marginBottom: tokens.spacing.sm,
      letterSpacing: 0.5,
      fontFamily: tokens.typography.fontFamilyMedium,
    },
  });
