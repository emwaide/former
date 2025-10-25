import { PropsWithChildren } from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ScreenProps = PropsWithChildren<{
  scrollable?: boolean;
  padded?: boolean;
  backgroundVariant?: 'default' | 'surface';
}>;

const paddingClasses = 'px-6 pt-6 pb-10';

export const Screen = ({
  children,
  scrollable = true,
  padded = true,
  backgroundVariant = 'default',
}: ScreenProps) => {
  const insets = useSafeAreaInsets();
  const backgroundClass = backgroundVariant === 'surface' ? 'bg-surface' : 'bg-background';
  const safeAreaPadding = Math.max(insets.top, padded ? 24 : 0);
  const contentPadding = padded ? paddingClasses : '';

  if (scrollable) {
    return (
      <SafeAreaView className={`flex-1 ${backgroundClass}`} style={{ paddingTop: safeAreaPadding }}>
        <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
          <View className={`flex-1 ${contentPadding}`}>{children}</View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className={`flex-1 ${backgroundClass}`} style={{ paddingTop: safeAreaPadding }}>
      <View className={`flex-1 ${contentPadding}`}>{children}</View>
    </SafeAreaView>
  );
};
