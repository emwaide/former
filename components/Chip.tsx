import { Pressable, StyleSheet, Text } from 'react-native';
import { useTheme } from '../theme';

type ChipProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
};

export const Chip = ({ label, selected = false, onPress }: ChipProps) => {
  const { tokens } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        {
          paddingHorizontal: tokens.spacing.lg,
          paddingVertical: tokens.spacing.sm,
          borderRadius: tokens.radius.pill,
          borderWidth: 1,
          borderColor: selected ? tokens.colors.accent : tokens.colors.mutedBorder,
          backgroundColor: selected ? tokens.colors.accent + '33' : 'transparent',
        },
        pressed && { opacity: 0.85 },
      ]}
    >
      <Text
        style={{
          fontSize: 14,
          fontFamily: selected ? tokens.typography.fontFamilyAlt : tokens.typography.fontFamily,
          color: selected ? tokens.colors.text : tokens.colors.textSecondary,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
