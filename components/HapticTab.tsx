// components/HapticTab.tsx
import type { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { TouchableOpacity } from 'react-native';

export function HapticTab(props: BottomTabBarButtonProps) {
    return (
        <TouchableOpacity
            {...props}
            onPress={(e) => {
                // trigger a little haptic bump
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                // still call original handler
                props.onPress?.(e);
            }}
            activeOpacity={0.7}
        />
    );
}
