import { StyleSheet, Text, View } from 'react-native';
import { beachPalette, shadow, spacing } from './palette';

type ConsistencyDay = {
  label: string;
  filled: boolean;
};

type ConsistencyCardProps = {
  loggedSummary: string;
  streakSummary: string;
  days: ConsistencyDay[];
  accessibilityLabel: string;
};

export const ConsistencyCard = ({ loggedSummary, streakSummary, days, accessibilityLabel }: ConsistencyCardProps) => {
  return (
    <View accessible accessibilityLabel={accessibilityLabel} style={[styles.card, styles.shadow]}>
      <Text style={styles.title}>CONSISTENCY</Text>
      <Text style={styles.body}>{loggedSummary}</Text>
      <Text style={styles.body}>{streakSummary}</Text>
      <View style={styles.daysRow}>
        {days.map((day) => (
          <View
            key={day.label}
            accessible
            accessibilityRole="text"
            style={[styles.day, day.filled ? styles.dayFilled : styles.dayEmpty]}
            accessibilityLabel={`${day.label}: ${day.filled ? 'logged' : 'not logged'}`}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: beachPalette.card,
    borderRadius: 16,
    padding: spacing * 2,
    marginHorizontal: spacing * 2,
  },
  shadow: {
    shadowColor: shadow.shadowColor,
    shadowOffset: shadow.shadowOffset,
    shadowOpacity: shadow.shadowOpacity,
    shadowRadius: shadow.shadowRadius,
    elevation: shadow.elevation,
  },
  title: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    letterSpacing: 1,
    color: `${beachPalette.driftwood}B3`,
  },
  body: {
    marginTop: spacing * 1.5,
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: beachPalette.deepNavy,
  },
  daysRow: {
    marginTop: spacing * 2,
    flexDirection: 'row',
    gap: spacing,
  },
  day: {
    width: 20,
    height: 20,
    borderRadius: 6,
  },
  dayFilled: {
    backgroundColor: beachPalette.deepNavy,
  },
  dayEmpty: {
    borderWidth: 1,
    borderColor: beachPalette.divider,
    backgroundColor: 'transparent',
  },
});
