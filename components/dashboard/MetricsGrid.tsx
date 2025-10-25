import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { MetricTile } from './MetricTile';
import type { MetricTone } from './MetricTile';
import { ThemeTokens, useTheme } from '../../theme';

type MetricsGridProps = {
  metrics: {
    id: string;
    label: string;
    valueLabel: string;
    deltaLabel: string;
    metaLabel: string;
    tone?: MetricTone;
    accentColor: string;
    progress: number;
  }[];
  showMore?: boolean;
};

export const MetricsGrid = ({ metrics, showMore }: MetricsGridProps) => {
  const { tokens } = useTheme();
  const styles = useMemo(() => createStyles(tokens), [tokens]);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Body composition</Text>
        {showMore ? (
          <Link href="/(tabs)/trends" style={styles.link} accessibilityRole="link">
            <Text style={styles.linkText}>See full composition trends →</Text>
          </Link>
        ) : null}
      </View>

      <View style={styles.grid}>
        {metrics.map(({ id, label, valueLabel, deltaLabel, metaLabel, accentColor, progress, tone }) => (
          <MetricTile
            key={id}
            label={label}
            valueLabel={valueLabel}
            deltaLabel={deltaLabel}
            metaLabel={metaLabel}
            tone={tone}
            accentColor={accentColor}
            progress={progress}
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
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    title: {
      color: tokens.colors.textSecondary,
      fontSize: tokens.typography.caption,
      fontFamily: tokens.typography.fontFamilyMedium,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
    },
    link: {
      paddingVertical: tokens.spacing.xs,
    },
    linkText: {
      color: tokens.colors.textSubtle,
      fontSize: tokens.typography.caption,
      fontFamily: tokens.typography.fontFamilyMedium,
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: tokens.spacing.md,
    },
  });

export default MetricsGrid;
