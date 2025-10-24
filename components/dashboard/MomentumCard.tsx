import { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { beachPalette, shadow, spacing } from './palette';

const AnimatedPath = Animated.createAnimatedComponent(Path);

type MomentumCardProps = {
  changeLabel: string;
  changeValue: string;
  caption: string;
  sparklinePoints: number[];
  accessibilityLabel: string;
};

const chartWidth = 140;
const chartHeight = 60;

const buildPath = (points: number[]) => {
  if (points.length === 0) {
    return { d: '', length: 0 };
  }
  if (points.length === 1) {
    return { d: `M0 ${chartHeight / 2}`, length: chartWidth };
  }
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const step = chartWidth / (points.length - 1);
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

export const MomentumCard = ({
  changeLabel,
  changeValue,
  caption,
  sparklinePoints,
  accessibilityLabel,
}: MomentumCardProps) => {
  const { d, length } = useMemo(() => buildPath(sparklinePoints), [sparklinePoints]);
  const dash = Math.max(length, 1);
  const animated = useRef(new Animated.Value(dash)).current;

  useEffect(() => {
    animated.setValue(dash);
    Animated.timing(animated, {
      toValue: 0,
      duration: 500,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [animated, dash]);

  return (
    <View accessible accessibilityLabel={accessibilityLabel} style={[styles.card, styles.shadow]}>
      <Text style={styles.label}>THIS WEEK’S CHANGE</Text>
      <View style={styles.row}>
        <View style={styles.changeBlock}>
          <Text style={styles.changeLabel}>{changeLabel}</Text>
          <Text style={styles.changeValue}>{changeValue}</Text>
        </View>
        {d ? (
          <Svg width={chartWidth} height={chartHeight}>
            <AnimatedPath
              d={d}
              fill="none"
              stroke={`${beachPalette.deepNavy}99`}
              strokeWidth={2}
              strokeLinecap="round"
              strokeDasharray={[dash, dash]}
              strokeDashoffset={animated}
            />
          </Svg>
        ) : null}
      </View>
      <Text style={styles.caption}>{caption}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: beachPalette.card,
    borderRadius: 16,
    padding: spacing * 2,
    marginHorizontal: spacing * 2,
    marginTop: spacing * 3,
  },
  shadow: {
    shadowColor: shadow.shadowColor,
    shadowOffset: shadow.shadowOffset,
    shadowOpacity: shadow.shadowOpacity,
    shadowRadius: shadow.shadowRadius,
    elevation: shadow.elevation,
  },
  label: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    letterSpacing: 1,
    color: `${beachPalette.driftwood}B3`,
  },
  row: {
    flexDirection: 'row',
    marginTop: spacing * 2,
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing * 2,
  },
  changeBlock: {
    flex: 1,
  },
  changeLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: beachPalette.driftwood,
  },
  changeValue: {
    marginTop: spacing,
    fontFamily: 'Inter_500Medium',
    fontSize: 20,
    color: beachPalette.deepNavy,
  },
  caption: {
    marginTop: spacing * 2,
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: beachPalette.driftwood,
  },
});
