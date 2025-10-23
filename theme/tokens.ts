import { createContext, useContext, useMemo } from 'react';
import { ColorSchemeName } from 'react-native';

export type ColorTokens = {
  background: string;
  surface: string;
  card: string;
  contrastCard: string;
  text: string;
  textSecondary: string;
  accent: string;
  accentSecondary: string;
  accentTertiary: string;
  success: string;
  warning: string;
  danger: string;
  border: string;
  mutedBorder: string;
  shadow: string;
  gradient: [string, string];
};

export type TypographyTokens = {
  fontFamily: string;
  fontFamilyAlt: string;
  heading: number;
  subheading: number;
  body: number;
  label: number;
  caption: number;
  numeric: number;
};

export type RadiusTokens = {
  card: number;
  input: number;
  pill: number;
};

export type MotionTokens = {
  durationFast: number;
  durationBase: number;
  easing: string;
  springConfig: {
    damping: number;
    stiffness: number;
    mass: number;
  };
};

export type ThemeTokens = {
  mode: 'light' | 'dark';
  colors: ColorTokens;
  spacing: Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number>;
  radius: RadiusTokens;
  typography: TypographyTokens;
  motion: MotionTokens;
};

export const lightTokens: ThemeTokens = {
  mode: 'light',
  colors: {
    background: '#F8F7F3',
    surface: '#FFFFFF',
    card: '#F3DFBF',
    contrastCard: '#07004D',
    text: '#07004D',
    textSecondary: 'rgba(7, 0, 77, 0.7)',
    accent: '#42E2B8',
    accentSecondary: '#2D82B7',
    accentTertiary: '#EB8A90',
    success: '#42E2B8',
    warning: '#EB8A90',
    danger: '#EB8A90',
    border: 'rgba(7, 0, 77, 0.12)',
    mutedBorder: 'rgba(7, 0, 77, 0.08)',
    shadow: 'rgba(7, 0, 77, 0.15)',
    gradient: ['#42E2B8', '#2D82B7'],
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    '2xl': 32,
  },
  radius: {
    card: 24,
    input: 12,
    pill: 999,
  },
  typography: {
    fontFamily: 'Poppins_400Regular',
    fontFamilyAlt: 'Poppins_600SemiBold',
    heading: 28,
    subheading: 22,
    body: 16,
    label: 13,
    caption: 11,
    numeric: 48,
  },
  motion: {
    durationFast: 180,
    durationBase: 220,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    springConfig: {
      damping: 18,
      stiffness: 180,
      mass: 1,
    },
  },
};

export const darkTokens: ThemeTokens = {
  ...lightTokens,
  mode: 'dark',
  colors: {
    background: '#050032',
    surface: '#07004D',
    card: '#1A1740',
    contrastCard: '#F3DFBF',
    text: '#F8F7F3',
    textSecondary: 'rgba(248, 247, 243, 0.7)',
    accent: '#42E2B8',
    accentSecondary: '#2D82B7',
    accentTertiary: '#EB8A90',
    success: '#42E2B8',
    warning: '#EB8A90',
    danger: '#EB8A90',
    border: 'rgba(248, 247, 243, 0.14)',
    mutedBorder: 'rgba(248, 247, 243, 0.08)',
    shadow: 'rgba(0, 0, 0, 0.4)',
    gradient: ['#2D82B7', '#07004D'],
  },
};

export const ThemeContext = createContext({
  tokens: lightTokens,
  colorScheme: 'light' as 'light' | 'dark',
  setColorScheme: (_scheme: 'light' | 'dark') => {},
});

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return ctx;
};

export const resolveTokens = (scheme: ColorSchemeName | undefined) =>
  scheme === 'dark' ? darkTokens : lightTokens;

export const useThemedStyles = <T,>(
  styleFactory: (tokens: ThemeTokens) => T,
) => {
  const { tokens } = useTheme();
  return useMemo(() => styleFactory(tokens), [styleFactory, tokens]);
};
