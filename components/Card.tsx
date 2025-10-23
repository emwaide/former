import { PropsWithChildren, useEffect, useMemo, useRef } from 'react';
import { Animated, Pressable, StyleSheet, View, ViewProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme';

type CardProps = PropsWithChildren<{
  onPress?: () => void;
  gradient?: boolean;
  accessibilityLabel?: string;
}> &
  ViewProps;

const marginKeys = [
  'margin',
  'marginTop',
  'marginBottom',
  'marginLeft',
  'marginRight',
  'marginStart',
  'marginEnd',
  'marginHorizontal',
  'marginVertical',
  'flex',
  'flexGrow',
  'flexShrink',
  'flexBasis',
  'alignSelf',
  'width',
  'height',
  'minWidth',
  'maxWidth',
  'minHeight',
  'maxHeight',
] as const;

type MarginKey = (typeof marginKeys)[number];

export const Card = ({ children, onPress, gradient = false, style, accessibilityLabel, ...rest }: CardProps) => {
  const { tokens } = useTheme();
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fade, {
      toValue: 1,
      duration: tokens.motion.durationBase,
      useNativeDriver: true,
    }).start();
  }, [fade, tokens.motion.durationBase]);

  const { outerStyle, innerStyle } = useMemo(() => {
    const flattened = StyleSheet.flatten(style) ?? {};
    const outer: Record<string, unknown> = {};
    const inner: Record<string, unknown> = {};
    Object.entries(flattened).forEach(([key, value]) => {
      if (marginKeys.includes(key as MarginKey)) {
        outer[key] = value;
      } else {
        inner[key] = value;
      }
    });
    return { outerStyle: outer, innerStyle: inner };
  }, [style]);

  const renderCard = (pressed: boolean) => {
    const baseShadow = pressed ? 0.18 : 0.12;
    if (gradient) {
      return (
        <Animated.View
          style={[
            styles.card,
            outerStyle,
            {
              opacity: fade,
              transform: [{ scale: pressed ? 0.98 : 1 }],
              shadowColor: tokens.colors.shadow,
              shadowOpacity: baseShadow,
              borderRadius: tokens.radius.card,
              padding: 0,
              backgroundColor: 'transparent',
            },
          ]}
        >
          <LinearGradient
            colors={tokens.colors.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.gradient, { borderRadius: tokens.radius.card }]}
          >
            <View
              {...rest}
              accessibilityLabel={onPress ? undefined : accessibilityLabel}
              style={[
                styles.gradientInner,
                innerStyle,
                {
                  borderRadius: tokens.radius.card,
                },
              ]}
            >
              {children}
            </View>
          </LinearGradient>
        </Animated.View>
      );
    }

    return (
      <Animated.View
        {...rest}
        accessibilityLabel={onPress ? undefined : accessibilityLabel}
        style={[
          styles.card,
          outerStyle,
          innerStyle,
          {
            opacity: fade,
            transform: [{ scale: pressed ? 0.98 : 1 }],
            backgroundColor: tokens.colors.card,
            borderRadius: tokens.radius.card,
            shadowColor: tokens.colors.shadow,
            shadowOpacity: baseShadow,
          },
        ]}
      >
        {children}
      </Animated.View>
    );
  };

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        android_ripple={{ color: tokens.colors.mutedBorder, borderless: false }}
        style={styles.pressable}
      >
        {({ pressed }) => renderCard(pressed)}
      </Pressable>
    );
  }

  return renderCard(false);
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 24,
    elevation: 6,
  },
  gradient: {
    flex: 1,
    borderRadius: 16,
  },
  gradientInner: {
    flex: 1,
    padding: 16,
  },
  pressable: {
    borderRadius: 16,
  },
});
