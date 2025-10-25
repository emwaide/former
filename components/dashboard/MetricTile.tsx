import { Feather } from '@expo/vector-icons';
import { Text, View, ViewProps } from 'react-native';

export type MetricTone = 'positive' | 'negative' | 'neutral';

export type MetricTileProps = ViewProps & {
  label: string;
  value: string;
  unit: string;
  deltaLabel: string;
  metaLabel: string;
  accentColor: string;
  tone?: MetricTone;
  icon?: keyof typeof Feather.glyphMap;
};

const withAlpha = (color: string, alpha: number) => {
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

const toneColor = (tone: MetricTone = 'neutral') => {
  if (tone === 'positive') return '#0EC4A6';
  if (tone === 'negative') return '#F87171';
  return '#4B5563';
};

export const MetricTile = ({
  label,
  value,
  unit,
  deltaLabel,
  metaLabel,
  accentColor,
  tone = 'neutral',
  icon = 'activity',
  className = '',
  ...rest
}: MetricTileProps) => (
  <View
    {...rest}
    className={`flex-1 rounded-card border border-[rgba(17,24,39,0.08)] bg-surface p-6 shadow-soft ${className}`}
    accessibilityRole="summary"
    accessibilityLabel={`${label} ${value} ${unit}. ${deltaLabel}. ${metaLabel}`}
  >
    <View className="mb-3 flex-row items-center justify-between">
      <Text className="text-[13px] font-[Poppins_500Medium] uppercase tracking-[1px] text-muted">{label}</Text>
      <View
        className="h-8 w-8 items-center justify-center rounded-[12px]"
        style={{ backgroundColor: withAlpha(accentColor, 0.12) }}
        accessibilityElementsHidden
        importantForAccessibility="no"
      >
        <Feather name={icon} size={16} color={accentColor} />
      </View>
    </View>

    <View className="mb-2 flex-row items-end gap-2">
      <Text className="text-[30px] font-[Poppins_600SemiBold] leading-[34px] text-charcoal">{value}</Text>
      {unit ? (
        <Text className="pb-1 text-[13px] font-[Poppins_500Medium] uppercase tracking-[1px] text-muted">{unit}</Text>
      ) : null}
    </View>

    <Text className="text-[16px] font-[Poppins_500Medium]" style={{ color: toneColor(tone) }}>
      {deltaLabel}
    </Text>
    <Text className="mt-2 text-[13px] font-[Poppins_400Regular] leading-relaxed text-muted">{metaLabel}</Text>
  </View>
);

export default MetricTile;
