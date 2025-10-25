import { Pressable, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

type GuidanceCardProps = {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
};

export const GuidanceCard = ({ message, actionLabel, onAction }: GuidanceCardProps) => (
  <View className="flex-row items-start gap-4 rounded-[20px] border border-[rgba(55,208,180,0.25)] bg-[rgba(105,224,218,0.16)] p-6 shadow-soft">
    <View className="h-11 w-11 items-center justify-center rounded-full bg-surface shadow-soft">
      <Feather name="sparkles" size={18} color="#37D0B4" accessibilityElementsHidden importantForAccessibility="no" />
    </View>
    <View className="flex-1 gap-2">
      <Text className="text-[16px] font-[Poppins_600SemiBold] text-charcoal">Today’s insight</Text>
      <Text className="text-[14px] font-[Poppins_400Regular] leading-relaxed text-graphite">{message}</Text>
      {actionLabel && onAction ? (
        <Pressable
          accessibilityRole="button"
          onPress={onAction}
          className="self-start rounded-pill bg-teal px-4 py-2"
        >
          <Text className="text-[12px] font-[Poppins_600SemiBold] uppercase tracking-[0.8px] text-white">
            {actionLabel}
          </Text>
        </Pressable>
      ) : null}
    </View>
  </View>
);

export default GuidanceCard;
