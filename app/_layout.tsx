import { useEffect, useState } from 'react';
import '../global.css';
import { ActivityIndicator, View } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { ThemeProvider } from '../theme';
import { initializeDatabase } from '../db/init';
import { seedDemoData } from '../db/seed';

const Loading = () => (
  <View className="flex-1 items-center justify-center bg-background">
    <ActivityIndicator size="large" color="#37D0B4" />
  </View>
);

const RootNavigator = () => {
  const [ready, setReady] = useState(false);
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });

  useEffect(() => {
    const prepare = async () => {
      await initializeDatabase();
      await seedDemoData();
      setReady(true);
    };
    prepare();
  }, []);

  if (!ready || !fontsLoaded) {
    return <Loading />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}
    >
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
};

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <StatusBar style="dark" />
        <RootNavigator />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
