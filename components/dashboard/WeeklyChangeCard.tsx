import { StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Link } from 'expo-router';
import { palette, spacing, typography, cardShadow } from './constants';

type WeeklyChangeCardProps = {
  changeLabel: string;
  changeValue: number;
  subtext: string;
  data: number[];
};

const buildSparklinePath = (values: number[], width: number, height: number) => {
  if (values.length === 0) {
    return '';
  }
  if (values.length === 1) {
    const midY = height / 2;
    return `M0 ${midY} L${width} ${midY}`;
  }
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const step = width / (values.length - 1);
  return values
    .map((value, index) => {
      const x = index * step;
      const normalized = (value - min) / range;
      const y = height - normalized * height;
      return `${index === 0 ? 'M' : 'L'}${x} ${y}`;
    })
    .join(' ');
};

export const WeeklyChangeCard = ({ changeLabel, changeValue, subtext, data }: WeeklyChangeCardProps) => {
  const strokeColor = changeValue <= 0 ? palette.successSoft : palette.errorSoft;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>This Week’s Change</Text>
        <Link href="/(tabs)/trends" style={styles.link} accessibilityRole="link">
          <Text style={styles.linkText}>View in Trends →</Text>
        </Link>
      </View>

      <View style={styles.metricRow}>
        <View>
          <Text style={[styles.metricValue, { color: strokeColor }]}>{changeLabel}</Text>
          <Text style={styles.metricCaption}>{subtext}</Text>
        </View>
        <View accessible accessibilityLabel="7 day weight trend" style={styles.sparklineWrapper}>
          <Svg width="100%" height="100%" viewBox="0 0 120 48" preserveAspectRatio="none">
            <Path d={buildSparklinePath(data, 120, 48)} stroke={palette.navy} strokeWidth={2} fill="none" />
          </Svg>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: spacing.lg,
    gap: spacing.md,
    ...cardShadow,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: palette.navy,
    fontSize: typography.subtitle,
    fontFamily: 'Inter_600SemiBold',
  },
  link: {
    paddingVertical: spacing.xs,
  },
  linkText: {
    color: 'rgba(3,4,94,0.65)',
    fontSize: typography.caption,
    fontFamily: 'Inter_500Medium',
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.lg,
  },
  metricValue: {
    fontSize: 32,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: -0.3,
  },
  metricCaption: {
    color: 'rgba(3,4,94,0.72)',
    fontSize: typography.body,
    lineHeight: typography.body * 1.4,
    fontFamily: 'Inter_400Regular',
    marginTop: spacing.xs,
  },
  sparklineWrapper: {
    width: 120,
    height: 48,
  },
});

export default WeeklyChangeCard;
