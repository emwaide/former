import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MetricTile } from './MetricTile';
import type { MetricTone, MetricTileProps } from './MetricTile';
import { ThemeTokens, useTheme } from '../../theme';

const withAlpha = (color: string, alpha: number) => {
  if (color.startsWith('rgb')) {
    const values = color
      .replace(/rgba?\(/, '')
      .replace(')', '')
      .split(',')
      .map((value) => parseFloat(value.trim()));
    const [r = 0, g = 0, b = 0] = values.slice(0, 3);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
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

type MetricsGridProps = {
  metrics: {
    id: string;
    label: string;
    value: string;
    unit: string;
    deltaLabel: string;
    metaLabel: string;
    tone?: MetricTone;
    accentColor: string;
    icon?: MetricTileProps['icon'];
  }[];
};

export const MetricsGrid = ({ metrics }: MetricsGridProps) => {
  const { tokens } = useTheme();
  const styles = useMemo(() => createStyles(tokens), [tokens]);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Body composition</Text>
        <View style={styles.headerRule} />
      </View>

      <View style={styles.grid}>
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
          />
        ))}
      </View>
    </View>
  );
};

const createStyles = (tokens: ThemeTokens) =>
  StyleSheet.create({
    container: {
      gap: tokens.spacing.lg,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: tokens.spacing.sm,
    },
    title: {
      color: tokens.colors.textSecondary,
      fontSize: tokens.typography.caption,
      fontFamily: tokens.typography.fontFamilyMedium,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
    },
    headerRule: {
      flex: 1,
      height: StyleSheet.hairlineWidth,
      backgroundColor: withAlpha(tokens.colors.text, 0.08),
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: tokens.spacing.md,
    },
  });

export default MetricsGrid;
