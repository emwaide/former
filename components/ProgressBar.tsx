import { Text, View } from 'react-native';

type ProgressBarProps = {
  value: number; // 0-1
  label?: string;
};

export const ProgressBar = ({ value, label }: ProgressBarProps) => {
  const clamped = Math.max(0, Math.min(1, value));

  return (
    <View accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 100, now: Math.round(clamped * 100) }}>
      {label ? (
        <Text className="mb-2 text-[13px] font-[Poppins_600SemiBold] uppercase tracking-[1px] text-muted">{label}</Text>
      ) : null}
      <View className="h-3 w-full overflow-hidden rounded-pill bg-[#E5EDF2]">
        <View className="h-full rounded-pill bg-teal" style={{ width: `${clamped * 100}%` }} />
      </View>
    </View>
  );
};
