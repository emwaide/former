import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Defs, LinearGradient as SvgGradient, Path, Stop, Circle, Line } from 'react-native-svg';
import { Feather } from '@expo/vector-icons';
import { ThemeTokens, useTheme } from '../../theme';

type WeeklyChangeCardProps = {
  changeLabel: string;
  changeValue: number;
  subtext: string;
  data: number[];
};

const CHART_WIDTH = 240;
const CHART_HEIGHT = 120;

const buildLinePoints = (values: number[]) => {
  if (values.length === 0) {
    return [];
  }
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const padding = range * 0.2;
  const adjustedMax = max + padding;
  const adjustedMin = min - padding;
  const adjustedRange = adjustedMax - adjustedMin || 1;

  return values.map((value, index) => {
    const x = (index / Math.max(values.length - 1, 1)) * CHART_WIDTH;
    const normalized = (value - adjustedMin) / adjustedRange;
    const y = CHART_HEIGHT - normalized * CHART_HEIGHT;
    return { x, y, value };
  });
};

export const WeeklyChangeCard = ({ changeLabel, changeValue, subtext, data }: WeeklyChangeCardProps) => {
  const { tokens } = useTheme();
  const styles = useMemo(() => createStyles(tokens), [tokens]);
  const strokeColor = changeValue <= 0 ? tokens.colors.accent : tokens.colors.danger;
  const points = useMemo(() => buildLinePoints(data), [data]);
  const linePath = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'}${point.x} ${point.y}`)
    .join(' ');
  const areaPath = linePath
    ? `${linePath} L ${CHART_WIDTH} ${CHART_HEIGHT} L 0 ${CHART_HEIGHT} Z`
    : '';
  const [valuePart, unitPart] = changeLabel.split(' ');

  return (
    <View style={styles.card}>
      <View style={styles.decorativeAccent} />

      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <View style={styles.iconBadge} accessibilityElementsHidden importantForAccessibility="no">
            <Feather name="trending-down" size={16} color={tokens.colors.accent} />
          </View>
          <Text style={styles.title}>Weight trend</Text>
        </View>
        <View style={styles.valueColumn}>
          <View style={styles.valueRow}>
            <Text style={[styles.metricValue, { color: strokeColor }]}>{valuePart}</Text>
            {unitPart ? (
              <Text style={styles.metricUnit}>{`${unitPart} this week`}</Text>
            ) : null}
          </View>
        </View>
      </View>

      <View style={styles.chartWrapper} accessibilityRole="image" accessibilityLabel="Weekly weight trend chart">
        <Svg width="100%" height="100%" viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`} preserveAspectRatio="none">
          <Defs>
            <SvgGradient id="weight-area" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor={withAlpha(tokens.colors.accent, 0.35)} />
              <Stop offset="100%" stopColor={withAlpha(tokens.colors.accent, 0.05)} />
            </SvgGradient>
            <SvgGradient id="weight-line" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor={tokens.colors.accent} />
              <Stop offset="100%" stopColor={tokens.colors.accentSecondary} />
            </SvgGradient>
          </Defs>

          {[0.25, 0.5, 0.75].map((fraction) => (
            <Line
              key={fraction}
              x1={0}
              x2={CHART_WIDTH}
              y1={CHART_HEIGHT * fraction}
              y2={CHART_HEIGHT * fraction}
              stroke={withAlpha(tokens.colors.text, 0.08)}
              strokeWidth={1}
            />
          ))}

          {areaPath ? (
            <Path d={areaPath} fill="url(#weight-area)" />
          ) : null}

          {linePath ? (
            <Path d={linePath} fill="none" stroke="url(#weight-line)" strokeWidth={3} strokeLinecap="round" />
          ) : null}

          {points.map((point, index) => (
            <Circle
              key={index}
              cx={point.x}
              cy={point.y}
              r={index === points.length - 1 ? 5 : 3}
              fill={index === points.length - 1 ? tokens.colors.accent : tokens.colors.card}
              stroke={tokens.colors.accent}
              strokeWidth={index === points.length - 1 ? 0 : 2}
            />
          ))}
        </Svg>
      </View>

      <Text style={styles.metricCaption}>{subtext}</Text>
    </View>
  );
};

const createStyles = (tokens: ThemeTokens) =>
  StyleSheet.create({
    card: {
      backgroundColor: tokens.colors.card,
      borderRadius: 20,
      padding: tokens.spacing.lg,
      gap: tokens.spacing.md,
      borderWidth: 1,
      borderColor: withAlpha(tokens.colors.text, 0.08),
      shadowColor: tokens.colors.shadow,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 1,
      shadowRadius: 16,
      elevation: 4,
      overflow: 'hidden',
    },
    decorativeAccent: {
      position: 'absolute',
      top: -80,
      right: -80,
      width: 200,
      height: 200,
      backgroundColor: withAlpha(tokens.colors.accentSecondary, 0.08),
      borderRadius: 100,
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: tokens.spacing.sm,
    },
    iconBadge: {
      width: 32,
      height: 32,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: withAlpha(tokens.colors.accent, 0.12),
    },
    title: {
      color: tokens.colors.text,
      fontSize: tokens.typography.body,
      fontFamily: tokens.typography.fontFamilyMedium,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    valueColumn: {
      alignItems: 'flex-end',
    },
    valueRow: {
      flexDirection: 'row',
      alignItems: 'baseline',
      gap: tokens.spacing.xs,
    },
    metricValue: {
      fontSize: 32,
      lineHeight: 38,
      fontFamily: tokens.typography.fontFamilyAlt,
      letterSpacing: -0.4,
    },
    metricUnit: {
      color: tokens.colors.textSecondary,
      fontSize: tokens.typography.caption,
      letterSpacing: 0.6,
      textTransform: 'uppercase',
      fontFamily: tokens.typography.fontFamilyMedium,
    },
    chartWrapper: {
      height: 160,
      borderRadius: 18,
      backgroundColor: withAlpha(tokens.colors.accentSecondary, 0.05),
      padding: tokens.spacing.sm,
      borderWidth: 1,
      borderColor: withAlpha(tokens.colors.accentSecondary, 0.16),
    },
    metricCaption: {
      color: tokens.colors.textSecondary,
      fontSize: tokens.typography.caption,
      lineHeight: tokens.typography.caption * 1.6,
      fontFamily: tokens.typography.fontFamily,
    },
  });

export default WeeklyChangeCard;
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
