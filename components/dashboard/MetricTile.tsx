import { useMemo } from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ThemeTokens, useTheme } from '../../theme';

export type MetricTone = 'positive' | 'negative' | 'neutral';

export type MetricTileProps = {
  label: string;
  valueLabel: string;
  deltaLabel: string;
  metaLabel: string;
  accentColor: string;
  progress: number;
  tone?: MetricTone;
  style?: StyleProp<ViewStyle>;
};

const clamp = (value: number) => Math.max(0, Math.min(1, value));

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
      return tokens.colors.success;
    case 'negative':
      return tokens.colors.danger;
    default:
      return tokens.colors.textSecondary;
  }
};

export const MetricTile = ({
  label,
  valueLabel,
  deltaLabel,
  metaLabel,
  accentColor,
  progress,
  tone = 'neutral',
  style,
}: MetricTileProps) => {
  const { tokens } = useTheme();
  const styles = useMemo(() => createStyles(tokens), [tokens]);
  const deltaColor = toneColor(tokens, tone);
  const deltaBackground =
    tone === 'neutral'
      ? withAlpha(tokens.colors.brandMid, 0.12)
      : withAlpha(deltaColor, 0.16);

  return (
    <View
      style={[styles.card, style]}
      accessibilityRole="summary"
      accessibilityLabel={`${label} ${valueLabel}. ${deltaLabel}. ${metaLabel}`}
    >
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Feather
          name="arrow-up-right"
          size={16}
          color={tokens.colors.textSubtle}
          accessibilityElementsHidden
          importantForAccessibility="no"
        />
      </View>
      <Text style={styles.value}>{valueLabel}</Text>
      <View style={[styles.deltaBadge, { backgroundColor: deltaBackground }]}>
        <Text style={[styles.deltaText, { color: deltaColor }]}>{deltaLabel}</Text>
      </View>
      <Text style={styles.meta}>{metaLabel}</Text>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width: `${clamp(progress) * 100}%`, backgroundColor: accentColor }]} />
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
      gap: tokens.spacing.sm,
      flex: 1,
      minWidth: 160,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: tokens.colors.mutedBorder,
      shadowColor: tokens.colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 12,
      elevation: 3,
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
      letterSpacing: 0.6,
      textTransform: 'uppercase',
    },
    value: {
      color: tokens.colors.brandNavy,
      fontSize: 34,
      lineHeight: 40,
      fontFamily: tokens.typography.fontFamilyAlt,
      letterSpacing: -0.2,
    },
    deltaBadge: {
      marginTop: tokens.spacing.xs,
      alignSelf: 'flex-start',
      paddingHorizontal: tokens.spacing.sm,
      paddingVertical: 4,
      borderRadius: tokens.radius.pill,
    },
    deltaText: {
      fontSize: tokens.typography.body,
      fontFamily: tokens.typography.fontFamilyMedium,
    },
    meta: {
      color: tokens.colors.textSubtle,
      fontSize: tokens.typography.caption,
      lineHeight: tokens.typography.caption * 1.4,
      fontFamily: tokens.typography.fontFamily,
      marginTop: tokens.spacing.xs,
    },
    barTrack: {
      height: 6,
      borderRadius: 8,
      backgroundColor: withAlpha(tokens.colors.aquaSoft, 0.4),
      overflow: 'hidden',
      marginTop: tokens.spacing.sm,
    },
    barFill: {
      height: '100%',
      borderRadius: 8,
    },
  });

export default MetricTile;
