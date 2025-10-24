import { ReactNode, useMemo } from 'react';
import { Pressable, StyleProp, StyleSheet, Text, ViewStyle } from 'react-native';
import { ThemeTokens, useTheme } from '../../theme';

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
}: LogCTAProps) => {
  const { tokens } = useTheme();
  const styles = useMemo(() => createStyles(tokens), [tokens]);

  return (
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
};

const createStyles = (tokens: ThemeTokens) =>
  StyleSheet.create({
    button: {
      backgroundColor: tokens.colors.brandNavy,
      paddingVertical: tokens.spacing.md,
      paddingHorizontal: tokens.spacing.xl,
      borderRadius: tokens.radius.pill,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      gap: tokens.spacing.sm,
    },
    buttonPressed: {
      opacity: 0.85,
    },
    label: {
      color: '#FFFFFF',
      fontSize: tokens.typography.subheading,
      fontFamily: tokens.typography.fontFamilyAlt,
      letterSpacing: 0.2,
    },
  });

export default LogCTA;
