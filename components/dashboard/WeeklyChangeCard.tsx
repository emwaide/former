import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Link } from 'expo-router';
import { ThemeTokens, useTheme } from '../../theme';

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
  const { tokens } = useTheme();
  const styles = useMemo(() => createStyles(tokens), [tokens]);
  const strokeColor = changeValue <= 0 ? tokens.colors.success : tokens.colors.danger;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>This Week’s Change</Text>
        <Link href="/(tabs)/trends" style={styles.link} accessibilityRole="link">
          <Text style={styles.linkText}>View in Trends →</Text>
        </Link>
      </View>

      <View style={styles.metricRow}>
        <View style={styles.metricCopy}>
          <Text style={[styles.metricValue, { color: strokeColor }]}>{changeLabel}</Text>
          <Text style={styles.metricCaption}>{subtext}</Text>
        </View>
        <View accessible accessibilityLabel="7 day weight trend" style={styles.sparklineWrapper}>
          <Svg width="100%" height="100%" viewBox="0 0 120 48" preserveAspectRatio="none">
            <Path
              d={buildSparklinePath(data, 120, 48)}
              stroke={tokens.colors.brandMid}
              strokeWidth={2.5}
              fill="none"
            />
          </Svg>
        </View>
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
      gap: tokens.spacing.md,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: tokens.colors.mutedBorder,
      shadowColor: tokens.colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 12,
      elevation: 3,
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    title: {
      color: tokens.colors.brandNavy,
      fontSize: tokens.typography.subheading,
      fontFamily: tokens.typography.fontFamilyAlt,
    },
    link: {
      paddingVertical: tokens.spacing.xs,
    },
    linkText: {
      color: tokens.colors.textSubtle,
      fontSize: tokens.typography.caption,
      fontFamily: tokens.typography.fontFamilyMedium,
    },
    metricRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: tokens.spacing.lg,
    },
    metricCopy: {
      flex: 1,
      gap: tokens.spacing.xs,
    },
    metricValue: {
      fontSize: 36,
      lineHeight: 42,
      fontFamily: tokens.typography.fontFamilyAlt,
      letterSpacing: -0.4,
      color: tokens.colors.brandNavy,
    },
    metricCaption: {
      color: tokens.colors.textSecondary,
      fontSize: tokens.typography.body,
      lineHeight: tokens.typography.body * 1.4,
      fontFamily: tokens.typography.fontFamily,
    },
    sparklineWrapper: {
      width: 120,
      height: 48,
      backgroundColor: 'rgba(144, 224, 239, 0.2)',
      borderRadius: 12,
      padding: tokens.spacing.xs,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: 'rgba(0, 119, 182, 0.24)',
    },
  });

export default WeeklyChangeCard;
