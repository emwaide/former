import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Link } from 'expo-router';
import {
  Screen,
  Heading,
  Card,
  ProgressBar,
  MetricNumber,
  Body,
  HStack,
  VStack,
  MiniLineChart,
  Gauge,
  EmptyState,
} from '../../components';
import { useTheme } from '../../theme';
import { useUser } from '../../hooks/useUser';
import { useReadings } from '../../hooks/useReadings';
import { useAnalytics, Analytics } from '../../hooks/useAnalytics';
import { formatWeight, formatWeeklyChange, sortReadingsDesc } from '../../utils/format';
import { Reading, UserProfile } from '../../types/db';

type DashboardContentProps = {
  loading: boolean;
  user: UserProfile | null;
  readings: Reading[];
  analytics: Analytics;
};

export const DashboardContent = ({ loading, user, readings, analytics }: DashboardContentProps) => {
  const { tokens } = useTheme();

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
                This Week's Change
              </Body>
              <MetricNumber style={{ fontSize: 32 }} color={analytics.weeklyChangeKg <= 0 ? tokens.colors.accent : tokens.colors.accentTertiary}>
                {formatWeeklyChange(analytics.weeklyChangeKg, user.unitSystem)}
              </MetricNumber>
              <Body>vs previous week</Body>
            </VStack>
          </Card>
          <Card style={{ flex: 1, minWidth: 180 }}>
            <Body weight="semibold" color={tokens.colors.textSecondary}>
              Weight vs Predicted
            </Body>
            <MiniLineChart
              series={[
                {
                  points: analytics.weeklyActualKg.map((point) => point.weightKg),
                  color: tokens.colors.accentSecondary,
                },
                {
                  points: analytics.predictedWeights.map((point) => point.targetWeightKg),
                  color: tokens.colors.accentTertiary,
                  dashed: true,
                },
              ]}
            />
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
