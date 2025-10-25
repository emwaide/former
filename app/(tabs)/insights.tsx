import { ActivityIndicator, View } from 'react-native';
import { Screen, Heading, Card, VStack, HStack, Body, Icon, Chip, EmptyState } from '../../components';
import { useUser } from '../../hooks/useUser';
import { useReadings } from '../../hooks/useReadings';
import { useAnalytics } from '../../hooks/useAnalytics';
import { formatWeeklyChange } from '../../utils/format';

const dosePhases = ['2.5mg', '5mg', '7.5mg', '10mg+'];

export default function InsightsScreen() {
  const { user, loading: loadingUser } = useUser();
  const { readings, loading: loadingReadings } = useReadings(user?.id);
  const analytics = useAnalytics(user, readings);

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
          title="Insights coming soon"
          description="Once you have a few readings logged, you will see personalized nudges here."
          actionLabel="Log a reading"
        />
      </Screen>
    );
  }

  const insights = [
    {
      icon: 'trending-down',
      title: 'Mostly fat loss this week',
      description: `${formatWeeklyChange(analytics.weeklyChangeKg, user.unitSystem)} vs last week`,
    },
    {
      icon: 'droplet',
      title: analytics.hydrationLow ? 'Hydration trending low' : 'Hydration steady',
      description: analytics.hydrationLow
        ? 'Body water dipped below your rolling baseline. Focus on fluids.'
        : 'Water balance stayed aligned with baseline.',
    },
    {
      icon: 'shield',
      title: 'Muscle steady',
      description: `Preservation score ${analytics.muscleScore}`,
    },
  ];

  return (
    <Screen>
      <VStack spacing="xl">
        <Heading>Insights</Heading>
        <Card className="gap-4">
          <Body className="font-[Poppins_600SemiBold] text-muted">Dose phases</Body>
          <HStack spacing="sm" wrap className="mt-4">
            {dosePhases.map((dose) => (
              <Chip key={dose} label={dose} />
            ))}
          </HStack>
        </Card>

        <VStack spacing="md">
          {insights.map((item) => (
            <Card key={item.title} className="flex-row items-center gap-6">
              <Icon name={item.icon as any} size={28} color="#42E2B8" />
              <VStack spacing="xs" className="flex-1">
                <Body className="font-[Poppins_600SemiBold] text-charcoal">{item.title}</Body>
                <Body>{item.description}</Body>
              </VStack>
            </Card>
          ))}
        </VStack>
      </VStack>
    </Screen>
  );
}
