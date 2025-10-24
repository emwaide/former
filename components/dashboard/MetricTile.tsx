import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { palette, spacing, typography, cardShadow } from './constants';

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

export const MetricTile = ({ label, headline, subtext, icon, accentColor, progress, style }: MetricTileProps) => (
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

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: spacing.md,
    gap: spacing.sm,
    flex: 1,
    minWidth: 150,
    ...cardShadow,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: 'rgba(3,4,94,0.65)',
    fontSize: typography.caption,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 1,
  },
  headline: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 0.2,
  },
  subtext: {
    color: palette.navy,
    fontSize: typography.caption,
    lineHeight: typography.caption * 1.4,
    fontFamily: 'Inter_400Regular',
  },
  barTrack: {
    height: 6,
    borderRadius: 8,
    backgroundColor: palette.skyTint,
    overflow: 'hidden',
    marginTop: spacing.sm,
  },
  barFill: {
    height: '100%',
    borderRadius: 8,
  },
});

export default MetricTile;
