import { createContext, useContext, useMemo } from 'react';
import { ColorSchemeName } from 'react-native';
import { beachCalmColors } from './colors';
import { beachCalmTypography } from './typography';

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
  softShadow: string;
  gradient: [string, string];
};

export type TypographyTokens = {
  fontFamily: string;
  fontFamilyMedium: string;
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

const palette = beachCalmColors;
const typographyScale = beachCalmTypography;

export const lightTokens: ThemeTokens = {
  mode: 'light',
  colors: {
    background: palette.background,
    surface: palette.card,
    card: palette.card,
    contrastCard: '#E6F1FA',
    text: palette.textPrimary,
    textSecondary: palette.textSecondary,
    accent: palette.primary,
    accentSecondary: palette.primaryDeep,
    accentTertiary: palette.seafoam,
    success: palette.success,
    warning: palette.warning,
    danger: palette.error,
    border: palette.divider,
    mutedBorder: '#EEF2F6',
    shadow: palette.shadowSoft,
    softShadow: palette.shadowTint,
    gradient: [palette.primaryDeep, palette.primary],
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
    card: 16,
    input: 12,
    pill: 999,
  },
  typography: {
    fontFamily: 'Inter_400Regular',
    fontFamilyMedium: 'Inter_500Medium',
    fontFamilyAlt: 'Poppins_600SemiBold',
    heading: typographyScale.heading.fontSize,
    subheading: typographyScale.subheading.fontSize,
    body: typographyScale.body.fontSize,
    label: typographyScale.body.fontSize,
    caption: typographyScale.caption.fontSize,
    numeric: 32,
  },
  motion: {
    durationFast: 180,
    durationBase: 240,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    springConfig: {
      damping: 20,
      stiffness: 180,
      mass: 1,
    },
  },
};

export const darkTokens: ThemeTokens = {
  ...lightTokens,
  mode: 'dark',
  colors: {
    background: '#0B1D2C',
    surface: '#132A3F',
    card: '#132A3F',
    contrastCard: '#1F3D58',
    text: '#F1F5F9',
    textSecondary: 'rgba(241, 245, 249, 0.72)',
    accent: palette.primary,
    accentSecondary: palette.primary,
    accentTertiary: palette.seafoam,
    success: palette.success,
    warning: palette.warning,
    danger: palette.error,
    border: 'rgba(148, 163, 184, 0.28)',
    mutedBorder: 'rgba(148, 163, 184, 0.18)',
    shadow: 'rgba(0, 0, 0, 0.35)',
    softShadow: 'rgba(34, 87, 122, 0.35)',
    gradient: [palette.primaryDeep, palette.primary],
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
