import { PropsWithChildren } from 'react';
import { StyleProp, Text, TextProps, TextStyle } from 'react-native';
import { useTheme } from '../theme';

type TypographyProps = PropsWithChildren<{
  style?: StyleProp<TextStyle>;
  color?: string;
  weight?: 'regular' | 'semibold';
}> & TextProps;

export const Heading = ({ children, style, color, weight = 'semibold', ...rest }: TypographyProps) => {
  const { tokens } = useTheme();
  return (
    <Text
      {...rest}
      accessibilityRole="header"
      style={[
        {
          fontSize: tokens.typography.heading,
          color: color ?? tokens.colors.text,
          fontFamily: weight === 'semibold' ? tokens.typography.fontFamilyAlt : tokens.typography.fontFamily,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
};

export const Subheading = ({ children, style, color, weight = 'semibold', ...rest }: TypographyProps) => {
  const { tokens } = useTheme();
  return (
    <Text
      {...rest}
      style={[
        {
          fontSize: tokens.typography.subheading,
          color: color ?? tokens.colors.text,
          fontFamily: weight === 'semibold' ? tokens.typography.fontFamilyAlt : tokens.typography.fontFamily,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
};

export const Label = ({ children, style, color, weight = 'semibold', ...rest }: TypographyProps) => {
  const { tokens } = useTheme();
  return (
    <Text
      {...rest}
      style={[
        {
          fontSize: tokens.typography.label,
          textTransform: 'uppercase',
          letterSpacing: 1.1,
          color: color ?? tokens.colors.textSecondary,
          fontFamily: weight === 'semibold' ? tokens.typography.fontFamilyAlt : tokens.typography.fontFamily,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
};

export const Body = ({ children, style, color, weight = 'regular', ...rest }: TypographyProps) => {
  const { tokens } = useTheme();
  return (
    <Text
      {...rest}
      style={[
        {
          fontSize: tokens.typography.body,
          color: color ?? tokens.colors.textSecondary,
          fontFamily: weight === 'semibold' ? tokens.typography.fontFamilyAlt : tokens.typography.fontFamily,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
};

export const MetricNumber = ({ children, style, color, weight = 'semibold', ...rest }: TypographyProps) => {
  const { tokens } = useTheme();
  return (
    <Text
      {...rest}
      accessibilityRole="text"
      style={[
        {
          fontSize: tokens.typography.numeric,
          color: color ?? tokens.colors.text,
          fontFamily: weight === 'semibold' ? tokens.typography.fontFamilyAlt : tokens.typography.fontFamily,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
};
