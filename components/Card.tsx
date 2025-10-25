import { PropsWithChildren } from 'react';
import { Pressable, View, ViewProps } from 'react-native';

type CardProps = PropsWithChildren<{
  onPress?: () => void;
  className?: string;
  accessibilityLabel?: string;
}> &
  ViewProps;

export const Card = ({ children, onPress, className = '', accessibilityLabel, ...rest }: CardProps) => {
  const content = (
    <View
      {...rest}
      accessibilityLabel={onPress ? undefined : accessibilityLabel}
      className={`w-full rounded-card border border-[#E5EDF2] bg-surface p-6 shadow-soft ${className}`}
    >
      {children}
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        android_ripple={{ color: '#E5EDF2', borderless: false }}
        className="w-full overflow-hidden rounded-card"
      >
        {({ pressed }) => (
          <View style={{ transform: [{ scale: pressed ? 0.97 : 1 }] }}>{content}</View>
        )}
      </Pressable>
    );
  }

  return content;
};
