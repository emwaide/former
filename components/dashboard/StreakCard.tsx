import { Pressable, Text, View } from 'react-native';

type StreakCardProps = {
  loggedDays: boolean[];
  loggedCount: number;
  onViewHistory?: () => void;
};

const withAlpha = (color: string, alpha: number) => {
  const sanitized = color.replace('#', '');
  const expanded =
    sanitized.length === 3
      ? sanitized
          .split('')
          .map((char) => char + char)
          .join('')
      : sanitized;
  const bigint = parseInt(expanded, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const StreakCard = ({ loggedDays, loggedCount, onViewHistory }: StreakCardProps) => {
  let currentStreak = 0;
  for (let i = loggedDays.length - 1; i >= 0; i -= 1) {
    if (loggedDays[i]) {
      currentStreak += 1;
    } else {
      break;
    }
  }

  const weekLoggedLabel = `${loggedCount} of 7 days`;
  const summaryLabel = `You’ve logged ${loggedCount} ${loggedCount === 1 ? 'day' : 'days'} this week. Small, regular actions create lasting change.`;

  return (
    <View className="flex-col gap-6 rounded-[20px] border border-[rgba(17,24,39,0.08)] bg-surface p-6 shadow-soft">
      <View className="flex-row items-center justify-between">
        <Text className="text-[16px] font-[Poppins_600SemiBold] uppercase tracking-[1px] text-charcoal">Consistency</Text>
        {onViewHistory ? (
          <Pressable accessibilityRole="button" onPress={onViewHistory} hitSlop={8}>
            <Text className="text-[13px] font-[Poppins_500Medium] text-muted">View history →</Text>
          </Pressable>
        ) : null}
      </View>

      <View className="flex-row items-center justify-between" accessibilityRole="text" accessibilityLabel={`This week ${weekLoggedLabel}`}>
        <Text className="text-[13px] font-[Poppins_500Medium] uppercase tracking-[1px] text-muted">This week</Text>
        <Text className="text-[16px] font-[Poppins_600SemiBold] text-teal">{weekLoggedLabel}</Text>
      </View>

      <View className="mt-2 flex-row items-center gap-2" accessibilityRole="image" accessibilityLabel={`${loggedCount} days logged this week`}>
        {loggedDays.map((day, index) => (
          <View
            key={index}
            className="flex-1 rounded-full"
            style={{
              backgroundColor: day ? '#37D0B4' : withAlpha('#111827', 0.08),
              height: 8,
            }}
          />
        ))}
      </View>

      <View className="flex-row items-start gap-4">
        <View className="rounded-pill bg-[rgba(55,208,180,0.14)] px-4 py-2">
          <Text className="text-[12px] font-[Poppins_600SemiBold] uppercase tracking-[0.8px] text-teal">
            {`${currentStreak}-day streak`}
          </Text>
        </View>
        <Text className="flex-1 text-[13px] font-[Poppins_400Regular] leading-relaxed text-graphite">{summaryLabel}</Text>
      </View>
    </View>
  );
};

export default StreakCard;
