import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme';

type ProgressBarProps = {
  value: number; // 0-1
  label?: string;
};

export const ProgressBar = ({ value, label }: ProgressBarProps) => {
  const { tokens } = useTheme();
  const clamped = Math.max(0, Math.min(1, value));

  return (
    <View accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 100, now: Math.round(clamped * 100) }}>
      {label ? (
        <Text
          style={{
            marginBottom: 8,
            color: tokens.colors.textSecondary,
            fontFamily: tokens.typography.fontFamilyMedium,
            fontSize: tokens.typography.caption,
          }}
        >
          {label}
        </Text>
      ) : null}
      <View
        style={[
          styles.track,
          {
            backgroundColor: tokens.colors.mutedBorder,
            borderRadius: tokens.radius.pill,
          },
        ]}
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
  track: {
    height: 12,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
});
