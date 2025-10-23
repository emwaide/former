import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Card, Icon, ProgressBar } from '../components';
import { useTheme } from '../theme';
import { formatWeight, formatWeeklyChange } from '../utils/format';
import { UnitSystem } from '../types/db';

type DashboardScreenProps = {
  headerSubtitle: string;
  progressValue: number;
  startWeightKg: number;
  currentWeightKg: number;
  goalWeightKg: number;
  weeklyChangeKg: number;
  weeklyChangeLabel: string;
  previousWeightLabel: string;
  previousCheckInDate?: string;
  fatStartPct?: number;
  fatCurrentPct?: number;
  muscleScore: number;
  unitSystem: UnitSystem;
  onLogPress: () => void;
};

const guidanceCopy = 'Keep your rhythm — small steps matter.';

const muscleDescriptor = (score: number) => {
  if (score >= 85) return 'Muscle thriving';
  if (score >= 70) return 'Muscle stable';
  if (score >= 50) return 'Muscle watch';
  return 'Muscle focus';
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

const DashboardScreen = ({
  headerSubtitle,
  progressValue,
  startWeightKg,
  currentWeightKg,
  goalWeightKg,
  weeklyChangeKg,
  weeklyChangeLabel,
  previousWeightLabel,
  previousCheckInDate,
  fatStartPct,
  fatCurrentPct,
  muscleScore,
  unitSystem,
  onLogPress,
}: DashboardScreenProps) => {
  const { tokens } = useTheme();
  const insets = useSafeAreaInsets();

  const startWeight = formatWeight(startWeightKg, unitSystem);
  const currentWeight = formatWeight(currentWeightKg, unitSystem);
  const goalWeight = formatWeight(goalWeightKg, unitSystem);
  const progressPercent = Math.round(progressValue * 100);
  const weeklyChangeText = weeklyChangeLabel || formatWeeklyChange(weeklyChangeKg, unitSystem);
  const momentumCaption = composeMomentumCaption(previousWeightLabel, previousCheckInDate);
  const fatStart = fatStartPct ?? fatCurrentPct ?? 0;
  const fatCurrent = fatCurrentPct ?? fatStartPct ?? 0;
  const fatLabel = formatCompositionDelta(fatStart, fatCurrent);
  const muscleLabel = `${muscleDescriptor(muscleScore)} (${Math.round(muscleScore)}/100)`;

  return (
    <View style={[styles.container, { backgroundColor: tokens.colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: 32 + insets.top,
            paddingBottom: Math.max(32, insets.bottom + 64),
            paddingHorizontal: 24,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text
            style={{
              color: tokens.colors.text,
              fontFamily: tokens.typography.fontFamilyAlt,
              fontSize: tokens.typography.heading,
              lineHeight: 30,
            }}
          >
            Your Progress
          </Text>
          <Text
            style={{
              color: tokens.colors.textSecondary,
              fontFamily: tokens.typography.fontFamilyMedium,
              fontSize: tokens.typography.subheading,
              lineHeight: 24,
            }}
          >
            {headerSubtitle}
          </Text>
        </View>

        <Card accessibilityLabel={`Goal progress: ${progressPercent} percent complete.`} style={{ gap: 16 }}>
          <View style={styles.progressRows}>
            {[
              { label: 'Start', value: startWeight },
              { label: 'Current', value: currentWeight },
              { label: 'Goal', value: goalWeight },
            ].map((row) => (
              <View key={row.label} style={styles.progressRow}>
                <Text
                  style={{
                    color: tokens.colors.textSecondary,
                    fontFamily: tokens.typography.fontFamilyMedium,
                    fontSize: tokens.typography.body,
                  }}
                >
                  {row.label}
                </Text>
                <View style={styles.progressValueGroup}>
                  <View
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: tokens.colors.accentSecondary,
                    }}
                  />
                  <Text
                    style={{
                      color: tokens.colors.text,
                      fontFamily: tokens.typography.fontFamilyMedium,
                      fontSize: tokens.typography.body,
                    }}
                  >
                    {row.value}
                  </Text>
                </View>
              </View>
            ))}
          </View>
          <ProgressBar value={progressValue} />
          <Text
            style={{
              color: tokens.colors.textSecondary,
              fontFamily: tokens.typography.fontFamily,
              fontSize: tokens.typography.body,
              lineHeight: 20,
            }}
          >
            {guidanceCopy}
          </Text>
        </Card>

        <Card
          accessibilityLabel={`This week's change: ${weeklyChangeText}. ${momentumCaption}`}
          style={{ gap: 12 }}
        >
          <Text
            style={{
              color: tokens.colors.textSecondary,
              fontFamily: tokens.typography.fontFamilyMedium,
              fontSize: tokens.typography.caption,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
            }}
          >
            This week’s change
          </Text>
          <Text
            style={{
              color: tokens.colors.accent,
              fontFamily: tokens.typography.fontFamilyAlt,
              fontSize: 32,
              lineHeight: 36,
            }}
          >
            {weeklyChangeText}
          </Text>
          <Text
            style={{
              color: tokens.colors.textSecondary,
              fontFamily: tokens.typography.fontFamily,
              fontSize: tokens.typography.body,
              lineHeight: 20,
            }}
          >
            {momentumCaption}
          </Text>
        </Card>

        <View style={styles.compositionRow}>
          <Card accessibilityLabel={`Body composition update: ${fatLabel}.`} style={[styles.compositionCard, { gap: 12 }]}>
            <View style={styles.compositionIcon}>
              <Icon name="trending-down" size={20} color={tokens.colors.accentSecondary} accessibilityLabel={fatLabel} />
            </View>
            <Text
              style={{
                color: tokens.colors.text,
                fontFamily: tokens.typography.fontFamilyMedium,
                fontSize: tokens.typography.body,
              }}
            >
              {fatLabel}
            </Text>
            <Text
              style={{
                color: tokens.colors.textSecondary,
                fontFamily: tokens.typography.fontFamily,
                fontSize: tokens.typography.caption,
              }}
            >
              vs start
            </Text>
          </Card>
          <Card accessibilityLabel={`Muscle balance: ${muscleLabel}.`} style={[styles.compositionCard, { gap: 12 }]}>
            <View style={styles.compositionIcon}>
              <Icon name="activity" size={20} color={tokens.colors.accentSecondary} accessibilityLabel={muscleLabel} />
            </View>
            <Text
              style={{
                color: tokens.colors.text,
                fontFamily: tokens.typography.fontFamilyMedium,
                fontSize: tokens.typography.body,
              }}
            >
              {muscleLabel}
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
          </Card>
        </View>

        <Button label="+ Log New Entry" onPress={onLogPress} accessibilityLabel="Log a new entry" />
      </ScrollView>
    </View>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    gap: 24,
  },
  header: {
    gap: 8,
  },
  progressRows: {
    gap: 12,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressValueGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  compositionRow: {
    flexDirection: 'row',
    gap: 16,
  },
  compositionCard: {
    flex: 1,
  },
  compositionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(34, 87, 122, 0.08)',
  },
});
