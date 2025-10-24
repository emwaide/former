import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { palette, spacing, typography, cardShadow } from './constants';

type GuidanceCardProps = {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
};

export const GuidanceCard = ({ message, actionLabel, onAction }: GuidanceCardProps) => (
  <LinearGradient colors={[palette.aquaSoft, palette.skyTint]} style={styles.card}>
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

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    ...cardShadow,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  title: {
    color: palette.navy,
    fontSize: typography.subtitle,
    fontFamily: 'Inter_600SemiBold',
  },
  message: {
    color: palette.navy,
    fontSize: typography.body,
    lineHeight: typography.body * 1.4,
    fontFamily: 'Inter_400Regular',
  },
  button: {
    alignSelf: 'flex-start',
    backgroundColor: palette.navy,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 24,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonLabel: {
    color: '#FFFFFF',
    fontSize: typography.body,
    fontFamily: 'Inter_600SemiBold',
  },
});

export default GuidanceCard;
