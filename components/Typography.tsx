import { PropsWithChildren } from 'react';
import { Text, TextProps } from 'react-native';

type TypographyProps = PropsWithChildren<{
  className?: string;
  weight?: 'regular' | 'semibold';
}> &
  TextProps;

const weightClass = {
  regular: 'font-[Poppins_400Regular]',
  semibold: 'font-[Poppins_600SemiBold]',
};

export const Heading = ({ children, className = '', weight = 'semibold', ...rest }: TypographyProps) => (
  <Text
    {...rest}
    accessibilityRole="header"
    className={`text-[20px] leading-[30px] text-charcoal ${weightClass[weight]} ${className}`}
  >
    {children}
  </Text>
);

export const Subheading = ({ children, className = '', weight = 'semibold', ...rest }: TypographyProps) => (
  <Text {...rest} className={`text-[18px] leading-[26px] text-charcoal ${weightClass[weight]} ${className}`}>
    {children}
  </Text>
);

export const Label = ({ children, className = '', weight = 'semibold', ...rest }: TypographyProps) => (
  <Text
    {...rest}
    className={`text-[13px] uppercase tracking-[1px] text-muted ${weightClass[weight]} ${className}`}
  >
    {children}
  </Text>
);

export const Body = ({ children, className = '', weight = 'regular', ...rest }: TypographyProps) => (
  <Text
    {...rest}
    className={`text-[16px] leading-[24px] text-graphite ${weightClass[weight]} ${className}`}
  >
    {children}
  </Text>
);

export const MetricNumber = ({ children, className = '', weight = 'semibold', ...rest }: TypographyProps) => (
  <Text
    {...rest}
    className={`text-[36px] leading-[40px] text-charcoal ${weightClass[weight]} ${className}`}
  >
    {children}
  </Text>
);
