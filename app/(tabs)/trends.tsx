import { useMemo, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Screen, Card, Chip, HStack, VStack, Heading, Body, MiniLineChart, StackedBar, EmptyState } from '../../components';
import { useTheme } from '../../theme';
import { useUser } from '../../hooks/useUser';
import { useReadings } from '../../hooks/useReadings';
import { useAnalytics } from '../../hooks/useAnalytics';

const ranges: Record<string, number> = {
  '7d': 7,
  '30d': 30,
  '12w': 84,
};

export default function TrendsScreen() {
  const { tokens } = useTheme();
  const [range, setRange] = useState<'7d' | '30d' | '12w'>('30d');
  const { user, loading: loadingUser } = useUser();
  const { readings, loading: loadingReadings } = useReadings(user?.id);
  const analytics = useAnalytics(user, readings);

  const filtered = useMemo(() => {
    if (!readings.length) return [];
    if (range === '12w') return readings;
    const days = ranges[range];
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return readings.filter((reading) => new Date(reading.takenAt) >= cutoff);
  }, [range, readings]);

  if (loadingUser || loadingReadings) {
    return (
      <Screen>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={tokens.colors.accentSecondary} />
        </View>
      </Screen>
    );
  }

  if (!user || readings.length === 0) {
    return (
      <Screen>
        <EmptyState
          title="No trends yet"
          description="Log readings to unlock full body composition analytics and predictions."
          actionLabel="Add first reading"
        />
      </Screen>
    );
  }

  const weightSeries = filtered.map((reading) => reading.weightKg);
  const predictedSeries = analytics.predictedWeights.slice(0, weightSeries.length).map((point) => point.targetWeightKg);
  const bodyFatSeries = filtered.map((reading) => reading.bodyFatPct);
  const muscleSeries = filtered.map((reading) => reading.skeletalMusclePct);
  const waterSeries = filtered.map((reading) => reading.bodyWaterPct);

  return (
    <Screen>
      <VStack spacing="xl">
        <Heading>Trends</Heading>
        <HStack spacing="sm" wrap>
          {(Object.keys(ranges) as Array<'7d' | '30d' | '12w'>).map((key) => (
            <Chip key={key} label={key.toUpperCase()} selected={range === key} onPress={() => setRange(key)} />
          ))}
        </HStack>

        <Card>
          <Body weight="semibold" color={tokens.colors.textSecondary}>
            Weight vs Predicted
          </Body>
          <MiniLineChart
            series={[
              { points: weightSeries, color: tokens.colors.accentSecondary },
              { points: predictedSeries, color: tokens.colors.accentTertiary, dashed: true },
            ]}
          />
        </Card>

        <Card>
          <Body weight="semibold" color={tokens.colors.textSecondary}>
            Body Composition
          </Body>
          <MiniLineChart
            series={[
              { points: bodyFatSeries, color: tokens.colors.accentTertiary },
              { points: muscleSeries, color: tokens.colors.accentSecondary },
              { points: waterSeries, color: tokens.colors.accent },
            ]}
            height={140}
          />
        </Card>

        <Card>
          <Body weight="semibold" color={tokens.colors.textSecondary}>
            Fat vs Lean (by week)
          </Body>
          <StackedBar data={analytics.composition} />
        </Card>
      </VStack>
    </Screen>
  );
}
