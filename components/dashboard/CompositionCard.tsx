import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { beachPalette, shadow, spacing } from './palette';

type CompositionStat = {
  label: string;
  value: string;
};

type HeadlinePart = {
  text: string;
  color?: string;
};

type CompositionCardProps = {
  title: string;
  icon?: ReactNode;
  headline: HeadlinePart[];
  progress?: number;
  progressColor?: string;
  stats: CompositionStat[];
  accessibilityLabel: string;
};

export const CompositionCard = ({
  title,
  icon,
  headline,
  progress,
  progressColor = beachPalette.deepNavy,
  stats,
  accessibilityLabel,
}: CompositionCardProps) => {
  const showProgress = typeof progress === 'number';

  return (
    <View accessible accessibilityLabel={accessibilityLabel} style={[styles.card, styles.shadow]}>
      <View style={styles.titleRow}>
        {icon ? <View style={styles.icon}>{icon}</View> : null}
        <Text style={styles.title}>{title}</Text>
      </View>
      <Text style={styles.headline}>
        {headline.map((part, index) => (
          <Text key={`${title}-${index}`} style={[styles.headlinePart, part.color ? { color: part.color } : null]}>
            {part.text}
          </Text>
        ))}
      </Text>
      {showProgress ? (
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${Math.max(0, Math.min(progress, 1)) * 100}%`, backgroundColor: progressColor }]} />
        </View>
      ) : null}
      <View style={styles.statsRow}>
        {stats.map((stat) => (
          <View key={stat.label} style={styles.statBlock}>
            <Text style={styles.statLabel}>{stat.label}</Text>
            <Text style={styles.statValue}>{stat.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: beachPalette.card,
    borderRadius: 16,
    padding: spacing * 2,
  },
  shadow: {
    shadowColor: shadow.shadowColor,
    shadowOffset: shadow.shadowOffset,
    shadowOpacity: shadow.shadowOpacity,
    shadowRadius: shadow.shadowRadius,
    elevation: shadow.elevation,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing,
  },
  icon: {
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: 'rgba(90,103,114,0.7)',
  },
  headline: {
    marginTop: spacing * 1.5,
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    color: beachPalette.deepNavy,
  },
  headlinePart: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    color: beachPalette.deepNavy,
  },
  progressTrack: {
    marginTop: spacing * 2,
    height: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(168,216,234,0.25)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 12,
  },
  statsRow: {
    marginTop: spacing * 2,
    flexDirection: 'row',
    gap: spacing * 2,
  },
  statBlock: {
    flex: 1,
  },
  statLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: 'rgba(90,103,114,0.7)',
    letterSpacing: 0.4,
  },
  statValue: {
    marginTop: spacing * 0.75,
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: beachPalette.deepNavy,
  },
});
