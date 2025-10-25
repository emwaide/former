import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { getColor } from '../utils/colors';

type ButtonVariant = 'primary' | 'secondary';

type ButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  accessibilityLabel?: string;
};

export const Button = ({
  label,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  accessibilityLabel,
}: ButtonProps) => {
  const isPrimary = variant === 'primary';

  if (!isPrimary) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? label}
        onPress={onPress}
        disabled={disabled || loading}
        android_ripple={{ color: getColor('border'), borderless: false }}
        className="w-full overflow-hidden rounded-[12px]"
      >
        {({ pressed }) => (
          <View
            className={`h-12 w-full items-center justify-center rounded-[12px] border border-border bg-surface ${
              disabled ? 'opacity-60' : pressed ? 'opacity-80' : 'opacity-100'
            }`}
            style={{ transform: [{ scale: pressed ? 0.98 : 1 }] }}
          >
            {loading ? (
              <ActivityIndicator color={getColor('graphite')} />
            ) : (
              <Text className="text-[16px] font-[Poppins_500Medium] leading-[22px] text-charcoal">
                {label}
              </Text>
            )}
          </View>
        )}
      </Pressable>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      onPress={onPress}
      disabled={disabled || loading}
      className="w-full overflow-hidden rounded-[12px]"
    >
      {({ pressed }) => (
        <View
          className={`h-12 w-full items-center justify-center rounded-[12px] bg-teal shadow-card ${
            disabled ? 'opacity-60' : pressed ? 'opacity-90' : 'opacity-100'
          }`}
          style={{ transform: [{ scale: pressed ? 0.98 : 1 }] }}
        >
          {loading ? (
            <ActivityIndicator color={getColor('surface')} />
          ) : (
            <Text className="text-[16px] font-[Poppins_600SemiBold] leading-[24px] text-surface">
              {label}
            </Text>
          )}
        </View>
      )}
    </Pressable>
  );
};
