import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from './Icon';

import { getColor } from '../utils/colors';

type TabKey = 'index' | 'trends' | 'log' | 'insights' | 'settings';

const iconMap: Record<TabKey, string> = {
  index: 'layout',
  trends: 'trending-up',
  log: 'plus-circle',
  insights: 'pie-chart',
  settings: 'settings',
};

export const BottomNav = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const insets = useSafeAreaInsets();

  return (
    <View className="border-t border-border bg-surface shadow-soft" style={{ paddingBottom: Math.max(insets.bottom, 0) }}>
      <View className="flex-row items-center justify-between px-[10px]">
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const { options } = descriptors[route.key];
          const label =
            typeof options.tabBarLabel === 'string'
              ? options.tabBarLabel
              : options.title ?? route.name;
          const iconName = iconMap[(route.name as TabKey) ?? 'index'] ?? 'circle';

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityLabel={label}
              accessibilityState={isFocused ? { selected: true } : undefined}
              onPress={onPress}
              onLongPress={onLongPress}
              className="flex-1 items-center justify-center py-3"
            >
              {({ pressed }) => (
                <View className="items-center justify-center">
                  <View className={`mb-1.5 h-[3px] w-8 rounded-full bg-tealBright ${isFocused ? 'opacity-100' : 'opacity-0'}`} />
                  <Icon
                    name={iconName}
                    size={22}
                    color={isFocused ? getColor('tealBright') : getColor('mutedOverlay')}
                    accessibilityLabel={label}
                  />
                  <Text
                    className={`mt-0.5 text-[12px] font-[Poppins_500Medium] ${
                      isFocused ? 'text-tealBright' : 'text-mutedOverlay'
                    } ${pressed ? 'opacity-80' : 'opacity-100'}`}
                  >
                    {label}
                  </Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};
