import { ComponentProps } from 'react';
import { Feather } from '@expo/vector-icons';

type IconName = ComponentProps<typeof Feather>['name'];

type IconProps = {
  name: IconName;
  size?: number;
  color?: string;
  accessibilityLabel?: string;
};

export const Icon = ({ name, size = 24, color = '#4B5563', accessibilityLabel }: IconProps) => (
  <Feather accessibilityLabel={accessibilityLabel} name={name} size={size} color={color} />
);
