import { useMemo } from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ThemeTokens, useTheme } from '../../theme';

export type MetricTone = 'positive' | 'negative' | 'neutral';

export type MetricTileProps = {
  label: string;
  value: string;
  unit: string;
  deltaLabel: string;
  metaLabel: string;
  accentColor: string;
  tone?: MetricTone;
  icon?: keyof typeof Feather.glyphMap;
  style?: StyleProp<ViewStyle>;
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

const toneColor = (tokens: ThemeTokens, tone: MetricTone = 'neutral') => {
  switch (tone) {
    case 'positive':
      return tokens.colors.accent;
    case 'negative':
      return tokens.colors.danger;
    default:
      return tokens.colors.textSecondary;
  }
};

export const MetricTile = ({
  label,
  value,
  unit,
  deltaLabel,
  metaLabel,
  accentColor,
  tone = 'neutral',
  icon = 'activity',
  style,
}: MetricTileProps) => {
  const { tokens } = useTheme();
  const styles = useMemo(() => createStyles(tokens), [tokens]);
  const deltaColor = toneColor(tokens, tone);

  return (
    <View
      style={[styles.card, style]}
      accessibilityRole="summary"
      accessibilityLabel={`${label} ${value} ${unit}. ${deltaLabel}. ${metaLabel}`}
    >
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <View style={[styles.iconBadge, { backgroundColor: withAlpha(accentColor, 0.12) }]}
          accessibilityElementsHidden
          importantForAccessibility="no"
        >
          <Feather name={icon} size={16} color={accentColor} />
        </View>
      </View>
      <View style={styles.valueRow}>
        <Text style={styles.value}>{value}</Text>
        {unit ? <Text style={styles.unit}>{unit}</Text> : null}
      </View>
      <Text style={[styles.deltaText, { color: deltaColor }]}>{deltaLabel}</Text>
      <Text style={styles.meta}>{metaLabel}</Text>
    </View>
  );
};

const createStyles = (tokens: ThemeTokens) =>
  StyleSheet.create({
    card: {
      backgroundColor: tokens.colors.card,
      borderRadius: tokens.radius.card,
      padding: tokens.spacing.lg,
      gap: tokens.spacing.sm,
      flex: 1,
      minWidth: 160,
      borderWidth: 1,
      borderColor: withAlpha(tokens.colors.text, 0.08),
      shadowColor: tokens.colors.shadow,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 1,
      shadowRadius: 14,
      elevation: 4,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    label: {
      color: tokens.colors.textSecondary,
      fontSize: tokens.typography.caption,
      fontFamily: tokens.typography.fontFamilyMedium,
      letterSpacing: 0.8,
      textTransform: 'uppercase',
    },
    iconBadge: {
      width: 32,
      height: 32,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    valueRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      gap: tokens.spacing.xs,
    },
    value: {
      color: tokens.colors.text,
      fontSize: 30,
      lineHeight: 34,
      fontFamily: tokens.typography.fontFamilyAlt,
      letterSpacing: -0.3,
    },
    unit: {
      color: tokens.colors.textSecondary,
      fontSize: tokens.typography.caption,
      textTransform: 'uppercase',
      letterSpacing: 1,
      fontFamily: tokens.typography.fontFamilyMedium,
    },
    meta: {
      color: tokens.colors.textSubtle,
      fontSize: tokens.typography.caption,
      lineHeight: tokens.typography.caption * 1.4,
      fontFamily: tokens.typography.fontFamily,
      marginTop: tokens.spacing.xs,
    },
    deltaText: {
      fontSize: tokens.typography.body,
      fontFamily: tokens.typography.fontFamilyMedium,
    },
  });

export default MetricTile;
