import { Feather } from '@expo/vector-icons';
import { Text, View, ViewProps } from 'react-native';

import { colorWithOpacity, getColor, type ColorToken } from '../../utils/colors';

export type MetricTone = 'positive' | 'negative' | 'neutral';

export type MetricTileProps = ViewProps & {
  label: string;
  value: string;
  unit: string;
  deltaLabel: string;
  metaLabel: string;
  accentColor: ColorToken;
  tone?: MetricTone;
  icon?: keyof typeof Feather.glyphMap;
};

const toneColor = (tone: MetricTone = 'neutral') => {
  if (tone === 'positive') return getColor('positive');
  if (tone === 'negative') return getColor('negative');
  return getColor('graphite');
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
    className={`flex-1 rounded-card border bg-surface p-6 shadow-soft ${className}`}
    style={{ borderColor: colorWithOpacity('charcoal', 0.08) }}
    accessibilityRole="summary"
    accessibilityLabel={`${label} ${value} ${unit}. ${deltaLabel}. ${metaLabel}`}
  >
    <View className="mb-3 flex-row items-center justify-between">
      <Text className="text-[13px] font-[Poppins_500Medium] uppercase tracking-[1px] text-muted">{label}</Text>
      <View
        className="h-8 w-8 items-center justify-center rounded-[12px]"
        style={{ backgroundColor: colorWithOpacity(accentColor, 0.12) }}
        accessibilityElementsHidden
        importantForAccessibility="no"
      >
        <Feather name={icon} size={16} color={getColor(accentColor)} />
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
