import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  ActivityIndicator,
  Animated,
  Easing,
  Pressable,
  View,
  useWindowDimensions,
} from 'react-native';
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
  EmptyState,
} from '../../components';
import { useTheme } from '../../theme';
import { useUser } from '../../hooks/useUser';
import { useReadings } from '../../hooks/useReadings';
import { useAnalytics } from '../../hooks/useAnalytics';
import { formatWeight, formatWeeklyChange, sortReadingsDesc } from '../../utils/format';
import { kgToLb } from '../../lib/metrics';
import { Reading } from '../../types/db';

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

const calculateLogStreak = (readings: Reading[]) => {
  if (readings.length === 0) return 0;
  const uniqueDays = Array.from(
    new Set(
      readings.map((reading) => {
        const date = new Date(reading.takenAt);
        const normalized = new Date(date);
        normalized.setHours(0, 0, 0, 0);
        return normalized.getTime();
      }),
    ),
  ).sort((a, b) => b - a);

  if (uniqueDays.length === 0) return 0;

  let streak = 1;
  for (let index = 1; index < uniqueDays.length; index += 1) {
    const previousDay = uniqueDays[index - 1];
    const currentDay = uniqueDays[index];
    const difference = (previousDay - currentDay) / (1000 * 60 * 60 * 24);

    if (difference === 1) {
      streak += 1;
    } else if (difference > 1) {
      break;
    }
  }

  return streak;
};

