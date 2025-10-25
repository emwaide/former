import { useMemo, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Screen, Card, Chip, HStack, VStack, Heading, Body, MiniLineChart, StackedBar, EmptyState } from '../../components';
import { useUser } from '../../hooks/useUser';
import { useReadings } from '../../hooks/useReadings';
import { useAnalytics } from '../../hooks/useAnalytics';

const ranges: Record<string, number> = {
  '7d': 7,
  '30d': 30,
  '12w': 84,
};

export default function TrendsScreen() {
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
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#37D0B4" />
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
          {(Object.keys(ranges) as ('7d' | '30d' | '12w')[]).map((key) => (
            <Chip key={key} label={key.toUpperCase()} selected={range === key} onPress={() => setRange(key)} />
          ))}
        </HStack>

        <Card className="gap-4">
          <Body className="font-[Poppins_600SemiBold] text-muted">Weight vs Predicted</Body>
          <MiniLineChart
            series={[
              { points: weightSeries, color: '#42E2B8' },
              { points: predictedSeries, color: '#69E0DA', dashed: true },
            ]}
          />
        </Card>

        <Card className="gap-4">
          <Body className="font-[Poppins_600SemiBold] text-muted">Body Composition</Body>
          <MiniLineChart
            series={[
              { points: bodyFatSeries, color: '#69E0DA' },
              { points: muscleSeries, color: '#37D0B4' },
              { points: waterSeries, color: '#0EC4A6' },
            ]}
            height={140}
          />
        </Card>

        <Card className="gap-4">
          <Body className="font-[Poppins_600SemiBold] text-muted">Fat vs Lean (by week)</Body>
          <StackedBar data={analytics.composition} />
        </Card>
      </VStack>
    </Screen>
  );
}
