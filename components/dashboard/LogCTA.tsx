import { ReactNode } from 'react';
import { Pressable, StyleProp, StyleSheet, Text, ViewStyle } from 'react-native';
import { palette, spacing, typography } from './constants';

type LogCTAProps = {
  label?: string;
  onPress: () => void;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  icon?: ReactNode;
};

export const LogCTA = ({
  label = 'Log New Entry',
  onPress,
  accessibilityLabel = 'Log a new entry',
  style,
  icon,
}: LogCTAProps) => (
  <Pressable
    accessibilityRole="button"
    accessibilityLabel={accessibilityLabel}
    style={({ pressed }) => [styles.button, pressed && styles.buttonPressed, style]}
    onPress={onPress}
  >
    {icon}
    <Text style={styles.label}>{label}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: palette.navy,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  label: {
    color: '#FFFFFF',
    fontSize: typography.subtitle,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 0.2,
  },
});

export default LogCTA;
