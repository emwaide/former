import Svg, { Circle, Path, Text as SvgText } from 'react-native-svg';
import { useMemo } from 'react';

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
  const clamped = Math.max(min, Math.min(value, max));
  const percent = (clamped - min) / (max - min);

  const strokeColor = useMemo(() => {
    if (percent >= 0.66) return '#37D0B4';
    if (percent >= 0.4) return '#42E2B8';
    return '#69E0DA';
  }, [percent]);

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
      <Path d={arcPath} stroke="#E5EDF2" strokeWidth={STROKE} strokeLinecap="round" fill="transparent" />
      <Path
        d={arcPath}
        stroke={strokeColor}
        strokeWidth={STROKE}
        strokeLinecap="round"
        fill="transparent"
        strokeDasharray={`${circumference}`}
        strokeDashoffset={dashOffset}
      />
      <Circle cx={SIZE / 2} cy={SIZE / 2} r={(SIZE - STROKE) / 2.2} fill="#FFFFFF" />
      <SvgText x={SIZE / 2} y={SIZE / 2 - 4} textAnchor="middle" fontSize={24} fontWeight="600" fill="#111827">
        {Math.round(clamped)}
      </SvgText>
      {label ? (
        <SvgText x={SIZE / 2} y={SIZE / 2 + 24} textAnchor="middle" fontSize={12} fill="#4B5563">
          {label}
        </SvgText>
      ) : null}
    </Svg>
  );
};
