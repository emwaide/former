import { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme';

type StepperProps = {
  value: number;
  onChange: (value: number) => void;
  step?: number;
  min?: number;
  max?: number;
};

export const Stepper = ({ value, onChange, step = 1, min = Number.NEGATIVE_INFINITY, max = Number.POSITIVE_INFINITY }: StepperProps) => {
  const { tokens } = useTheme();
  const update = useCallback(
    (delta: number) => {
      const next = Math.min(max, Math.max(min, value + delta));
      onChange(next);
    },
    [max, min, onChange, value],
  );

  return (
    <View style={[styles.container, { borderRadius: tokens.radius.pill, borderColor: tokens.colors.mutedBorder }]}
    >
      <Pressable
        accessibilityLabel="Decrease value"
        accessibilityRole="button"
        onPress={() => update(-step)}
        style={[styles.control, { borderColor: tokens.colors.mutedBorder }]}
      >
        <Text style={{ color: tokens.colors.textSecondary, fontSize: 20 }}>−</Text>
      </Pressable>
      <Text style={{ color: tokens.colors.text, fontFamily: tokens.typography.fontFamilyAlt, fontSize: 16 }}>{value}</Text>
      <Pressable
        accessibilityLabel="Increase value"
        accessibilityRole="button"
        onPress={() => update(step)}
        style={[styles.control, { borderColor: tokens.colors.mutedBorder }]}
      >
        <Text style={{ color: tokens.colors.textSecondary, fontSize: 20 }}>+</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    gap: 12,
    height: 48,
  },
  control: {
    borderWidth: 1,
    borderRadius: 999,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
