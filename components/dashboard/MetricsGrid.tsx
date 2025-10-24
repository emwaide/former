import { StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { MetricTile } from './MetricTile';
import { palette, spacing, typography } from './constants';

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

export const MetricsGrid = ({ metrics, showMore }: MetricsGridProps) => (
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

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
    marginBottom: spacing.xl,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: palette.navy,
    fontSize: typography.subtitle,
    fontFamily: 'Inter_600SemiBold',
  },
  link: {
    paddingVertical: spacing.xs,
  },
  linkText: {
    color: 'rgba(3,4,94,0.65)',
    fontSize: typography.caption,
    fontFamily: 'Inter_500Medium',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
});

export default MetricsGrid;
