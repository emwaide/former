import { PropsWithChildren } from 'react';
import { Pressable, View, ViewProps } from 'react-native';

import { getColor } from '../utils/colors';

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
      className={`w-full rounded-card border border-border bg-surface p-6 shadow-soft ${className}`}
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
        android_ripple={{ color: getColor('border'), borderless: false }}
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
