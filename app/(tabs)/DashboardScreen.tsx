import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  ActivityIndicator,
  Animated,
  Easing,
  View,
  useWindowDimensions,
} from 'react-native';
import { styled } from 'nativewind';
import { useRouter } from 'expo-router';
import {
  Screen,
  Heading,
  Body,
  Label,
  MetricNumber,
  Card,
  ProgressBar,
  HStack,
  VStack,
  MiniLineChart,
  Gauge,
  Button,
  StackedBar,
  EmptyState,
} from '../../components';
import { useTheme } from '../../theme';
import { useUser } from '../../hooks/useUser';
import { useReadings } from '../../hooks/useReadings';
import { useAnalytics } from '../../hooks/useAnalytics';
import { formatWeight, formatWeeklyChange, sortReadingsDesc } from '../../utils/format';
import { kgToLb } from '../../lib/metrics';
import { Reading } from '../../types/db';

const AnimatedSection = styled(Animated.View);

const easingCurve = Easing.bezier(0.65, 0, 0.35, 1);

const usePrefersReducedMotion = () => {
  const [prefers, setPrefers] = useState(false);

  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled().then((value) => {
      if (mounted) setPrefers(value);
    });
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', (value) => {
      setPrefers(value);
    });
    return () => {
      mounted = false;
      if (typeof subscription === 'function') {
        subscription();
      } else if (subscription && typeof subscription.remove === 'function') {
        subscription.remove();
      }
    };
  }, []);

  return prefers;
};

const useLiveRegion = (message: string | null) => {
  const lastMessage = useRef<string | null>(null);

  useEffect(() => {
    if (message && message !== lastMessage.current) {
      AccessibilityInfo.announceForAccessibility(message);
      lastMessage.current = message;
    }
  }, [message]);
};

const countRecentLogs = (readings: Reading[]) => {
  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 7);
  return readings.filter((reading) => new Date(reading.takenAt) >= sevenDaysAgo).length;
};

const deriveChartPoints = (weights: number[], unitSystem: 'metric' | 'imperial') =>
  unitSystem === 'imperial' ? weights.map((value) => kgToLb(value)) : weights;

