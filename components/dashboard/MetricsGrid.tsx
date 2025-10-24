import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { MetricTile } from './MetricTile';
import { ThemeTokens, useTheme } from '../../theme';

type MetricsGridProps = {
  metrics: {
    id: string;
    label: string;
    headline: string;
    subtext: string;
    icon: string;
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
        <Text style={styles.title}>Body Composition</Text>
        {showMore ? (
          <Link href="/(tabs)/trends" style={styles.link} accessibilityRole="link">
            <Text style={styles.linkText}>See full composition trends →</Text>
          </Link>
        ) : null}
      </View>

      <View style={styles.grid}>
        {metrics.map(({ id, label, headline, subtext, icon, accentColor, progress }) => (
          <MetricTile
            key={id}
            label={label}
            headline={headline}
            subtext={subtext}
            icon={icon}
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
      marginBottom: tokens.spacing.xl,
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    title: {
      color: tokens.colors.brandNavy,
      fontSize: tokens.typography.subheading,
      fontFamily: tokens.typography.fontFamilyAlt,
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
