import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ThemeTokens, useTheme } from '../../theme';

type StreakCardProps = {
  loggedDays: boolean[];
  loggedCount: number;
  onViewHistory?: () => void;
};

export const StreakCard = ({ loggedDays, loggedCount, onViewHistory }: StreakCardProps) => {
  const { tokens } = useTheme();
  const styles = useMemo(() => createStyles(tokens), [tokens]);
  const currentStreak = useMemo(() => {
    let streak = 0;
    for (let i = loggedDays.length - 1; i >= 0; i -= 1) {
      if (loggedDays[i]) {
        streak += 1;
      } else {
        break;
      }
    }
    return streak;
  }, [loggedDays]);

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Consistency</Text>
        {onViewHistory ? (
          <Pressable accessibilityRole="button" onPress={onViewHistory} hitSlop={8}>
            <Text style={styles.linkText}>View history →</Text>
          </Pressable>
        ) : null}
      </View>

      <View style={styles.summaryRow} accessibilityRole="text" accessibilityLabel={`This week ${loggedCount} of 7 days logged`}>
        <Text style={styles.summaryLabel}>This week</Text>
        <Text style={styles.summaryValue}>{`${loggedCount} of 7 days`}</Text>
      </View>

      <View
        style={styles.barsRow}
        accessibilityRole="image"
        accessibilityLabel={`${loggedCount} days logged this week`}
      >
        {loggedDays.map((day, index) => (
          <View key={index} style={[styles.bar, day ? styles.barFilled : null]} />
        ))}
      </View>

      <Text style={styles.caption}>
        {`You’re on a ${currentStreak}-day streak. Small, regular actions create lasting change.`}
      </Text>
    </View>
  );
};

const createStyles = (tokens: ThemeTokens) =>
  StyleSheet.create({
    card: {
      backgroundColor: tokens.colors.card,
      borderRadius: tokens.radius.card,
      padding: tokens.spacing.lg,
      gap: tokens.spacing.md,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: tokens.colors.mutedBorder,
      shadowColor: tokens.colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 12,
      elevation: 3,
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    title: {
      color: tokens.colors.brandNavy,
      fontSize: tokens.typography.subheading,
      fontFamily: tokens.typography.fontFamilyAlt,
    },
    linkText: {
      color: tokens.colors.textSubtle,
      fontSize: tokens.typography.caption,
      fontFamily: tokens.typography.fontFamilyMedium,
    },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    summaryLabel: {
      color: tokens.colors.textSecondary,
      fontSize: tokens.typography.body,
      fontFamily: tokens.typography.fontFamilyMedium,
    },
    summaryValue: {
      color: tokens.colors.brandNavy,
      fontSize: tokens.typography.subheading,
      fontFamily: tokens.typography.fontFamilyAlt,
    },
    barsRow: {
      flexDirection: 'row',
      gap: tokens.spacing.xs,
      marginTop: tokens.spacing.sm,
    },
    bar: {
      flex: 1,
      height: 10,
      borderRadius: 6,
      backgroundColor: tokens.colors.aquaSoft,
    },
    barFilled: {
      backgroundColor: tokens.colors.accentSecondary,
    },
    caption: {
      color: tokens.colors.textSecondary,
      fontSize: tokens.typography.body,
      lineHeight: tokens.typography.body * 1.4,
      fontFamily: tokens.typography.fontFamily,
    },
  });

export default StreakCard;
