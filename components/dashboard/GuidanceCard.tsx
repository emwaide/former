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
      <View style={styles.row}>
        <View style={styles.iconBadge}>
          <Feather
            name="sun"
            size={18}
            color={tokens.colors.accentSecondary}
            accessibilityElementsHidden
            importantForAccessibility="no"
          />
        </View>
        <View style={styles.copy}>
          <Text style={styles.title}>Today’s insight</Text>
          <Text style={styles.message}>{message}</Text>
        </View>
      </View>

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
  );
};

const createStyles = (tokens: ThemeTokens) =>
  StyleSheet.create({
    card: {
      borderRadius: tokens.radius.card,
      backgroundColor:
        tokens.mode === 'dark'
          ? withAlpha(tokens.colors.guidanceGradient[0], 0.75)
          : withAlpha(tokens.colors.aquaSoft, 0.55),
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: withAlpha(tokens.colors.brandMid, tokens.mode === 'dark' ? 0.4 : 0.3),
      shadowColor: tokens.colors.shadow,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 1,
      shadowRadius: 16,
      elevation: 4,
      padding: tokens.spacing.lg,
      gap: tokens.spacing.md,
    },
    row: {
      flexDirection: 'row',
      gap: tokens.spacing.md,
      alignItems: 'flex-start',
    },
    iconBadge: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        tokens.mode === 'dark'
          ? withAlpha(tokens.colors.brandMid, 0.32)
          : withAlpha(tokens.colors.accentSecondary, 0.18),
    },
    copy: {
      flex: 1,
      gap: tokens.spacing.xs,
    },
    title: {
      color: tokens.mode === 'dark' ? tokens.colors.text : tokens.colors.brandNavy,
      fontSize: tokens.typography.caption,
      fontFamily: tokens.typography.fontFamilyMedium,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
    },
    message: {
      color: tokens.mode === 'dark' ? tokens.colors.text : tokens.colors.brandNavy,
      fontSize: tokens.typography.body,
      lineHeight: tokens.typography.body * 1.4,
      fontFamily: tokens.typography.fontFamily,
    },
    button: {
      alignSelf: 'flex-start',
      backgroundColor: tokens.colors.brandNavy,
      paddingHorizontal: tokens.spacing.lg,
      paddingVertical: tokens.spacing.sm,
      borderRadius: tokens.radius.pill,
    },
    buttonPressed: {
      opacity: 0.85,
    },
    buttonLabel: {
      color: '#FFFFFF',
      fontSize: tokens.typography.body,
      fontFamily: tokens.typography.fontFamilyAlt,
    },
  });

export default GuidanceCard;
