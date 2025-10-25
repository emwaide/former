import { Pressable, Text } from 'react-native';

import { colorWithOpacity, getColor } from '../utils/colors';

type ChipProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
};

export const Chip = ({ label, selected = false, onPress }: ChipProps) => (
  <Pressable
    accessibilityRole="button"
    accessibilityState={{ selected }}
    onPress={onPress}
    className="flex-row items-center rounded-pill border px-4 py-2"
    style={{
      borderColor: selected ? getColor('teal') : getColor('border'),
      backgroundColor: selected ? colorWithOpacity('teal', 0.12) : undefined,
    }}
  >
    <Text
      className={`text-[14px] ${
        selected ? 'font-[Poppins_600SemiBold] text-charcoal' : 'font-[Poppins_400Regular] text-graphite'
      }`}
    >
      {label}
    </Text>
  </Pressable>
);
