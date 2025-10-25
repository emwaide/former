import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ThemeTokens, useTheme } from '../../theme';

type GuidanceCardProps = {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
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

export const GuidanceCard = ({ message, actionLabel, onAction }: GuidanceCardProps) => {
  const { tokens } = useTheme();
  const styles = useMemo(() => createStyles(tokens), [tokens]);

  return (
    <View style={styles.card}>
      <View style={styles.iconBadge}>
        <Feather
          name="sparkles"
          size={16}
          color={tokens.colors.accent}
          accessibilityElementsHidden
          importantForAccessibility="no"
        />
      </View>
      <View style={styles.copy}>
        <Text style={styles.title}>Today’s insight</Text>
        <Text style={styles.message}>{message}</Text>
        {actionLabel && onAction ? (
          <Pressable
            accessibilityRole="button"
            onPress={onAction}
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          >
            <Text style={styles.buttonLabel}>{actionLabel}</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
};

const createStyles = (tokens: ThemeTokens) =>
  StyleSheet.create({
    card: {
      borderRadius: 20,
      backgroundColor:
        tokens.mode === 'dark'
          ? withAlpha(tokens.colors.accentSecondary, 0.18)
          : withAlpha(tokens.colors.accentSecondary, 0.12),
      borderWidth: 1,
      borderColor: withAlpha(tokens.colors.accent, 0.2),
      shadowColor: tokens.colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 14,
      elevation: 3,
      padding: tokens.spacing.lg,
      flexDirection: 'row',
      gap: tokens.spacing.md,
    },
    iconBadge: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: tokens.colors.card,
      shadowColor: withAlpha(tokens.colors.accent, 0.25),
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 1,
      shadowRadius: 6,
    },
    copy: {
      flex: 1,
      gap: tokens.spacing.sm,
    },
    title: {
      color: tokens.colors.text,
      fontSize: tokens.typography.body,
      fontFamily: tokens.typography.fontFamilyMedium,
      letterSpacing: -0.1,
    },
    message: {
      color: tokens.colors.textSecondary,
      fontSize: tokens.typography.caption,
      lineHeight: tokens.typography.caption * 1.6,
      fontFamily: tokens.typography.fontFamily,
    },
    button: {
      alignSelf: 'flex-start',
      backgroundColor: tokens.colors.accent,
      paddingHorizontal: tokens.spacing.lg,
      paddingVertical: tokens.spacing.xs,
      borderRadius: tokens.radius.pill,
    },
    buttonPressed: {
      opacity: 0.85,
    },
    buttonLabel: {
      color: '#FFFFFF',
      fontSize: tokens.typography.caption,
      fontFamily: tokens.typography.fontFamilyMedium,
      letterSpacing: 0.6,
      textTransform: 'uppercase',
    },
  });

export default GuidanceCard;
