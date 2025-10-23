import { useMemo } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Button, Screen, Heading, Card, ProgressBar, MetricNumber, Body, HStack, VStack, MiniLineChart, Gauge, EmptyState, Icon } from '../../components';
import { useTheme } from '../../theme';
import { useUser } from '../../hooks/useUser';
import { useReadings } from '../../hooks/useReadings';
import { useAnalytics, Analytics } from '../../hooks/useAnalytics';
import { formatWeight, formatWeeklyChange, sortReadingsDesc } from '../../utils/format';
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

export const DashboardContent = ({ loading, user, readings, analytics }: DashboardContentProps) => {
  const { tokens } = useTheme();
  const router = useRouter();

  const weeklyLogs = useMemo(
    () => analytics.logsThisWeek ?? countRecentLogs(readings),
    [analytics.logsThisWeek, readings],
  );
  const streakDays = useMemo(() => countConsecutiveLogDays(readings), [readings]);
  const guidance = useMemo(() => buildGuidance(analytics, weeklyLogs), [analytics, weeklyLogs]);
  const streakCopy = streakDays > 1 ? `${streakDays}-day streak` : streakDays === 1 ? '1-day streak' : 'Start your streak';

  const handlePrimaryAction = () => {
    router.push('/(tabs)/log');
  };

  if (loading) {
    return (
      <Screen>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={tokens.colors.accentSecondary} />
        </View>
      </Screen>
    );
  }

  if (!user || readings.length === 0) {
    return (
      <Screen>
        <EmptyState
          title="No readings yet"
          description="Track your first reading to see progress trends, predictions, and insights."
          actionLabel="Add first reading"
        />
      </Screen>
    );
  }

  const latest = sortReadingsDesc(readings)[0];
  const weeklyChangeLabel = formatWeeklyChange(analytics.weeklyChangeKg, user.unitSystem);

  const muscleDescriptor = (() => {
    if (analytics.muscleScore >= 80) return 'Muscle thriving';
    if (analytics.muscleScore >= 60) return 'Muscle steady';
    if (analytics.muscleScore >= 40) return 'Muscle dipping';
    return 'Muscle at risk';
  })();

  const fatTrend = analytics.fatLossPct > 0 ? `Fat ↓${analytics.fatLossPct.toFixed(1)}%` : 'Fat steady';
  const compositionHeadline = `${muscleDescriptor} · ${fatTrend}`;
  const latestFatPct = latest.bodyFatPct;
  const latestMusclePct = latest.skeletalMusclePct;

  return (
    <Screen>
      <VStack spacing="xl">
        <Heading>Welcome back, {user.name}</Heading>
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
            <Button label={guidance.actionLabel} accessibilityLabel={guidance.actionLabel} onPress={handlePrimaryAction} />
          </VStack>
        </Card>
        <Card>
          <VStack spacing="lg">
            <Body weight="semibold" color={tokens.colors.textSecondary}>
              Goal progress
            </Body>
            <MetricNumber>{formatWeight(latest.weightKg, user.unitSystem)}</MetricNumber>
            <ProgressBar value={analytics.progressPercent} label={`${Math.round(analytics.progressPercent * 100)}% to goal`} />
          </VStack>
        </Card>

        <HStack spacing="xl" align="stretch" style={{ flexWrap: 'wrap' }}>
          <Card style={{ flex: 1, minWidth: 160 }}>
            <VStack spacing="sm">
              <Body weight="semibold" color={tokens.colors.textSecondary}>
                This Week’s Change
              </Body>
              <MetricNumber style={{ fontSize: 32 }} color={analytics.weeklyChangeKg <= 0 ? tokens.colors.accent : tokens.colors.accentTertiary}>
                {formatWeeklyChange(analytics.weeklyChangeKg, user.unitSystem)}
              </MetricNumber>
              <Body>vs previous week</Body>
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
                    points: analytics.weeklyActualKg.map((point) => point.weightKg),
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
                  <Gauge value={analytics.muscleScore} label="Muscle score" />
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
                <Body
                  weight="semibold"
                  color={tokens.colors.accentSecondary}
                  style={{ textDecorationLine: 'underline' }}
                >
                  See full composition trends
                </Body>
              </Link>
            </VStack>
          </VStack>
        </Card>
      </VStack>
    </Screen>
  );
};

export default function DashboardScreen() {
  const { user, loading: loadingUser } = useUser();
  const { readings, loading: loadingReadings } = useReadings(user?.id);
  const analytics = useAnalytics(user, readings);

  return <DashboardContent loading={loadingUser || loadingReadings} user={user} readings={readings} analytics={analytics} />;
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
