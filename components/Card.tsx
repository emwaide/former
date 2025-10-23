import { PropsWithChildren } from 'react';
import { Pressable, StyleSheet, View, ViewProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme';

type CardProps = PropsWithChildren<{
  onPress?: () => void;
  gradient?: boolean;
  accessibilityLabel?: string;
}> & ViewProps;

export const Card = ({ children, onPress, gradient = false, style, accessibilityLabel, ...rest }: CardProps) => {
  const { tokens } = useTheme();
  const content = (
    <View
      accessibilityLabel={accessibilityLabel}
      style={[
        styles.card,
        {
          backgroundColor: gradient ? 'transparent' : tokens.colors.card,
          borderRadius: tokens.radius.card,
          shadowColor: tokens.colors.shadow,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );

  if (gradient) {
    return (
      <LinearGradient colors={tokens.colors.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ borderRadius: tokens.radius.card }}>
        {onPress ? (
          <Pressable
            onPress={onPress}
            android_ripple={{ color: tokens.colors.accentSecondary, borderless: false }}
            style={({ pressed }) => [styles.pressable, pressed && { opacity: 0.9 }]}
            accessibilityRole="button"
            accessibilityLabel={accessibilityLabel}
          >
            {content}
          </Pressable>
        ) : (
          content
        )}
      </LinearGradient>
    );
  }

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        android_ripple={{ color: tokens.colors.mutedBorder, borderless: false }}
        style={({ pressed }) => [styles.pressable, pressed && { transform: [{ scale: 0.99 }] }]}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
      >
        {content}
      </Pressable>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  pressable: {
    borderRadius: 24,
  },
});