const buildEncouragementCopy = (
  weeklyChangeKg: number,
  weeklyChangeLabel: string,
  hydrationLow: boolean,
) => {
  if (hydrationLow) {
    return {
      message: 'Hydration dipped this week — a glass before lunch keeps recovery on track.',
      action: 'Log hydration',
    };
  }

  if (weeklyChangeKg < -0.05) {
    return {
      message: `Down ${weeklyChangeLabel} this week — consistent effort is paying off.`,
      action: 'Log new entry',
    };
  }

  if (weeklyChangeKg > 0.05) {
    return {
      message: `Weight up ${weeklyChangeLabel.replace('+', '')} — peek at Trends for gentle tweaks.`,
      action: 'Review trends',
    };
  }

  return {
    message: 'Weight is steady — keep logging to spot the subtle shifts.',
    action: 'Log new entry',
  };
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
  const streakDays = calculateLogStreak(readings);

  const encouragement = useMemo(
    () => buildEncouragementCopy(analytics.weeklyChangeKg, weeklyChangeLabel, analytics.hydrationLow),
    [analytics.hydrationLow, analytics.weeklyChangeKg, weeklyChangeLabel],
  );

  const encouragementButtonLabel = encouragement.action === 'Review trends' ? 'Open Trends' : encouragement.action;
  const encouragementOnPress =
    encouragement.action === 'Review trends'
      ? () => router.push('/(tabs)/trends')
      : () => router.push('/(tabs)/log');

  const streakLabel =
    streakDays > 1 ? `${streakDays}-day logging streak` : streakDays === 1 ? '1-day logging streak' : 'Log today to start your streak';

  const loggingSupportMessage =
    logsThisWeek > 0
      ? `Logged ${logsThisWeek} day${logsThisWeek === 1 ? '' : 's'} this week — consistency protects muscle tone.`
      : 'Log a reading this week to keep muscle insights fresh.';

  const compositionHeadline = `${
    analytics.muscleScore >= 75
      ? 'Muscle steady'
      : analytics.muscleScore <= 55
      ? 'Muscle softening slightly'
      : 'Muscle holding'
  } · ${analytics.fatLossPct > 0 ? `Fat ↓${analytics.fatLossPct.toFixed(1)}%` : 'Fat steady'}`;

  const compositionInsight =
    analytics.muscleScore >= 75
      ? 'Strength sessions are supporting tone — keep the rhythm.'
      : analytics.muscleScore <= 55
      ? 'Plan a resistance session to keep muscle engaged.'
      : 'Maintain protein intake to keep muscle holding steady.';


  const chartWidth = useMemo(() => {
    const horizontalPadding = tokens.spacing.xl * 2;
    const available = width - horizontalPadding - 32;
    return Math.max(220, Math.min(available, 340));
  }, [tokens.spacing.xl, width]);

  const actualSeries = useMemo(
    () => deriveChartPoints(analytics.weeklyActualKg.map((point) => point.weightKg), unitSystem),
    [analytics.weeklyActualKg, unitSystem],
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
        <Animated.View style={{ opacity: fadeValues[0] }}>
          <VStack spacing="sm">
            <Heading accessibilityRole="header">Welcome back, {user.name}</Heading>
            <Body>
              You&apos;re {progressPercent}% to your goal — steady progress.
            </Body>
          </VStack>
        </Animated.View>

        <Animated.View style={{ opacity: fadeValues[1] }}>
          <Card
            accessibilityLabel={`Goal progress. Start ${startWeight}. Current ${currentWeight}. Goal ${goalWeight}. ${progressPercent} percent to goal.`}
            style={{ gap: tokens.spacing.xl }}
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
        </Animated.View>

        <Animated.View style={{ opacity: fadeValues[2] }}>
          <HStack spacing="xl" align="stretch" wrap>
            <Card
              accessibilityLabel={`Momentum update. Weekly change ${weeklyChangeLabel}. ${weightComparison}`}
              style={{ flex: 1, minWidth: 160, gap: tokens.spacing.lg }}
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
              accessibilityLabel={`Seven day weight trend. ${weeklyChangeLabel} this week.`}
              style={{ flex: 1, minWidth: 200, gap: tokens.spacing.lg }}
            >
              <VStack spacing="xs">
                <Label weight="semibold">7-day weight trend</Label>
                <Body color={tokens.colors.textSecondary}>Past week · latest point highlighted.</Body>
              </VStack>
              <MiniLineChart
                width={chartWidth}
                height={140}
                accessibilityLabel="Actual weight trend over the past 7 days"
                series={[{ points: actualSeries.slice(-8), color: tokens.colors.accentSecondary }]}
              />
              <Pressable
                accessibilityRole="link"
                accessibilityLabel="View full weight trends"
                onPress={() => router.push('/(tabs)/trends')}
                style={{ paddingVertical: tokens.spacing.xs }}
              >
                <Body weight="semibold" color={tokens.colors.accentSecondary}>
                  View trends
                </Body>
              </Pressable>
            </Card>
          </HStack>
        </Animated.View>

        <Animated.View style={{ opacity: fadeValues[3] }}>
          <Card
            accessibilityLabel={`Body composition summary. Fat ${latest.bodyFatPct.toFixed(1)} percent. Muscle ${latest.skeletalMusclePct.toFixed(1)} percent. Muscle score ${analytics.muscleScore} out of 100.`}
            style={{ gap: tokens.spacing.lg }}
          >
            <VStack spacing="sm">
              <Label weight="semibold">Body composition</Label>
              <Body>{compositionHeadline}</Body>
            </VStack>
            <HStack spacing="lg" align="center" justify="space-between" wrap>
              <Gauge value={analytics.muscleScore} label="Muscle score" />
              <VStack spacing="sm" style={{ flex: 1, minWidth: 160 }}>
                <Body>{compositionInsight}</Body>
                <Body>{loggingSupportMessage}</Body>
              </VStack>
            </HStack>
            <HStack spacing="md" wrap>
              <View
                style={{
                  backgroundColor: tokens.colors.surface,
                  borderRadius: tokens.radius.input,
                  borderWidth: 1,
                  borderColor: tokens.colors.mutedBorder,
                  paddingHorizontal: tokens.spacing.lg,
                  paddingVertical: tokens.spacing.md,
                  flexGrow: 1,
                  minWidth: 140,
                }}
              >
                <VStack spacing="xs">
                  <Body weight="semibold" color={tokens.colors.text}>
                    Body fat
                  </Body>
                  <MetricNumber style={{ fontSize: tokens.typography.subheading + 2 }}>
                    {latest.bodyFatPct.toFixed(1)}%
                  </MetricNumber>
                  <Body color={tokens.colors.textSecondary}>Latest reading</Body>
                </VStack>
              </View>
              <View
                style={{
                  backgroundColor: tokens.colors.surface,
                  borderRadius: tokens.radius.input,
                  borderWidth: 1,
                  borderColor: tokens.colors.mutedBorder,
                  paddingHorizontal: tokens.spacing.lg,
                  paddingVertical: tokens.spacing.md,
                  flexGrow: 1,
                  minWidth: 140,
                }}
              >
                <VStack spacing="xs">
                  <Body weight="semibold" color={tokens.colors.text}>
                    Muscle
                  </Body>
                  <MetricNumber style={{ fontSize: tokens.typography.subheading + 2 }}>
                    {latest.skeletalMusclePct.toFixed(1)}%
                  </MetricNumber>
                  <Body color={tokens.colors.textSecondary}>Latest reading</Body>
                </VStack>
              </View>
            </HStack>
            <Pressable
              accessibilityRole="link"
              accessibilityLabel="See full composition trends"
              onPress={() => router.push('/(tabs)/trends')}
              style={{ paddingVertical: tokens.spacing.xs }}
            >
              <Body weight="semibold" color={tokens.colors.accentSecondary}>
                See full composition trends
              </Body>
            </Pressable>
          </Card>
        </Animated.View>

        <Card
          gradient
          style={{ gap: tokens.spacing.lg }}
          accessibilityLabel={`Encouragement. ${encouragement.message} ${streakDays > 0 ? `Current streak ${streakDays} days.` : ''}`}
        >
          <HStack spacing="sm" align="center" wrap>
            <View
              style={{
                backgroundColor: 'rgba(255,255,255,0.18)',
                borderRadius: tokens.radius.pill,
                paddingHorizontal: tokens.spacing.md,
                paddingVertical: tokens.spacing.xs + 2,
              }}
            >
              <Body color={tokens.colors.surface} weight="semibold">
                {streakLabel}
              </Body>
            </View>
          </HStack>
          <Body color={tokens.colors.surface}>{encouragement.message}</Body>
          <Button
            label={encouragementButtonLabel}
            accessibilityLabel={encouragementButtonLabel}
            onPress={encouragementOnPress}
          />
        </Card>
      </VStack>
    </Screen>
  );
}
