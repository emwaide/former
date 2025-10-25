import { PropsWithChildren } from 'react';
import { View } from 'react-native';

type Spacing = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

type StackProps = PropsWithChildren<{
  spacing?: Spacing;
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around';
  wrap?: boolean;
  className?: string;
}>;

const spacingClass: Record<Spacing, string> = {
  xs: 'gap-2',
  sm: 'gap-3',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
  '2xl': 'gap-10',
};

const alignClass: Record<NonNullable<StackProps['align']>, string> = {
  'flex-start': 'items-start',
  center: 'items-center',
  'flex-end': 'items-end',
  stretch: 'items-stretch',
};

const justifyClass: Record<NonNullable<StackProps['justify']>, string> = {
  'flex-start': 'justify-start',
  center: 'justify-center',
  'flex-end': 'justify-end',
  'space-between': 'justify-between',
  'space-around': 'justify-around',
};

export const HStack = ({
  spacing = 'md',
  align = 'center',
  justify = 'flex-start',
  wrap = false,
  className = '',
  children,
}: StackProps) => (
  <View
    className={`w-full flex-row ${spacingClass[spacing]} ${alignClass[align]} ${justifyClass[justify]} ${
      wrap ? 'flex-wrap' : 'flex-nowrap'
    } ${className}`}
  >
    {children}
  </View>
);

export const VStack = ({
  spacing = 'md',
  align = 'stretch',
  justify = 'flex-start',
  className = '',
  children,
}: StackProps) => (
  <View
    className={`w-full flex-col ${spacingClass[spacing]} ${alignClass[align]} ${justifyClass[justify]} ${className}`}
  >
    {children}
  </View>
);

export const Spacer = () => <View className="flex-1" />;
