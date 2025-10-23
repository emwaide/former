import { PropsWithChildren } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from './Button';
import { useTheme } from '../theme';

type EmptyStateProps = PropsWithChildren<{
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}>;

export const EmptyState = ({ title, description, actionLabel, onAction, children }: EmptyStateProps) => {
  const { tokens } = useTheme();
  return (
    <View style={[styles.container, { padding: tokens.spacing['2xl'] }]}
    >
      <Text style={{ fontFamily: tokens.typography.fontFamilyAlt, fontSize: tokens.typography.subheading, color: tokens.colors.text, marginBottom: tokens.spacing.md }}>
        {title}
      </Text>
      <Text style={{ fontFamily: tokens.typography.fontFamily, fontSize: tokens.typography.body, color: tokens.colors.textSecondary, marginBottom: tokens.spacing.xl }}>
        {description}
      </Text>
      {children}
      {actionLabel ? <Button label={actionLabel} onPress={onAction} /> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
});
