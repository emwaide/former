import { useCallback } from 'react';
import { Pressable, Text, View } from 'react-native';

type StepperProps = {
  value: number;
  onChange: (value: number) => void;
  step?: number;
  min?: number;
  max?: number;
};

export const Stepper = ({ value, onChange, step = 1, min = Number.NEGATIVE_INFINITY, max = Number.POSITIVE_INFINITY }: StepperProps) => {
  const update = useCallback(
    (delta: number) => {
      const next = Math.min(max, Math.max(min, value + delta));
      onChange(next);
    },
    [max, min, onChange, value],
  );

  return (
    <View className="h-12 flex-row items-center justify-between gap-3 rounded-pill border border-border px-3">
      <Pressable
        accessibilityLabel="Decrease value"
        accessibilityRole="button"
        onPress={() => update(-step)}
        className="h-9 w-9 items-center justify-center rounded-full border border-border"
      >
        <Text className="text-[20px] text-graphite">−</Text>
      </Pressable>
      <Text className="text-[16px] font-[Poppins_600SemiBold] text-charcoal">{value}</Text>
      <Pressable
        accessibilityLabel="Increase value"
        accessibilityRole="button"
        onPress={() => update(step)}
        className="h-9 w-9 items-center justify-center rounded-full border border-border"
      >
        <Text className="text-[20px] text-graphite">+</Text>
      </Pressable>
    </View>
  );
};
