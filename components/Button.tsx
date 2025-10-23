import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
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

export const Button = ({ label, onPress, variant = 'primary', loading = false, disabled = false, accessibilityLabel }: ButtonProps) => {
  const { tokens } = useTheme();
  const backgroundColor = variant === 'primary' ? tokens.colors.accentSecondary : tokens.colors.surface;
  const textColor = variant === 'primary' ? tokens.colors.surface : tokens.colors.text;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor,
          borderRadius: tokens.radius.pill,
          borderWidth: variant === 'secondary' ? 1 : 0,
          borderColor: variant === 'secondary' ? tokens.colors.mutedBorder : 'transparent',
          opacity: disabled ? 0.6 : 1,
        },
        pressed && { transform: [{ scale: 0.98 }] },
      ]}
    >
      {loading ? <ActivityIndicator color={textColor} /> : <Text style={{ color: textColor, fontFamily: tokens.typography.fontFamilyAlt, fontSize: 16 }}>{label}</Text>}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(0,0,0,0.1)',
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    shadowOpacity: 0.2,
    elevation: 4,
  },
});
