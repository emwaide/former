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
  textSubtle: string;
  accent: string;
  accentSecondary: string;
  accentTertiary: string;
  success: string;
  warning: string;
  danger: string;
  positiveSoft: string;
  cautionSoft: string;
  negativeSoft: string;
  border: string;
  mutedBorder: string;
  shadow: string;
  softShadow: string;
  gradient: [string, string];
  heroGradient: [string, string, string];
  guidanceGradient: [string, string];
  streakGradient: [string, string];
  ringGradient: [string, string];
  brandNavy: string;
  brandMid: string;
  brandLight: string;
  aquaSoft: string;
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
    contrastCard: palette.aquaSoft,
    text: palette.textPrimary,
    textSecondary: palette.textSecondary,
    textSubtle: palette.textSubtle,
    accent: palette.navy,
    accentSecondary: palette.ocean,
    accentTertiary: palette.surf,
    success: palette.successStrong,
    warning: palette.warningStrong,
    danger: palette.dangerStrong,
    positiveSoft: palette.successSoft,
    cautionSoft: palette.warnSoft,
    negativeSoft: palette.errorSoft,
    border: palette.divider,
    mutedBorder: palette.mist,
    shadow: palette.shadowSoft,
    softShadow: palette.shadowTint,
    gradient: [palette.navy, palette.ocean],
    heroGradient: [palette.deepNavy, palette.navy, palette.sand],
    guidanceGradient: [palette.contrastCard, palette.sand],
    streakGradient: [palette.navy, palette.ocean],
    ringGradient: [palette.surf, palette.sand],
    brandNavy: palette.navy,
    brandMid: palette.ocean,
    brandLight: palette.surf,
    aquaSoft: palette.mist,
  },
  spacing: {
    xs: 6,
    sm: 10,
    md: 16,
    lg: 20,
    xl: 24,
    '2xl': 32,
  },
  radius: {
    card: 16,
    input: 12,
    pill: 999,
  },
  typography: {
    fontFamily: 'Poppins_400Regular',
    fontFamilyMedium: 'Poppins_500Medium',
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
    textSubtle: 'rgba(241, 245, 249, 0.6)',
    accent: palette.surf,
    accentSecondary: palette.surf,
    accentTertiary: palette.mist,
    success: '#6EE7B7',
    warning: '#F6C97A',
    danger: '#F29E9E',
    positiveSoft: palette.successSoft,
    cautionSoft: palette.warnSoft,
    negativeSoft: palette.errorSoft,
    border: 'rgba(203, 213, 225, 0.4)',
    mutedBorder: 'rgba(203, 213, 225, 0.22)',
    shadow: 'rgba(0, 0, 0, 0.35)',
    softShadow: 'rgba(28, 78, 128, 0.35)',
    gradient: [palette.ocean, palette.surf],
    heroGradient: [palette.deepNavy, palette.navy, palette.ocean],
    guidanceGradient: ['rgba(236, 228, 214, 0.4)', 'rgba(231, 222, 208, 0.2)'],
    streakGradient: ['#031a33', '#103c66'],
    ringGradient: [palette.surf, '#F1DFC4'],
    brandNavy: palette.navy,
    brandMid: palette.ocean,
    brandLight: palette.surf,
    aquaSoft: 'rgba(213, 225, 237, 0.35)',
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
