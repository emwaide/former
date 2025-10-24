import { useMemo } from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ThemeTokens, useTheme } from '../../theme';

export type MetricTileProps = {
  label: string;
  headline: string;
  subtext: string;
  icon: keyof typeof Feather.glyphMap;
  accentColor: string;
  progress: number;
  style?: StyleProp<ViewStyle>;
};

const clamp = (value: number) => Math.max(0, Math.min(1, value));

export const MetricTile = ({ label, headline, subtext, icon, accentColor, progress, style }: MetricTileProps) => {
  const { tokens } = useTheme();
  const styles = useMemo(() => createStyles(tokens), [tokens]);

  return (
    <View
      style={[styles.card, style]}
      accessibilityRole="summary"
      accessibilityLabel={`${label} ${headline}. ${subtext}`}
    >
      <View style={styles.header}>
        <View style={[styles.iconWrap, { backgroundColor: `${accentColor}22` }]}> 
          <Feather name={icon} size={18} color={accentColor} />
        </View>
        <Text style={styles.label}>{label.toUpperCase()}</Text>
      </View>
      <Text style={[styles.headline, { color: accentColor }]}>{headline}</Text>
      <Text style={styles.subtext}>{subtext}</Text>
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
      gap: tokens.spacing.sm,
    },
    iconWrap: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    label: {
      color: tokens.colors.textSubtle,
      fontSize: tokens.typography.caption,
      fontFamily: tokens.typography.fontFamilyAlt,
      letterSpacing: 1,
    },
    headline: {
      fontSize: tokens.typography.subheading,
      fontFamily: tokens.typography.fontFamilyAlt,
      letterSpacing: 0.2,
    },
    subtext: {
      color: tokens.colors.textSecondary,
      fontSize: tokens.typography.caption,
      lineHeight: tokens.typography.caption * 1.4,
      fontFamily: tokens.typography.fontFamily,
    },
    barTrack: {
      height: 6,
      borderRadius: 8,
      backgroundColor: tokens.colors.aquaSoft,
      overflow: 'hidden',
      marginTop: tokens.spacing.sm,
    },
    barFill: {
      height: '100%',
      borderRadius: 8,
    },
  });

export default MetricTile;
