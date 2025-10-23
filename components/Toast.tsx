import { Animated, StyleSheet, Text } from 'react-native';
import { useEffect, useMemo, useRef } from 'react';
import { useTheme } from '../theme';

type ToastProps = {
  message: string;
  visible: boolean;
};

export const Toast = ({ message, visible }: ToastProps) => {
  const { tokens } = useTheme();
  const translateY = useRef(new Animated.Value(100)).current;

  useEffect(() => {
    Animated.spring(translateY, {
      toValue: visible ? 0 : 100,
      useNativeDriver: true,
      ...tokens.motion.springConfig,
    }).start();
  }, [translateY, tokens.motion.springConfig, visible]);

  const shadowStyle = useMemo(
    () => ({
      shadowColor: tokens.colors.shadow,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.25,
      shadowRadius: 16,
      elevation: 6,
    }),
    [tokens.colors.shadow],
  );

  return (
    <Animated.View
      pointerEvents={visible ? 'auto' : 'none'}
      style={[
        styles.toast,
        shadowStyle,
        {
          backgroundColor: tokens.colors.contrastCard,
          borderRadius: tokens.radius.card,
          transform: [{ translateY }],
        },
      ]}
    >
      <Text style={{ color: tokens.colors.card, fontFamily: tokens.typography.fontFamilyAlt }}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 32,
    padding: 20,
  },
});
