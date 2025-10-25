import { Pressable, Text } from 'react-native';

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
    className={`flex-row items-center rounded-pill border px-4 py-2 ${
      selected ? 'border-teal bg-[rgba(55,208,180,0.12)]' : 'border-[#E5EDF2]'
    }`}
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
