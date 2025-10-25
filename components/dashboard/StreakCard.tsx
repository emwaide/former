import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
    <View style={styles.wrapper}>
      <LinearGradient
        colors={tokens.colors.streakGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={styles.headerRow}>
          <Text style={styles.title}>Consistency</Text>
          {onViewHistory ? (
            <Pressable accessibilityRole="button" onPress={onViewHistory} hitSlop={8}>
              <Text style={styles.linkText}>View history →</Text>
            </Pressable>
          ) : null}
        </View>

        <View
          style={styles.summaryBlock}
          accessibilityRole="text"
          accessibilityLabel={`This week ${loggedCount} of 7 days logged`}
        >
          <Text style={styles.summaryLabel}>This week</Text>
          <Text style={styles.summaryValue}>{`${loggedCount} of 7 days logged`}</Text>
        </View>

        <View
          style={styles.dotsRow}
          accessibilityRole="image"
          accessibilityLabel={`${loggedCount} days logged this week`}
        >
          {loggedDays.map((day, index) => (
            <View key={index} style={[styles.dot, day ? styles.dotFilled : styles.dotEmpty]}>
              {day ? <View style={styles.dotInner} /> : null}
            </View>
          ))}
        </View>

        <View style={styles.footerRow}>
          <View style={styles.streakBadge}>
            <Text style={styles.streakBadgeText}>{`${currentStreak}-day streak`}</Text>
          </View>
          <Text style={styles.caption}>Consistency builds momentum.</Text>
        </View>
      </LinearGradient>
    </View>
  );
};

const createStyles = (tokens: ThemeTokens) =>
  StyleSheet.create({
    wrapper: {
      borderRadius: tokens.radius.card,
      shadowColor: tokens.colors.shadow,
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 1,
      shadowRadius: 22,
      elevation: 6,
    },
    card: {
      borderRadius: tokens.radius.card,
      padding: tokens.spacing.lg,
      gap: tokens.spacing.lg,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: 'rgba(255,255,255,0.28)',
      overflow: 'hidden',
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    title: {
      color: '#FFFFFF',
      fontSize: tokens.typography.subheading,
      fontFamily: tokens.typography.fontFamilyAlt,
    },
    linkText: {
      color: 'rgba(255,255,255,0.85)',
      fontSize: tokens.typography.caption,
      fontFamily: tokens.typography.fontFamilyMedium,
    },
    summaryBlock: {
      gap: 4,
    },
    summaryLabel: {
      color: 'rgba(255,255,255,0.72)',
      fontSize: tokens.typography.body,
      fontFamily: tokens.typography.fontFamilyMedium,
    },
    summaryValue: {
      color: '#FFFFFF',
      fontSize: tokens.typography.subheading,
      fontFamily: tokens.typography.fontFamilyAlt,
    },
    dotsRow: {
      flexDirection: 'row',
      gap: tokens.spacing.sm,
      marginTop: tokens.spacing.md,
    },
    dot: {
      width: 18,
      height: 18,
      borderRadius: 9,
      borderWidth: 2,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
    },
    dotEmpty: {
      borderColor: 'rgba(255,255,255,0.38)',
    },
    dotFilled: {
      borderColor: 'rgba(255,255,255,0.9)',
      backgroundColor: 'rgba(255,255,255,0.22)',
    },
    dotInner: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: '#FFFFFF',
    },
    footerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: tokens.spacing.lg,
      gap: tokens.spacing.md,
    },
    streakBadge: {
      paddingHorizontal: tokens.spacing.md,
      paddingVertical: 6,
      borderRadius: tokens.radius.pill,
      backgroundColor: 'rgba(255,255,255,0.24)',
    },
    streakBadgeText: {
      color: '#FFFFFF',
      fontSize: tokens.typography.caption,
      fontFamily: tokens.typography.fontFamilyMedium,
      letterSpacing: 0.6,
      textTransform: 'uppercase',
    },
    caption: {
      color: 'rgba(255,255,255,0.82)',
      fontSize: tokens.typography.body,
      lineHeight: tokens.typography.body * 1.4,
      fontFamily: tokens.typography.fontFamily,
      flex: 1,
      textAlign: 'right',
    },
  });

export default StreakCard;
