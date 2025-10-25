import { ComponentProps } from 'react';
import { Feather } from '@expo/vector-icons';

import { getColor } from '../utils/colors';

type IconName = ComponentProps<typeof Feather>['name'];

type IconProps = {
  name: IconName;
  size?: number;
  color?: string;
  accessibilityLabel?: string;
};

export const Icon = ({ name, size = 24, color, accessibilityLabel }: IconProps) => (
  <Feather accessibilityLabel={accessibilityLabel} name={name} size={size} color={color ?? getColor('graphite')} />
);
