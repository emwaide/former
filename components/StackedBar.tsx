import Svg, { Rect, Text as SvgText } from 'react-native-svg';
import { useTheme } from '../theme';

type Segment = {
  label: string;
  fatPct: number;
  leanPct: number;
};

type StackedBarProps = {
  data: Segment[];
  width?: number;
  height?: number;
};

export const StackedBar = ({ data, width = 280, height = 140 }: StackedBarProps) => {
  const { tokens } = useTheme();
  const barWidth = width / Math.max(data.length, 1) - 12;
  return (
    <Svg width={width} height={height} accessibilityRole="image" accessibilityLabel="Body composition stacked bars">
      {data.map((segment, index) => {
        const x = index * (barWidth + 12) + 6;
        const fatHeight = (segment.fatPct / 100) * (height - 30);
        const leanHeight = (segment.leanPct / 100) * (height - 30);
        return (
          <>
            <Rect
              key={`fat-${index}`}
              x={x}
              y={height - fatHeight - 20}
              width={barWidth}
              height={fatHeight}
              rx={12}
              fill={tokens.colors.accentTertiary}
              opacity={0.85}
            />
            <Rect
              key={`lean-${index}`}
              x={x}
              y={height - fatHeight - leanHeight - 20}
              width={barWidth}
              height={leanHeight}
              rx={12}
              fill={tokens.colors.accentSecondary}
              opacity={0.85}
            />
            <SvgText key={`label-${index}`} x={x + barWidth / 2} y={height - 4} textAnchor="middle" fontSize={12} fill={tokens.colors.textSecondary}>
              {segment.label}
            </SvgText>
          </>
        );
      })}
    </Svg>
  );
};
