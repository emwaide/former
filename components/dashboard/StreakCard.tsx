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
    <LinearGradient colors={tokens.colors.streakGradient} style={styles.card}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Current streak</Text>
          {onViewHistory ? (
            <Pressable accessibilityRole="button" onPress={onViewHistory} hitSlop={8}>
              <Text style={styles.linkText}>View history →</Text>
            </Pressable>
          ) : null}
        </View>
        <View accessible accessibilityRole="text" accessibilityLabel={`Current streak ${currentStreak} days`}>
          <Text style={styles.streakCount}>{currentStreak}</Text>
          <Text style={styles.streakCaption}>{currentStreak === 1 ? 'day' : 'days'}</Text>
        </View>
        <Text style={styles.subtitle}>{`${loggedCount} of 7 days logged this week.`}</Text>
        <View style={styles.barsRow} accessibilityRole="image" accessibilityLabel={`${loggedCount} days logged this week`}>
          {loggedDays.map((day, index) => (
            <View key={index} style={[styles.bar, day ? styles.barFilled : null]} />
          ))}
        </View>
      </View>
    </LinearGradient>
  );
};

const createStyles = (tokens: ThemeTokens) =>
  StyleSheet.create({
    card: {
      borderRadius: tokens.radius.card,
      shadowColor: tokens.colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 12,
      elevation: 3,
    },
    content: {
      padding: tokens.spacing.lg,
      gap: tokens.spacing.md,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    title: {
      color: '#FFFFFF',
      fontSize: tokens.typography.caption,
      fontFamily: tokens.typography.fontFamilyMedium,
      letterSpacing: 1,
      textTransform: 'uppercase',
    },
    linkText: {
      color: 'rgba(255,255,255,0.8)',
      fontSize: tokens.typography.caption,
      fontFamily: tokens.typography.fontFamilyMedium,
    },
    subtitle: {
      color: 'rgba(255,255,255,0.85)',
      fontSize: tokens.typography.body,
      fontFamily: tokens.typography.fontFamily,
    },
    streakCount: {
      color: '#FFFFFF',
      fontSize: 44,
      fontFamily: tokens.typography.fontFamilyAlt,
      letterSpacing: -1,
    },
    streakCaption: {
      color: 'rgba(255,255,255,0.8)',
      fontSize: tokens.typography.caption,
      fontFamily: tokens.typography.fontFamilyMedium,
      textTransform: 'uppercase',
    },
    barsRow: {
      flexDirection: 'row',
      gap: tokens.spacing.xs,
    },
    bar: {
      flex: 1,
      height: 10,
      borderRadius: 6,
      backgroundColor: 'rgba(255,255,255,0.25)',
    },
    barFilled: {
      backgroundColor: '#FFFFFF',
    },
  });

export default StreakCard;
