import { Pressable, StyleSheet, Text, View } from 'react-native';
import { palette, spacing, typography, cardShadow } from './constants';

type StreakCardProps = {
  loggedDays: boolean[];
  loggedCount: number;
  onViewHistory?: () => void;
};

export const StreakCard = ({ loggedDays, loggedCount, onViewHistory }: StreakCardProps) => (
  <View style={styles.card}>
    <View style={styles.header}>
      <Text style={styles.title}>Consistency</Text>
      {onViewHistory ? (
        <Pressable accessibilityRole="button" onPress={onViewHistory} hitSlop={8}>
          <Text style={styles.linkText}>View history →</Text>
        </Pressable>
      ) : null}
    </View>
    <Text style={styles.subtitle}>{`${loggedCount} of 7 days logged this week.`}</Text>
    <View style={styles.dotsRow} accessibilityRole="image" accessibilityLabel={`${loggedCount} days logged this week`}>
      {loggedDays.map((day, index) => (
        <View key={index} style={[styles.dot, day ? styles.dotFilled : styles.dotEmpty]} />
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: spacing.lg,
    gap: spacing.md,
    ...cardShadow,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: palette.navy,
    fontSize: typography.subtitle,
    fontFamily: 'Inter_600SemiBold',
  },
  linkText: {
    color: 'rgba(3,4,94,0.65)',
    fontSize: typography.caption,
    fontFamily: 'Inter_500Medium',
  },
  subtitle: {
    color: palette.navy,
    fontSize: typography.body,
    fontFamily: 'Inter_400Regular',
  },
  dotsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  dot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: palette.aquaSoft,
  },
  dotFilled: {
    backgroundColor: palette.blueLight,
    borderColor: palette.blueLight,
  },
  dotEmpty: {
    backgroundColor: 'transparent',
  },
});

export default StreakCard;
