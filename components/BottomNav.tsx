import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from './Icon';
import { useTheme } from '../theme';
import { beachPalette, shadow } from './dashboard/palette';

type TabKey = 'index' | 'trends' | 'log' | 'insights' | 'settings';

const iconMap: Record<TabKey, string> = {
  index: 'layout',
  trends: 'trending-up',
  log: 'plus-circle',
  insights: 'pie-chart',
  settings: 'settings',
};

export const BottomNav = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const { tokens } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: Math.max(insets.bottom, 0),
          backgroundColor: '#FAF9F6EE',
          borderTopColor: `${beachPalette.deepNavy}14`,
          shadowColor: shadow.shadowColor,
        },
      ]}
    >
      <View style={styles.row}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const { options } = descriptors[route.key];
          const label =
            typeof options.tabBarLabel === 'string'
              ? options.tabBarLabel
              : options.title ?? route.name;
          const iconName = iconMap[(route.name as TabKey) ?? 'dashboard'] ?? 'circle';

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

          const inactiveColor = `${beachPalette.driftwood}99`;

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityLabel={label}
              accessibilityState={isFocused ? { selected: true } : undefined}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tab}
            >
              {({ pressed }) => (
                <View style={styles.tabContent}>
                  <View
                    style={[
                      styles.indicator,
                      {
                        backgroundColor: `${beachPalette.deepNavy}33`,
                        opacity: isFocused ? 1 : 0,
                      },
                    ]}
                  />
                  <Icon
                    name={iconName}
                    size={22}
                    color={isFocused ? beachPalette.deepNavy : inactiveColor}
                    accessibilityLabel={label}
                  />
                  <Text
                    style={{
                      marginTop: 2,
                      color: isFocused ? beachPalette.deepNavy : inactiveColor,
                      fontFamily: tokens.typography.fontFamilyMedium,
                      fontSize: 12,
                      opacity: pressed ? 0.8 : 1,
                    }}
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

const styles = StyleSheet.create({
  container: {
    borderTopWidth: StyleSheet.hairlineWidth,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: shadow.shadowOpacity,
    shadowRadius: shadow.shadowRadius,
    elevation: shadow.elevation,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicator: {
    width: 32,
    height: 3,
    borderRadius: 999,
    marginBottom: 6,
  },
});
