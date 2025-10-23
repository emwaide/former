import Svg, { Circle, Path, Text as SvgText } from 'react-native-svg';
import { useMemo } from 'react';
import { useTheme } from '../theme';

const SIZE = 140;
const STROKE = 16;

export type GaugeStatus = 'good' | 'fair' | 'caution';

type GaugeProps = {
  value: number;
  max?: number;
  min?: number;
  label?: string;
};

export const Gauge = ({ value, max = 100, min = 0, label }: GaugeProps) => {
  const { tokens } = useTheme();
  const clamped = Math.max(min, Math.min(value, max));
  const percent = (clamped - min) / (max - min);

  const strokeColor = useMemo(() => {
    if (percent >= 0.66) return tokens.colors.accent;
    if (percent >= 0.4) return tokens.colors.accentSecondary;
    return tokens.colors.accentTertiary;
  }, [percent, tokens.colors.accent, tokens.colors.accentSecondary, tokens.colors.accentTertiary]);

  const circumference = Math.PI * (SIZE - STROKE);
  const dashOffset = circumference - circumference * percent;

  const arcPath = useMemo(() => {
    const startAngle = Math.PI * 0.75;
    const endAngle = Math.PI * 2.25;
    const radius = (SIZE - STROKE) / 2;
    const startX = SIZE / 2 + radius * Math.cos(startAngle);
    const startY = SIZE / 2 + radius * Math.sin(startAngle);
    const endX = SIZE / 2 + radius * Math.cos(endAngle);
    const endY = SIZE / 2 + radius * Math.sin(endAngle);
    return `M ${startX} ${startY} A ${radius} ${radius} 0 1 1 ${endX} ${endY}`;
  }, []);

  return (
    <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} accessibilityRole="image" accessibilityLabel={label}>
      <Path d={arcPath} stroke={tokens.colors.mutedBorder} strokeWidth={STROKE} strokeLinecap="round" fill="transparent" />
      <Path
        d={arcPath}
        stroke={strokeColor}
        strokeWidth={STROKE}
        strokeLinecap="round"
        fill="transparent"
        strokeDasharray={`${circumference}`}
        strokeDashoffset={dashOffset}
      />
      <Circle cx={SIZE / 2} cy={SIZE / 2} r={(SIZE - STROKE) / 2.2} fill={tokens.colors.surface} />
      <SvgText
        x={SIZE / 2}
        y={SIZE / 2 - 4}
        textAnchor="middle"
        fontSize={24}
        fontWeight="600"
        fill={tokens.colors.text}
      >
        {Math.round(clamped)}
      </SvgText>
      {label ? (
        <SvgText x={SIZE / 2} y={SIZE / 2 + 24} textAnchor="middle" fontSize={12} fill={tokens.colors.textSecondary}>
          {label}
        </SvgText>
      ) : null}
    </Svg>
  );
};
