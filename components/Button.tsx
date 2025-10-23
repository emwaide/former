import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme';

type ButtonVariant = 'primary' | 'secondary';

type ButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  accessibilityLabel?: string;
};

export const Button = ({
  label,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  accessibilityLabel,
}: ButtonProps) => {
  const { tokens } = useTheme();
  const isPrimary = variant === 'primary';

  if (!isPrimary) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? label}
        onPress={onPress}
        disabled={disabled || loading}
        android_ripple={{ color: tokens.colors.mutedBorder, borderless: false }}
        style={({ pressed }) => [
          styles.secondary,
          {
            borderColor: tokens.colors.mutedBorder,
            opacity: disabled ? 0.6 : 1,
            transform: [{ scale: pressed ? 0.98 : 1 }],
          },
        ]}
      >
        {loading ? (
          <ActivityIndicator color={tokens.colors.textSecondary} />
        ) : (
          <Text
            style={{
              color: tokens.colors.text,
              fontFamily: tokens.typography.fontFamilyMedium,
              fontSize: tokens.typography.subheading,
              lineHeight: 22,
            }}
          >
            {label}
          </Text>
        )}
      </Pressable>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      onPress={onPress}
      disabled={disabled || loading}
      style={styles.primaryWrapper}
    >
      {({ pressed }) => (
        <LinearGradient
          colors={tokens.colors.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[
            styles.primary,
            {
              opacity: disabled ? 0.6 : 1,
              transform: [{ scale: pressed ? 0.98 : 1 }],
              shadowColor: tokens.colors.softShadow,
            },
          ]}
        >
          {loading ? (
            <ActivityIndicator color={tokens.colors.surface} />
          ) : (
            <Text
              style={{
                color: tokens.colors.surface,
                fontFamily: tokens.typography.fontFamilyAlt,
                fontSize: tokens.typography.subheading,
                lineHeight: 24,
              }}
            >
              {label}
            </Text>
          )}
        </LinearGradient>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  primaryWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
    width: '100%',
  },
  primary: {
    height: 48,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 4,
  },
  secondary: {
    height: 48,
    width: '100%',
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
});
