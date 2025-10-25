import { PropsWithChildren } from 'react';
import { Text, View } from 'react-native';
import { Button } from './Button';

type EmptyStateProps = PropsWithChildren<{
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}>;

export const EmptyState = ({ title, description, actionLabel, onAction, children }: EmptyStateProps) => (
  <View className="w-full items-center justify-center gap-4 p-10">
    <Text className="mb-2 text-[18px] font-[Poppins_600SemiBold] text-charcoal">{title}</Text>
    <Text className="mb-6 text-center text-[16px] font-[Poppins_400Regular] leading-relaxed text-graphite">
      {description}
    </Text>
    {children}
    {actionLabel ? <Button label={actionLabel} onPress={onAction} /> : null}
  </View>
);
