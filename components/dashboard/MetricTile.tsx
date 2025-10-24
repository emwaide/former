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
      <Text style={[styles.delta, { color: deltaColor }]}>{deltaLabel}</Text>
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
      padding: tokens.spacing.md,
      gap: tokens.spacing.sm,
      flex: 1,
      minWidth: 150,
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
      color: tokens.colors.text,
      fontSize: 24,
      fontFamily: tokens.typography.fontFamilyAlt,
      letterSpacing: -0.2,
    },
    delta: {
      fontSize: tokens.typography.body,
      fontFamily: tokens.typography.fontFamilyMedium,
    },
    meta: {
      color: tokens.colors.textSubtle,
      fontSize: tokens.typography.caption,
      lineHeight: tokens.typography.caption * 1.4,
      fontFamily: tokens.typography.fontFamily,
    },
    barTrack: {
      height: 6,
      borderRadius: 8,
      backgroundColor: tokens.colors.mutedBorder,
      overflow: 'hidden',
      marginTop: tokens.spacing.sm,
    },
    barFill: {
      height: '100%',
      borderRadius: 8,
    },
  });

export default MetricTile;
