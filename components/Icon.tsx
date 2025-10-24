import { ComponentProps } from 'react';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../theme';

export type IconName = ComponentProps<typeof Feather>['name'];

type IconProps = {
  name: IconName;
  size?: number;
  color?: string;
  accessibilityLabel?: string;
};

export const Icon = ({ name, size = 24, color, accessibilityLabel }: IconProps) => {
  const { tokens } = useTheme();
  return <Feather accessibilityLabel={accessibilityLabel} name={name} size={size} color={color ?? tokens.colors.textSecondary} />;
};
