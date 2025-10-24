import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemeTokens, useTheme } from '../../theme';

type GuidanceCardProps = {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
};

export const GuidanceCard = ({ message, actionLabel, onAction }: GuidanceCardProps) => {
  const { tokens } = useTheme();
  const styles = useMemo(() => createStyles(tokens), [tokens]);

  return (
    <LinearGradient colors={tokens.colors.guidanceGradient} style={styles.card}>
      <View style={styles.content}>
        <Text style={styles.title}>Guidance</Text>
        <Text style={styles.message}>{message}</Text>
        {actionLabel && onAction ? (
          <Pressable
            accessibilityRole="button"
            onPress={onAction}
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          >
            <Text style={styles.buttonLabel}>{actionLabel}</Text>
          </Pressable>
        ) : null}
      </View>
    </LinearGradient>
  );
};

const createStyles = (tokens: ThemeTokens) =>
  StyleSheet.create({
    card: {
      borderRadius: tokens.radius.card,
      shadowColor: tokens.colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 12,
      elevation: 3,
    },
    content: {
      padding: tokens.spacing.lg,
      gap: tokens.spacing.md,
    },
    title: {
      color: tokens.colors.brandNavy,
      fontSize: tokens.typography.subheading,
      fontFamily: tokens.typography.fontFamilyAlt,
    },
    message: {
      color: tokens.colors.brandNavy,
      fontSize: tokens.typography.body,
      lineHeight: tokens.typography.body * 1.4,
      fontFamily: tokens.typography.fontFamily,
    },
    button: {
      alignSelf: 'flex-start',
      backgroundColor: tokens.colors.brandNavy,
      paddingHorizontal: tokens.spacing.xl,
      paddingVertical: tokens.spacing.md,
      borderRadius: tokens.radius.pill,
    },
    buttonPressed: {
      opacity: 0.85,
    },
    buttonLabel: {
      color: '#FFFFFF',
      fontSize: tokens.typography.body,
      fontFamily: tokens.typography.fontFamilyAlt,
    },
  });

export default GuidanceCard;
