import { Animated, Text } from 'react-native';
import { useEffect, useMemo, useRef } from 'react';

import { colorWithOpacity, getColor } from '../utils/colors';

type ToastProps = {
  message: string;
  visible: boolean;
};

const SPRING_CONFIG = {
  damping: 20,
  stiffness: 180,
  mass: 1,
};

export const Toast = ({ message, visible }: ToastProps) => {
  const translateY = useRef(new Animated.Value(100)).current;

  useEffect(() => {
    Animated.spring(translateY, {
      toValue: visible ? 0 : 100,
      useNativeDriver: true,
      ...SPRING_CONFIG,
    }).start();
  }, [translateY, visible]);

  const shadowStyle = useMemo(
    () => ({
      shadowColor: colorWithOpacity('charcoal', 0.25),
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.25,
      shadowRadius: 16,
      elevation: 6,
    }),
    [],
  );

  return (
    <Animated.View
      pointerEvents={visible ? 'auto' : 'none'}
      style={[
        {
          position: 'absolute',
          left: 24,
          right: 24,
          bottom: 32,
          padding: 20,
          borderRadius: 16,
          backgroundColor: getColor('navy'),
          transform: [{ translateY }],
        },
        shadowStyle,
      ]}
    >
      <Text style={{ color: getColor('surface'), fontFamily: 'Poppins_600SemiBold' }}>{message}</Text>
    </Animated.View>
  );
};
