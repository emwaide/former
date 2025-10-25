import { Text, View } from 'react-native';
import { MetricTile } from './MetricTile';
import type { MetricTone, MetricTileProps } from './MetricTile';

import { colorWithOpacity, type ColorToken } from '../../utils/colors';

type MetricsGridProps = {
  metrics: {
    id: string;
    label: string;
    value: string;
    unit: string;
    deltaLabel: string;
    metaLabel: string;
    tone?: MetricTone;
    accentColor: ColorToken;
    icon?: MetricTileProps['icon'];
  }[];
};

export const MetricsGrid = ({ metrics }: MetricsGridProps) => (
  <View className="flex-col gap-6">
    <View className="flex-row items-center gap-3">
      <Text className="text-[13px] font-[Poppins_600SemiBold] uppercase tracking-[1px] text-muted">
        Body composition
      </Text>
      <View className="h-px flex-1" style={{ backgroundColor: colorWithOpacity('charcoal', 0.1) }} />
    </View>

    <View className="flex-row flex-wrap gap-4">
      {metrics.map(({ id, label, value, unit, deltaLabel, metaLabel, accentColor, tone, icon }) => (
        <MetricTile
          key={id}
          label={label}
          value={value}
          unit={unit}
          deltaLabel={deltaLabel}
          metaLabel={metaLabel}
          tone={tone}
          accentColor={accentColor}
          icon={icon}
          className="min-w-[160px] flex-1"
        />
      ))}
    </View>
  </View>
);

export default MetricsGrid;
