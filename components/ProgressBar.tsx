import { StyleSheet, View } from 'react-native';
import { Body } from './Typography';
import { useTheme } from '../theme';

type ProgressBarProps = {
  value: number; // 0-1
  label?: string;
};

export const ProgressBar = ({ value, label }: ProgressBarProps) => {
  const { tokens } = useTheme();
  const clamped = Math.max(0, Math.min(1, value));
  return (
    <View>
      {label ? (
        <Body weight="semibold" color={tokens.colors.textSecondary} style={styles.label}>
          {label}
        </Body>
      ) : null}
      <View
        style={[
          styles.track,
          {
            backgroundColor: tokens.colors.mutedBorder,
            borderRadius: tokens.radius.pill,
          },
        ]}
        accessibilityRole="progressbar"
        accessibilityValue={{ min: 0, max: 100, now: Math.round(clamped * 100) }}
      >
        <View
          style={[
            styles.fill,
            {
              width: `${clamped * 100}%`,
              backgroundColor: tokens.colors.accent,
              borderRadius: tokens.radius.pill,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    marginBottom: 8,
  },
  track: {
    height: 16,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
});
