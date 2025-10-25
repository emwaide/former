import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ThemeTokens, useTheme } from '../../theme';

type StreakCardProps = {
  loggedDays: boolean[];
  loggedCount: number;
  onViewHistory?: () => void;
};

const withAlpha = (color: string, alpha: number) => {
  if (color.startsWith('rgb')) {
    const values = color
      .replace(/rgba?\(/, '')
      .replace(')', '')
      .split(',')
      .map((value) => parseFloat(value.trim()));
    const [r = 0, g = 0, b = 0] = values.slice(0, 3);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  const sanitized = color.replace('#', '');
  const expanded =
    sanitized.length === 3
      ? sanitized
          .split('')
          .map((char) => char + char)
          .join('')
      : sanitized;
  const bigint = parseInt(expanded, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
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

  const weekLoggedLabel = `${loggedCount} of 7 days`;
  const summaryLabel = `You’ve logged ${loggedCount} ${loggedCount === 1 ? 'day' : 'days'} this week. Small, regular actions create lasting change.`;

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

      <View style={styles.summaryRow} accessibilityRole="text" accessibilityLabel={`This week ${weekLoggedLabel}`}>
        <Text style={styles.summaryLabel}>This week</Text>
        <Text style={styles.summaryValue}>{weekLoggedLabel}</Text>
      </View>

      <View style={styles.segmentRow} accessibilityRole="image" accessibilityLabel={`${loggedCount} days logged this week`}>
        {loggedDays.map((day, index) => (
          <View
            key={index}
            style={[styles.segment, day ? styles.segmentActive : styles.segmentInactive]}
          />
        ))}
      </View>

      <View style={styles.footerRow}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{`${currentStreak}-day streak`}</Text>
        </View>
        <Text style={styles.caption}>{summaryLabel}</Text>
      </View>
    </View>
  );
};

const createStyles = (tokens: ThemeTokens) =>
  StyleSheet.create({
    card: {
      borderRadius: 20,
      padding: tokens.spacing.lg,
      gap: tokens.spacing.lg,
      backgroundColor: tokens.colors.card,
      borderWidth: 1,
      borderColor: withAlpha(tokens.colors.text, 0.08),
      shadowColor: tokens.colors.shadow,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 1,
      shadowRadius: 16,
      elevation: 4,
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    title: {
      color: tokens.colors.text,
      fontSize: tokens.typography.body,
      fontFamily: tokens.typography.fontFamilyMedium,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    linkText: {
      color: tokens.colors.textSubtle,
      fontSize: tokens.typography.caption,
      fontFamily: tokens.typography.fontFamilyMedium,
    },
    summaryRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    summaryLabel: {
      color: tokens.colors.textSecondary,
      fontSize: tokens.typography.caption,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      fontFamily: tokens.typography.fontFamilyMedium,
    },
    summaryValue: {
      color: tokens.colors.accent,
      fontSize: tokens.typography.body,
      fontFamily: tokens.typography.fontFamilyMedium,
    },
    segmentRow: {
      flexDirection: 'row',
      gap: tokens.spacing.xs,
      alignItems: 'center',
      marginTop: tokens.spacing.sm,
    },
    segment: {
      flex: 1,
      height: 8,
      borderRadius: 8,
    },
    segmentInactive: {
      backgroundColor: withAlpha(tokens.colors.text, 0.06),
    },
    segmentActive: {
      backgroundColor: tokens.colors.accent,
      shadowColor: withAlpha(tokens.colors.accent, 0.35),
      shadowOpacity: 1,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 1 },
    },
    footerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: tokens.spacing.md,
    },
    badge: {
      paddingHorizontal: tokens.spacing.md,
      paddingVertical: 6,
      borderRadius: tokens.radius.pill,
      backgroundColor: withAlpha(tokens.colors.accent, 0.14),
    },
    badgeText: {
      color: tokens.colors.accent,
      fontSize: tokens.typography.caption,
      fontFamily: tokens.typography.fontFamilyMedium,
      letterSpacing: 0.6,
      textTransform: 'uppercase',
    },
    caption: {
      color: tokens.colors.textSecondary,
      fontSize: tokens.typography.caption,
      lineHeight: tokens.typography.caption * 1.6,
      fontFamily: tokens.typography.fontFamily,
      flex: 1,
    },
  });

export default StreakCard;
