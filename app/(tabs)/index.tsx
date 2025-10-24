import { ReactNode, useMemo } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle } from 'react-native-svg';
import { Link, useRouter } from 'expo-router';
import {
  Body,
  Button,
  Card,
  EmptyState,
  Gauge,
  HStack,
  Icon,
  MetricNumber,
  MiniLineChart,
  ProgressBar,
  Screen,
  VStack,
} from '../../components';
import { useTheme } from '../../theme';
import { useUser } from '../../hooks/useUser';
import { useReadings } from '../../hooks/useReadings';
import { useAnalytics, Analytics } from '../../hooks/useAnalytics';
import { formatDate, formatWeight, formatWeeklyChange, sortReadingsDesc } from '../../utils/format';
import { countConsecutiveLogDays, countRecentLogs } from '../../utils/logs';
import { Reading, UserProfile } from '../../types/db';

type DashboardContentProps = {
  loading: boolean;
  user: UserProfile | null;
  readings: Reading[];
  analytics: Analytics;
};

type Guidance = {
  copy: string;
  actionLabel: string;
};

const LoadingState = () => {
  const { tokens } = useTheme();

  return (
    <Screen scrollable={false} padded={false}>
      <View style={[styles.centered, { backgroundColor: tokens.colors.background }]}> 
        <ActivityIndicator size="large" color={tokens.colors.accentSecondary} />
      </View>
    </Screen>
  );
};

const buildGuidance = (analytics: Analytics, logsThisWeek: number): Guidance => {
  if (analytics.hydrationLow) {
    return {
      copy: 'Hydration dipped this week — a glass before lunch keeps recovery on track.',
      actionLabel: 'Log hydration',
    };
  }

  if (logsThisWeek < 3) {
    const logCopy =
      logsThisWeek === 0
        ? 'No entries yet — jot one down to keep trends sharp.'
        : `${logsThisWeek} ${logsThisWeek === 1 ? 'log' : 'logs'} so far — one more locks in the pattern.`;
    return {
      copy: logCopy,
      actionLabel: 'Log new entry',
    };
  }

  return {
    copy: `${analytics.weeklyChangeLabel}. Keep capturing details to stay ahead.`,
    actionLabel: 'Log new entry',
  };
};

const muscleDescriptor = (score: number) => {
  if (score >= 85) return 'Muscle thriving';
  if (score >= 70) return 'Muscle stable';
  if (score >= 50) return 'Muscle watch';
  return 'Muscle focus';
};

const summaryMuscleDescriptor = (score: number) => {
  if (score >= 80) return 'Muscle thriving';
  if (score >= 60) return 'Muscle steady';
  if (score >= 40) return 'Muscle dipping';
  return 'Muscle at risk';
};

const formatCompositionDelta = (start: number, current: number) => {
  const delta = start - current;
  if (Math.abs(delta) < 0.05) {
    return 'Fat steady';
  }
  const direction = delta > 0 ? '↓' : '↑';
  return `Fat ${direction} ${Math.abs(delta).toFixed(1)}%`;
};

const composeMomentumCaption = (weight: string, date?: string) => {
  if (!date) {
    return `Previously ${weight} on your last check-in.`;
  }
  return `Previously ${weight} on ${date}.`;
};

type ProgressRingProps = {
  progress: number;
  size?: number;
  strokeWidth?: number;
  trackColor: string;
  trackOpacity?: number;
  progressColor: string;
  children?: ReactNode;
};

