import { Tabs } from 'expo-router';
import { useTheme } from '../../theme';
import { Icon } from '../../components';

export default function TabLayout() {
  const { tokens } = useTheme();
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: tokens.colors.accent,
        tabBarInactiveTintColor: tokens.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: tokens.colors.surface,
          borderTopColor: tokens.colors.mutedBorder,
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontFamily: tokens.typography.fontFamilyAlt,
          fontSize: 12,
        },
        tabBarIcon: ({ color, size }) => {
          const iconMap: Record<string, string> = {
            dashboard: 'home',
            trends: 'line-chart',
            log: 'plus-circle',
            insights: 'zap',
            settings: 'sliders',
          };
          const iconName = iconMap[route.name] ?? 'circle';
          return <Icon name={iconName as any} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="dashboard" options={{ title: 'Dashboard' }} />
      <Tabs.Screen name="trends" options={{ title: 'Trends' }} />
      <Tabs.Screen name="log" options={{ title: 'Log' }} />
      <Tabs.Screen name="insights" options={{ title: 'Insights' }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
    </Tabs>
  );
}
