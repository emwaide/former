import { useMemo } from 'react';
import { Text, View } from 'react-native';
import Svg, { Circle, Defs, Line, LinearGradient as SvgGradient, Path, Stop } from 'react-native-svg';
import { Feather } from '@expo/vector-icons';

import { colorWithOpacity, getColor } from '../../utils/colors';

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
  const strokeColor = changeValue <= 0 ? getColor('teal') : getColor('negative');
  const points = useMemo(() => buildLinePoints(data), [data]);
  const linePath = points.map((point, index) => `${index === 0 ? 'M' : 'L'}${point.x} ${point.y}`).join(' ');
  const areaPath = linePath ? `${linePath} L ${CHART_WIDTH} ${CHART_HEIGHT} L 0 ${CHART_HEIGHT} Z` : '';
  const [valuePart, unitPart] = changeLabel.split(' ');
  const changeDescription = unitPart ? `${unitPart} this week` : 'this week';

  return (
    <View
      className="relative overflow-hidden rounded-[20px] border bg-surface p-6 shadow-soft"
      style={{ borderColor: colorWithOpacity('charcoal', 0.08) }}
    >
      <View className="mb-4">
        <View className="flex-row items-center gap-3">
          <View
            className="h-8 w-8 items-center justify-center rounded-[12px]"
            style={{ backgroundColor: colorWithOpacity('teal', 0.12) }}
          >
            <Feather
              name="trending-down"
              size={16}
              color={getColor('teal')}
              accessibilityElementsHidden
              importantForAccessibility="no"
            />
          </View>
          <Text className="text-[16px] font-[Poppins_600SemiBold] text-charcoal">Weight trend</Text>
        </View>

        <View className="mt-2 flex-row items-baseline gap-2">
          <Text className="text-[32px] font-[Poppins_600SemiBold] leading-[38px]" style={{ color: strokeColor }}>
            {valuePart}
          </Text>
          <Text className="text-[13px] font-[Poppins_500Medium] uppercase tracking-[1px] text-muted">
            {changeDescription}
          </Text>
        </View>
      </View>

      <View
        className="mb-4 h-40 rounded-[18px] border p-4"
        style={{
          borderColor: colorWithOpacity('cyan', 0.2),
          backgroundColor: colorWithOpacity('cyan', 0.08),
        }}
        accessibilityRole="image"
        accessibilityLabel="Weekly weight trend chart"
      >
        <Svg width="100%" height="100%" viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`} preserveAspectRatio="none">
          <Defs>
            <SvgGradient id="weight-area" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor={colorWithOpacity('teal', 0.35)} />
              <Stop offset="100%" stopColor={colorWithOpacity('teal', 0.05)} />
            </SvgGradient>
            <SvgGradient id="weight-line" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor={getColor('teal')} />
              <Stop offset="100%" stopColor={getColor('tealBright')} />
            </SvgGradient>
          </Defs>

          {[0.25, 0.5, 0.75].map((fraction) => (
            <Line
              key={fraction}
              x1={0}
              x2={CHART_WIDTH}
              y1={CHART_HEIGHT * fraction}
              y2={CHART_HEIGHT * fraction}
              stroke={colorWithOpacity('charcoal', 0.08)}
              strokeWidth={1}
            />
          ))}

          {areaPath ? <Path d={areaPath} fill="url(#weight-area)" /> : null}

          {linePath ? (
            <Path d={linePath} fill="none" stroke="url(#weight-line)" strokeWidth={3} strokeLinecap="round" />
          ) : null}

          {points.map((point, index) => (
            <Circle
              key={index}
              cx={point.x}
              cy={point.y}
              r={index === points.length - 1 ? 5 : 3}
              fill={index === points.length - 1 ? getColor('teal') : getColor('surface')}
              stroke={getColor('teal')}
              strokeWidth={index === points.length - 1 ? 0 : 2}
            />
          ))}
        </Svg>
      </View>

      <Text className="text-[13px] font-[Poppins_400Regular] leading-relaxed text-graphite">{subtext}</Text>
    </View>
  );
};

export default WeeklyChangeCard;