const ProgressRing = ({
  progress,
  size = 175,
  strokeWidth = 10,
  trackColor,
  trackOpacity = 0.16,
  progressColor,
  children,
}: ProgressRingProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(1, progress));
  const strokeDashoffset = circumference * (1 - clamped);

  return (
    <View style={{ height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          opacity={trackOpacity}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={progressColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={styles.progressCenter}>{children}</View>
    </View>
  );
};

export const DashboardContent = ({ loading, user, readings, analytics }: DashboardContentProps) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { tokens } = useTheme();

  const weeklyLogs = useMemo(
    () => analytics.logsThisWeek ?? countRecentLogs(readings),
    [analytics.logsThisWeek, readings],
  );
  const streakDays = useMemo(() => countConsecutiveLogDays(readings), [readings]);
  const guidance = useMemo(() => buildGuidance(analytics, weeklyLogs), [analytics, weeklyLogs]);
  const streakCopy = streakDays > 1 ? `${streakDays}-day streak` : streakDays === 1 ? '1-day streak' : 'Start your streak';

  const sorted = useMemo(() => sortReadingsDesc(readings), [readings]);

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

  const progressValue = Math.max(0, Math.min(1, analytics.progressPercent ?? 0));
  const progressPercent = Math.round(progressValue * 100);
  const startWeight = formatWeight(user.startWeightKg, user.unitSystem);
  const currentWeight = formatWeight(latest.weightKg, user.unitSystem);
  const goalWeight = formatWeight(user.targetWeightKg, user.unitSystem);
  const weeklyChangeLabel = formatWeeklyChange(analytics.weeklyChangeKg ?? 0, user.unitSystem);
  const previousWeightLabel = formatWeight(previous.weightKg, user.unitSystem);
  const previousCheckInDate = previous ? formatDate(previous.takenAt) : undefined;
  const momentumCaption = composeMomentumCaption(previousWeightLabel, previousCheckInDate);
  const fatStart = first?.bodyFatPct ?? latest.bodyFatPct ?? 0;
  const fatCurrent = latest.bodyFatPct ?? fatStart;
  const fatLabel = formatCompositionDelta(fatStart, fatCurrent);
  const hasFatStart = typeof first?.bodyFatPct === 'number';
  const fatStartValue = hasFatStart ? first?.bodyFatPct ?? fatStart : fatStart;
  const safeFatStart = Math.max(0, Math.min(100, fatStartValue));
  const safeFatCurrent = Math.max(0, Math.min(100, fatCurrent));
  const muscleScore = analytics.muscleScore ?? 0;
  const muscleStatus = muscleDescriptor(muscleScore);
  const muscleScoreLabel = `${Math.round(muscleScore)}/100`;
  const muscleLabel = `${muscleStatus} (${muscleScoreLabel})`;
  const muscleNormalized = Math.min(1, Math.max(0, muscleScore / 100));
  const fatTrend = analytics.fatLossPct > 0 ? `Fat ↓${analytics.fatLossPct.toFixed(1)}%` : 'Fat steady';
  const compositionHeadline = `${summaryMuscleDescriptor(muscleScore)} · ${fatTrend}`;
  const latestFatPct = latest.bodyFatPct ?? 0;
  const latestMusclePct = latest.skeletalMusclePct ?? 0;
  const weeklySeries = analytics.weeklyActualKg?.map((point) => point.weightKg) ?? [];

  return (
    <View style={[styles.container, { backgroundColor: tokens.colors.background }]}> 
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom: Math.max(tokens.spacing['2xl'], insets.bottom + tokens.spacing.lg),
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={['#F2F7FF', '#DCEAFF', '#B8D8FF']}
          locations={[0, 0.55, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[styles.hero, { paddingTop: insets.top + tokens.spacing.md }]}
        >
          <LinearGradient
            pointerEvents="none"
            colors={['rgba(255, 255, 255, 0.78)', 'rgba(255, 255, 255, 0)']}
            start={{ x: 0.2, y: 0 }}
            end={{ x: 0.8, y: 1 }}
            style={styles.heroHighlight}
          />
          <View style={styles.heroHeader} />
          <View style={styles.heroCopy}>
            <Text
              style={{
                color: tokens.colors.text,
                fontFamily: tokens.typography.fontFamilyAlt,
                fontSize: 30,
                lineHeight: 32,
                letterSpacing: 2,
              }}
            >
              {`Welcome back, ${user.name}!`}
            </Text>
            <Text
              style={{
                color: tokens.colors.textSecondary,
                fontFamily: tokens.typography.fontFamily,
                fontSize: tokens.typography.body,
              }}
            >
              {`Currently ${currentWeight} — aiming for ${goalWeight}`}
            </Text>
          </View>
          <ProgressRing
            progress={progressValue}
            trackColor="rgba(34, 87, 122, 0.18)"
            trackOpacity={1}
            progressColor={tokens.colors.accentSecondary}
          >
            <Text
              style={{
                color: tokens.colors.accentSecondary,
                fontFamily: tokens.typography.fontFamilyAlt,
                fontSize: 52,
                lineHeight: 56,
                letterSpacing: -0.5,
              }}
            >
              {progressPercent}%
            </Text>
            <Text
              style={{
                color: tokens.colors.accentSecondary,
                fontFamily: tokens.typography.fontFamilyMedium,
                fontSize: tokens.typography.body,
                letterSpacing: 1,
              }}
            >
              to goal
            </Text>
          </ProgressRing>
          <View style={styles.heroStatsRow}>
            {[
              { label: 'Start', value: startWeight },
              { label: 'Now', value: currentWeight },
              { label: 'Goal', value: goalWeight },
            ].map((item) => (
              <View key={item.label} style={styles.heroStat}>
                <Text
                  style={{
                    color: 'rgba(23, 51, 74, 0.55)',
                    fontFamily: tokens.typography.fontFamilyMedium,
                    fontSize: tokens.typography.caption,
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                  }}
                >
                  {item.label}
                </Text>
                <Text
                  style={{
                    color: tokens.colors.accentSecondary,
                    fontFamily: tokens.typography.fontFamilyAlt,
                    fontSize: tokens.typography.body,
                    letterSpacing: 0.4,
                  }}
                >
                  {item.value}
                </Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        <View style={[styles.section, { gap: tokens.spacing.xl }]}> 
          <Card
            gradient
            accessibilityLabel={`${guidance.copy} Suggested action: ${guidance.actionLabel}.`}
            style={{ padding: tokens.spacing.xl }}
          >
            <VStack spacing="lg">
              <HStack align="flex-start" justify="space-between">
                <VStack spacing="sm" style={{ flex: 1 }}>
                  <Body weight="semibold" color={tokens.colors.surface}>
                    Today’s guidance
                  </Body>
                  <Body color={tokens.colors.surface} style={{ lineHeight: 22 }}>
                    {guidance.copy}
                  </Body>
                </VStack>
                <View
                  accessible
                  accessibilityLabel={`Logging streak: ${streakCopy}`}
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.16)',
                    borderRadius: tokens.radius.pill,
                    paddingHorizontal: tokens.spacing.sm,
                    paddingVertical: tokens.spacing.xs,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: tokens.spacing.xs,
                  }}
                >
                  <Icon name="trending-up" size={16} color={tokens.colors.surface} />
                  <Body weight="semibold" color={tokens.colors.surface} style={{ fontSize: 14 }}>
                    {streakCopy}
                  </Body>
                </View>
              </HStack>
              <Button
                label={guidance.actionLabel}
                accessibilityLabel={guidance.actionLabel}
                onPress={() => router.push('/(tabs)/log')}
              />
            </VStack>
          </Card>

          <Card>
            <VStack spacing="lg">
              <Body weight="semibold" color={tokens.colors.textSecondary}>
                Goal progress
              </Body>
              <MetricNumber>{currentWeight}</MetricNumber>
              <ProgressBar value={progressValue} label={`${progressPercent}% to goal`} />
            </VStack>
          </Card>

          <HStack spacing="xl" align="stretch" style={{ flexWrap: 'wrap' }}>
            <Card style={{ flex: 1, minWidth: 160 }}>
              <VStack spacing="sm">
                <Body weight="semibold" color={tokens.colors.textSecondary}>
                  This Week’s Change
                </Body>
                <MetricNumber
                  style={{ fontSize: 32 }}
                  color={analytics.weeklyChangeKg <= 0 ? tokens.colors.accent : tokens.colors.accentTertiary}
                >
                  {weeklyChangeLabel}
                </MetricNumber>
                <Body>{momentumCaption}</Body>
              </VStack>
            </Card>
            <Card style={{ flex: 1, minWidth: 180 }}>
              <VStack spacing="md">
                <VStack spacing="xs">
                  <Body weight="semibold" color={tokens.colors.textSecondary}>
                    Weekly change chart
                  </Body>
                  <Body color={tokens.colors.textSecondary}>Past 7 days · latest point highlighted</Body>
                </VStack>
                <MiniLineChart
                  series={[
                    {
                      points: weeklySeries,
                      color: tokens.colors.accentSecondary,
                    },
                  ]}
                  accessibilityLabel={`Weekly change chart showing ${weeklyChangeLabel} versus the prior week.`}
                />
                <Body>{`Weekly change ${weeklyChangeLabel} versus last week.`}</Body>
                <Button
                  label="View trends"
                  variant="secondary"
                  onPress={() => router.push('/(tabs)/trends')}
                  accessibilityLabel="View detailed trends"
                />
              </VStack>
            </Card>
          </HStack>

          <Card>
            <VStack spacing="lg">
              <Body weight="semibold" color={tokens.colors.textSecondary}>
                Composition summary
              </Body>
              <VStack spacing="md">
                <Body weight="semibold" color={tokens.colors.text}>
                  {compositionHeadline}
                </Body>
                <HStack spacing="lg" align="center" justify="space-between" style={{ flexWrap: 'wrap' }}>
                  <View
                    style={{
                      alignItems: 'center',
                      paddingVertical: tokens.spacing.xs,
                    }}
                  >
                    <Gauge value={muscleScore} label="Muscle score" />
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      borderRadius: tokens.radius.pill,
                      borderWidth: 1,
                      borderColor: tokens.colors.mutedBorder,
                      backgroundColor: tokens.colors.surface,
                      paddingVertical: tokens.spacing.xs,
                      paddingHorizontal: tokens.spacing.md,
                      gap: tokens.spacing.lg,
                      minWidth: 180,
                    }}
                  >
                    <VStack spacing="xs" style={{ flex: 1 }} align="flex-start">
                      <Body weight="semibold" color={tokens.colors.textSecondary} style={{ fontSize: 13 }}>
                        Fat
                      </Body>
                      <Body weight="semibold" color={tokens.colors.text}>
                        {latestFatPct.toFixed(1)}%
                      </Body>
                    </VStack>
                    <View
                      style={{
                        width: 1,
                        alignSelf: 'stretch',
                        backgroundColor: tokens.colors.mutedBorder,
                      }}
                    />
                    <VStack spacing="xs" style={{ flex: 1 }} align="flex-start">
                      <Body weight="semibold" color={tokens.colors.textSecondary} style={{ fontSize: 13 }}>
                        Muscle
                      </Body>
                      <Body weight="semibold" color={tokens.colors.text}>
                        {latestMusclePct.toFixed(1)}%
                      </Body>
                    </VStack>
                  </View>
                </HStack>
                <Link
                  href="/(tabs)/trends"
                  style={{
                    alignSelf: 'flex-start',
                    paddingVertical: tokens.spacing.xs,
                  }}
                >
                  <Body weight="semibold" color={tokens.colors.accentSecondary} style={{ textDecorationLine: 'underline' }}>
                    See full composition trends
                  </Body>
                </Link>
              </VStack>
            </VStack>
          </Card>

          <View style={styles.compositionRow}>
            <Card
              accessibilityLabel={`Body composition update: ${fatLabel}.`}
              style={[styles.compositionCard, { backgroundColor: tokens.colors.card }]}
            >
              <View style={styles.compositionHeader}>
                <View style={[styles.compositionIcon, { backgroundColor: 'rgba(34, 87, 122, 0.12)' }]}> 
                  <Icon name="trending-down" size={20} color={tokens.colors.accentSecondary} accessibilityLabel={fatLabel} />
                </View>
                <Text
                  style={{
                    color: tokens.colors.textSecondary,
                    fontFamily: tokens.typography.fontFamilyMedium,
                    fontSize: tokens.typography.caption,
                    textTransform: 'uppercase',
                    letterSpacing: 0.8,
                  }}
                >
                  Body Fat
                </Text>
              </View>
              <Text
                style={{
                  color: tokens.colors.text,
                  fontFamily: tokens.typography.fontFamilyAlt,
                  fontSize: tokens.typography.body,
                }}
              >
                {fatLabel}
              </Text>
              <View style={styles.compositionMeter}>
                <View style={[styles.compositionMeterTrack, { backgroundColor: 'rgba(34, 87, 122, 0.16)' }]}> 
                  <View
                    style={[
                      styles.compositionMeterFill,
                      {
                        width: `${Math.min(100, Math.max(0, safeFatCurrent))}%`,
                        backgroundColor: tokens.colors.accentSecondary,
                      },
                    ]}
                  />
                </View>
                <View style={styles.compositionMeterMeta}>
                  <Text
                    style={{
                      color: tokens.colors.text,
                      fontFamily: tokens.typography.fontFamilyMedium,
                      fontSize: tokens.typography.caption,
                    }}
                  >
                    Current {safeFatCurrent.toFixed(1)}%
                  </Text>
                  {hasFatStart && (
                    <Text
                      style={{
                        color: tokens.colors.textSecondary,
                        fontFamily: tokens.typography.fontFamily,
                        fontSize: tokens.typography.caption,
                      }}
                    >
                      Start {safeFatStart.toFixed(1)}%
                    </Text>
                  )}
                </View>
              </View>
            </Card>

            <Card
              accessibilityLabel={`Muscle balance: ${muscleLabel}.`}
              style={[styles.compositionCard, { backgroundColor: tokens.colors.card }]}
            >
              <View style={styles.compositionHeader}>
                <View style={[styles.compositionIcon, { backgroundColor: 'rgba(34, 87, 122, 0.12)' }]}> 
                  <Icon name="activity" size={20} color={tokens.colors.accentSecondary} accessibilityLabel={muscleLabel} />
                </View>
                <Text
                  style={{
                    color: tokens.colors.textSecondary,
                    fontFamily: tokens.typography.fontFamilyMedium,
                    fontSize: tokens.typography.caption,
                    textTransform: 'uppercase',
                    letterSpacing: 0.8,
                  }}
                >
                  Muscle Tone
                </Text>
              </View>
              <Text
                style={{
                  color: tokens.colors.text,
                  fontFamily: tokens.typography.fontFamilyAlt,
                  fontSize: tokens.typography.body,
                }}
              >
                {muscleStatus}
              </Text>
              <View style={styles.compositionMeter}>
                <View style={[styles.compositionMeterTrack, { backgroundColor: 'rgba(34, 87, 122, 0.16)' }]}> 
                  <View
                    style={[
                      styles.compositionMeterFill,
                      {
                        width: `${Math.round(muscleNormalized * 100)}%`,
                        backgroundColor: tokens.colors.accentSecondary,
                      },
                    ]}
                  />
                </View>
                <View style={styles.compositionMeterMeta}>
                  <Text
                    style={{
                      color: tokens.colors.text,
                      fontFamily: tokens.typography.fontFamilyMedium,
                      fontSize: tokens.typography.caption,
                    }}
                  >
                    Score {muscleScoreLabel}
                  </Text>
                  <Text
                    style={{
                      color: tokens.colors.textSecondary,
                      fontFamily: tokens.typography.fontFamily,
                      fontSize: tokens.typography.caption,
                    }}
                  >
                    Strength trend
                  </Text>
                </View>
              </View>
            </Card>
          </View>

          <Button
            label="Log New Entry"
            onPress={() => router.push('/(tabs)/log')}
            accessibilityLabel="Log a new entry"
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default function DashboardRoute() {
  const { user, loading: loadingUser } = useUser();
  const { readings, loading: loadingReadings } = useReadings(user?.id);
  const analytics = useAnalytics(user, readings);

  return <DashboardContent loading={loadingUser || loadingReadings} user={user} readings={readings} analytics={analytics} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    gap: 24,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hero: {
    paddingHorizontal: 32,
    paddingBottom: 30,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    gap: 24,
    overflow: 'hidden',
  },
  heroHighlight: {
    ...StyleSheet.absoluteFillObject,
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  heroCopy: {
    gap: 8,
  },
  heroStatsRow: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  heroStat: {
    gap: 4,
    alignItems: 'center',
  },
  progressCenter: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    paddingHorizontal: 24,
  },
  compositionRow: {
    flexDirection: 'row',
    gap: 16,
    flexWrap: 'wrap',
  },
  compositionCard: {
    flex: 1,
    gap: 16,
    padding: 20,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  compositionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  compositionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compositionMeter: {
    gap: 8,
  },
  compositionMeterTrack: {
    height: 8,
    borderRadius: 999,
    overflow: 'hidden',
  },
  compositionMeterFill: {
    height: '100%',
    borderRadius: 999,
  },
  compositionMeterMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