export default function DashboardScreen() {
  const { tokens } = useTheme();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { user, loading: loadingUser } = useUser();
  const { readings, loading: loadingReadings } = useReadings(user?.id);
  const analytics = useAnalytics(user, readings);
  const prefersReducedMotion = usePrefersReducedMotion();
  const fadeValues = useRef([0, 1, 2, 3].map(() => new Animated.Value(0))).current;
  const isLoading = loadingUser || loadingReadings;

  const sortedReadings = useMemo(() => sortReadingsDesc(readings), [readings]);
  const latest = sortedReadings[0];
  const previous = sortedReadings[1];

  const unitSystem = user?.unitSystem ?? 'metric';
  const startWeight = user ? formatWeight(user.startWeightKg, unitSystem) : '--';
  const currentWeight = latest ? formatWeight(latest.weightKg, unitSystem) : '--';
  const goalWeight = user ? formatWeight(user.targetWeightKg, unitSystem) : '--';
  const weeklyChangeLabel = formatWeeklyChange(analytics.weeklyChangeKg, unitSystem);
  const progressPercent = Math.max(0, Math.min(100, Math.round(analytics.progressPercent * 100)));
  const logsThisWeek = countRecentLogs(readings);

  const chartWidth = useMemo(() => {
    const horizontalPadding = tokens.spacing.xl * 2;
    const available = width - horizontalPadding - 32;
    return Math.max(220, Math.min(available, 340));
  }, [tokens.spacing.xl, width]);

  const actualSeries = useMemo(
    () => deriveChartPoints(analytics.weeklyActualKg.map((point) => point.weightKg), unitSystem),
    [analytics.weeklyActualKg, unitSystem],
  );

  const predictedSeries = useMemo(
    () => deriveChartPoints(analytics.predictedWeights.map((point) => point.targetWeightKg), unitSystem),
    [analytics.predictedWeights, unitSystem],
  );

  const liveRegionMessage = !isLoading
    ? `Progress updated: ${progressPercent} percent toward your goal. Weekly change ${weeklyChangeLabel}.`
    : null;

  useLiveRegion(liveRegionMessage);

  useEffect(() => {
    if (isLoading) return;
    if (prefersReducedMotion) {
      fadeValues.forEach((value) => value.setValue(1));
      return;
    }
    fadeValues.forEach((value) => value.setValue(0));
    Animated.stagger(
      80,
      fadeValues.map((value) =>
        Animated.timing(value, {
          toValue: 1,
          duration: tokens.motion.durationFast,
          easing: easingCurve,
          useNativeDriver: true,
        }),
      ),
    ).start();
  }, [fadeValues, isLoading, prefersReducedMotion, tokens.motion.durationFast]);

  if (isLoading) {
    return (
      <Screen scrollable={false}>
        <View
          className="flex-1 items-center justify-center"
          accessibilityRole="progressbar"
          accessibilityLabel="Loading dashboard data"
        >
          <ActivityIndicator size="large" color={tokens.colors.accentSecondary} />
        </View>
      </Screen>
    );
  }

  if (!user || readings.length === 0 || !latest) {
    return (
      <Screen>
        <EmptyState
          title="No readings yet"
          description="Track your first reading to see motivation cues, composition trends, and projected progress."
          actionLabel="Add first reading"
        />
      </Screen>
    );
  }

  const momentumDirection = analytics.weeklyChangeKg <= 0 ? 'down' : 'up';
  const weightComparison = previous
    ? `Previously ${formatWeight(previous.weightKg, unitSystem)} on your last check-in.`
    : 'Keep logging regularly to see weekly momentum.';

  return (
    <Screen>
      <VStack spacing="xl">
        <AnimatedSection style={{ opacity: fadeValues[0] }} className="gap-2">
          <Heading accessibilityRole="header">Welcome back, {user.name}</Heading>
          <Body>
            You&apos;re {progressPercent}% to your goal — steady progress.
          </Body>
        </AnimatedSection>

        <AnimatedSection style={{ opacity: fadeValues[1] }}>
          <Card
            accessibilityLabel={`Goal progress. Start ${startWeight}. Current ${currentWeight}. Goal ${goalWeight}. ${progressPercent} percent to goal.`}
            className="gap-6"
          >
            <VStack spacing="lg">
              <Label weight="semibold">Goal progress</Label>
              <HStack spacing="lg" justify="space-between" align="flex-start">
                <VStack spacing="sm" style={{ flex: 1 }}>
                  <Body weight="semibold" color={tokens.colors.textSecondary}>
                    Start
                  </Body>
                  <MetricNumber style={{ fontSize: tokens.typography.subheading + 2 }}>{startWeight}</MetricNumber>
                </VStack>
                <VStack spacing="sm" style={{ flex: 1 }}>
                  <Body weight="semibold" color={tokens.colors.textSecondary}>
                    Current
                  </Body>
                  <MetricNumber style={{ fontSize: tokens.typography.subheading + 2 }}>{currentWeight}</MetricNumber>
                </VStack>
                <VStack spacing="sm" style={{ flex: 1 }}>
                  <Body weight="semibold" color={tokens.colors.textSecondary}>
                    Goal
                  </Body>
                  <MetricNumber style={{ fontSize: tokens.typography.subheading + 2 }}>{goalWeight}</MetricNumber>
                </VStack>
              </HStack>
              <ProgressBar value={progressPercent / 100} label={`Progress ${progressPercent}% to goal`} />
              <Body>
                Keep your rhythm — small steps matter.
              </Body>
            </VStack>
          </Card>
        </AnimatedSection>

        <AnimatedSection style={{ opacity: fadeValues[2] }}>
          <HStack spacing="xl" align="stretch" wrap>
            <Card
              accessibilityLabel={`Momentum update. Weekly change ${weeklyChangeLabel}. ${weightComparison}`}
              style={{ flex: 1, minWidth: 160 }}
              className="gap-4"
            >
              <Label weight="semibold">Momentum</Label>
              <Body color={tokens.colors.textSecondary}>This week&apos;s change</Body>
              <MetricNumber
                color={momentumDirection === 'down' ? tokens.colors.accent : tokens.colors.accentTertiary}
                style={{ fontSize: tokens.typography.heading }}
              >
                {weeklyChangeLabel}
              </MetricNumber>
              <Body>{weightComparison}</Body>
            </Card>

            <Card
              accessibilityLabel="Seven day trend chart comparing actual weight and projected goal"
              style={{ flex: 1, minWidth: 200 }}
              className="gap-4"
            >
              <Label weight="semibold">Weekly change chart</Label>
              <MiniLineChart
                width={chartWidth}
                height={140}
                accessibilityLabel="Weight trend over the past weeks"
                series={[
                  { points: actualSeries.slice(-8), color: tokens.colors.accentSecondary },
                  { points: predictedSeries.slice(0, actualSeries.length).slice(-8), color: tokens.colors.accentTertiary, dashed: true },
                ]}
              />
              <Body>Latest value highlighted — projections adjust with each log.</Body>
            </Card>
          </HStack>
        </AnimatedSection>

        <AnimatedSection style={{ opacity: fadeValues[3] }}>
          <Card
            accessibilityLabel={`Body composition summary. Fat ${latest.bodyFatPct.toFixed(1)} percent. Muscle ${latest.skeletalMusclePct.toFixed(1)} percent.`}
            className="gap-6"
          >
            <HStack spacing="lg" align="center" justify="space-between">
              <VStack spacing="sm" style={{ flex: 1 }}>
                <Label weight="semibold">Composition summary</Label>
                <Body>
                  Consistency compounds. You&apos;ve logged {logsThisWeek} days this week.
                </Body>
              </VStack>
              <Gauge value={analytics.muscleScore} label="Muscle score" />
            </HStack>
            <StackedBar data={analytics.composition.slice(-3)} width={chartWidth} height={128} />
            <HStack spacing="lg" align="flex-start">
              <VStack spacing="xs" style={{ flex: 1 }}>
                <Body weight="semibold" color={tokens.colors.textSecondary}>
                  Fat
                </Body>
                <MetricNumber style={{ fontSize: tokens.typography.subheading + 4 }}>
                  {latest.bodyFatPct.toFixed(1)}%
                </MetricNumber>
                <Body>Steady decline keeps energy balanced.</Body>
              </VStack>
              <VStack spacing="xs" style={{ flex: 1 }}>
                <Body weight="semibold" color={tokens.colors.textSecondary}>
                  Muscle
                </Body>
                <MetricNumber style={{ fontSize: tokens.typography.subheading + 4 }}>
                  {latest.skeletalMusclePct.toFixed(1)}%
                </MetricNumber>
                <Body>
                  Hydration {analytics.hydrationLow ? 'needs attention' : 'looks steady'} — keep nurturing recovery.
                </Body>
              </VStack>
            </HStack>
          </Card>
        </AnimatedSection>

        <Card gradient className="gap-4" accessibilityLabel="Encouragement. Keep logging and add a new entry.">
          <Body color={tokens.colors.surface}>
            Logged! Your trend updates instantly. Capture another reading when you&apos;re ready.
          </Body>
          <Button
            label="Log New Entry"
            accessibilityLabel="Log a new entry"
            onPress={() => router.push('/(tabs)/log')}
          />
        </Card>
      </VStack>
    </Screen>
  );
}
