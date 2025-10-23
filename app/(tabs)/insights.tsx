import { ActivityIndicator, View } from 'react-native';
import { Screen, Heading, Card, VStack, HStack, Body, Icon, Chip, EmptyState } from '../../components';
import { useTheme } from '../../theme';
import { useUser } from '../../hooks/useUser';
import { useReadings } from '../../hooks/useReadings';
import { useAnalytics } from '../../hooks/useAnalytics';
import { formatWeeklyChange } from '../../utils/format';

const dosePhases = ['2.5mg', '5mg', '7.5mg', '10mg+'];

export default function InsightsScreen() {
  const { tokens } = useTheme();
  const { user, loading: loadingUser } = useUser();
  const { readings, loading: loadingReadings } = useReadings(user?.id);
  const analytics = useAnalytics(user, readings);

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
        <Card>
          <Body weight="semibold" color={tokens.colors.textSecondary}>
            Dose phases
          </Body>
          <HStack spacing="sm" wrap style={{ marginTop: tokens.spacing.md }}>
            {dosePhases.map((dose) => (
              <Chip key={dose} label={dose} />
            ))}
          </HStack>
        </Card>

        <VStack spacing="md">
          {insights.map((item) => (
            <Card key={item.title} style={{ flexDirection: 'row', alignItems: 'center', gap: tokens.spacing.lg }}>
              <Icon name={item.icon as any} size={28} color={tokens.colors.accentSecondary} />
              <VStack spacing="xs" style={{ flex: 1 }}>
                <Body weight="semibold" color={tokens.colors.text}>
                  {item.title}
                </Body>
                <Body>{item.description}</Body>
              </VStack>
            </Card>
          ))}
        </VStack>
      </VStack>
    </Screen>
  );
}
