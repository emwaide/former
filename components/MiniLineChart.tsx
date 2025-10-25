import Svg, { Path, Polyline, Rect } from 'react-native-svg';
import { useMemo } from 'react';

import { getColor, type ColorToken } from '../utils/colors';

type LineSeries = {
  points: number[];
  color: ColorToken;
  dashed?: boolean;
};

type MiniLineChartProps = {
  series: LineSeries[];
  height?: number;
  width?: number;
  accessibilityLabel?: string;
};

export const MiniLineChart = ({
  series,
  height = 120,
  width = 280,
  accessibilityLabel = 'Trend chart',
}: MiniLineChartProps) => {
  const domain = useMemo(() => {
    const all = series.flatMap((s) => s.points);
    const min = Math.min(...all, 0);
    const max = Math.max(...all, 1);
    return { min, max };
  }, [series]);

  const pathForSeries = (points: number[]) => {
    if (points.length === 0) return '';
    const stepX = width / Math.max(points.length - 1, 1);
    return points
      .map((point, index) => {
        const x = stepX * index;
        const normalized = domain.max === domain.min ? 0.5 : (point - domain.min) / (domain.max - domain.min);
        const y = height - normalized * height;
        return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .join(' ');
  };

  return (
    <Svg width={width} height={height} accessibilityLabel={accessibilityLabel} accessibilityRole="image">
      <Rect x={0} y={0} width={width} height={height} rx={16} fill={getColor('surface')} opacity={0.9} />
      {series.map((s, idx) => (
        <Path
          key={idx}
          d={pathForSeries(s.points)}
          stroke={getColor(s.color)}
          strokeWidth={3}
          strokeLinejoin="round"
          strokeLinecap="round"
          fill="transparent"
          strokeDasharray={s.dashed ? '6 6' : undefined}
        />
      ))}
      <Polyline
        points={`0,${height} ${width},${height}`}
        stroke={getColor('border')}
        strokeWidth={1}
        strokeDasharray="4 4"
      />
    </Svg>
  );
};
