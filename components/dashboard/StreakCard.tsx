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

  return (
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
};

const createStyles = (tokens: ThemeTokens) =>
  StyleSheet.create({
    card: {
      backgroundColor: tokens.colors.card,
      borderRadius: tokens.radius.card,
      padding: tokens.spacing.lg,
      gap: tokens.spacing.md,
      shadowColor: tokens.colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 12,
      elevation: 3,
    },
    header: {
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
    subtitle: {
      color: tokens.colors.brandNavy,
      fontSize: tokens.typography.body,
      fontFamily: tokens.typography.fontFamily,
    },
    dotsRow: {
      flexDirection: 'row',
      gap: tokens.spacing.sm,
    },
    dot: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: tokens.colors.aquaSoft,
    },
    dotFilled: {
      backgroundColor: tokens.colors.accentTertiary,
      borderColor: tokens.colors.accentTertiary,
    },
    dotEmpty: {
      backgroundColor: 'transparent',
    },
  });

export default StreakCard;
