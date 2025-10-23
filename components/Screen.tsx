import { PropsWithChildren } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme';

type ScreenProps = PropsWithChildren<{
  scrollable?: boolean;
  padded?: boolean;
  backgroundVariant?: 'default' | 'surface';
}>;

export const Screen = ({
  children,
  scrollable = true,
  padded = true,
  backgroundVariant = 'default',
}: ScreenProps) => {
  const insets = useSafeAreaInsets();
  const { tokens } = useTheme();
  const Container = scrollable ? ScrollView : View;
  const paddingStyle = padded
    ? {
        paddingHorizontal: tokens.spacing.xl,
        paddingTop: tokens.spacing.lg,
        paddingBottom: tokens.spacing['2xl'],
      }
    : null;

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        {
          backgroundColor:
            backgroundVariant === 'surface'
              ? tokens.colors.surface
              : tokens.colors.background,
        },
        { paddingTop: Math.max(insets.top, tokens.spacing.lg) },
      ]}
    >
      <Container
        contentContainerStyle={scrollable ? [styles.container, paddingStyle] : undefined}
        style={!scrollable ? [styles.container, paddingStyle] : undefined}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </Container>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
  },
});
