import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Screen, Heading, Card, ProgressBar, MetricNumber, Body, HStack, VStack, MiniLineChart, Gauge, EmptyState } from '../../components';
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
  const router = useRouter();

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
          <HStack spacing="xl" align="center" justify="space-between">
            <VStack spacing="sm" style={{ flex: 1 }}>
              <Body weight="semibold" color={tokens.colors.textSecondary}>
                Muscle Preservation
              </Body>
              <Body>Steady effort keeps you strong.</Body>
            </VStack>
            <Gauge value={analytics.muscleScore} label="Score" />
          </HStack>
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
