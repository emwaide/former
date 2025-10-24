import { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { beachPalette, shadow, spacing } from './palette';

const AnimatedPath = Animated.createAnimatedComponent(Path);

const chartWidth = 280;
const chartHeight = 120;

type WeeklyTrendCardProps = {
  actual: number[];
  predicted: number[];
  deltaLabel: string;
  accessibilityLabel: string;
};

const buildPath = (points: number[], width: number) => {
  if (points.length <= 1) {
    return { d: '', length: 0 };
  }
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const step = width / (points.length - 1);
  const coords = points.map((value, index) => {
    const x = index * step;
    const normalized = (value - min) / range;
    const y = chartHeight - normalized * chartHeight;
    return { x, y };
  });
  const d = coords
    .map((point, index) => `${index === 0 ? 'M' : 'L'}${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
    .join(' ');
  let length = 0;
  for (let i = 1; i < coords.length; i += 1) {
    const dx = coords[i].x - coords[i - 1].x;
    const dy = coords[i].y - coords[i - 1].y;
    length += Math.sqrt(dx * dx + dy * dy);
  }
  return { d, length };
};

export const WeeklyTrendCard = ({ actual, predicted, deltaLabel, accessibilityLabel }: WeeklyTrendCardProps) => {
  const { d: actualPath, length: actualLength } = useMemo(() => buildPath(actual, chartWidth), [actual]);
  const { d: predictedPath } = useMemo(() => buildPath(predicted, chartWidth), [predicted]);

  const actualAnim = useRef(new Animated.Value(actualLength || 1)).current;
  const predictedOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    actualAnim.setValue(actualLength || 1);
    predictedOpacity.setValue(0);
    Animated.stagger(120, [
      Animated.timing(actualAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }),
      Animated.timing(predictedOpacity, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, [actualAnim, predictedOpacity, actualLength]);

  return (
    <View accessible accessibilityLabel={accessibilityLabel} style={[styles.card, styles.shadow]}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Weight trend (7 days)</Text>
        <Text style={styles.delta}>{deltaLabel}</Text>
      </View>
      <View style={styles.chartWrapper}>
        <Svg width={chartWidth} height={chartHeight}>
          {predictedPath ? (
            <AnimatedPath
              d={predictedPath}
              fill="none"
              stroke={beachPalette.seafoam}
              strokeWidth={2}
              strokeDasharray="4 6"
              strokeLinecap="round"
              opacity={predictedOpacity}
            />
          ) : null}
          {actualPath ? (
            <AnimatedPath
              d={actualPath}
              fill="none"
              stroke={beachPalette.deepNavy}
              strokeWidth={2.5}
              strokeDasharray={[actualLength || 1, actualLength || 1]}
              strokeDashoffset={actualAnim}
              strokeLinecap="round"
            />
          ) : null}
        </Svg>
      </View>
      <Text style={styles.caption}>Actual vs predicted</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: beachPalette.card,
    borderRadius: 16,
    padding: spacing * 2,
    marginHorizontal: spacing * 2,
  },
  shadow: {
    shadowColor: shadow.shadowColor,
    shadowOffset: shadow.shadowOffset,
    shadowOpacity: shadow.shadowOpacity,
    shadowRadius: shadow.shadowRadius,
    elevation: shadow.elevation,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: beachPalette.deepNavy,
  },
  delta: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: beachPalette.driftwood,
  },
  chartWrapper: {
    marginTop: spacing * 2,
  },
  caption: {
    marginTop: spacing * 2,
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: `${beachPalette.driftwood}CC`,
  },
});
