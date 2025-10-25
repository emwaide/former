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
    contrastCard: palette.contrastCard,
    text: palette.textPrimary,
    textSecondary: palette.textSecondary,
    textSubtle: palette.textSubtle,
    accent: palette.navy,
    accentSecondary: palette.blueMid,
    accentTertiary: palette.aqua,
    success: palette.successStrong,
    warning: palette.warningStrong,
    danger: palette.dangerStrong,
    positiveSoft: palette.successSoft,
    cautionSoft: palette.warnSoft,
    negativeSoft: palette.errorSoft,
    border: palette.divider,
    mutedBorder: palette.skyTint,
    shadow: palette.shadowSoft,
    softShadow: palette.shadowTint,
    gradient: [palette.navy, palette.blueMid],
    heroGradient: [palette.navy, palette.blueMid, palette.blueLight],
    guidanceGradient: [palette.aquaSoft, palette.skyTint],
    streakGradient: [palette.navy, palette.blueMid],
    ringGradient: [palette.blueLight, palette.aqua],
    brandNavy: palette.navy,
    brandMid: palette.blueMid,
    brandLight: palette.blueLight,
    aquaSoft: palette.aquaSoft,
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
    background: '#061626',
    surface: '#0E2538',
    card: '#0E2538',
    contrastCard: '#163447',
    text: '#EDF6FF',
    textSecondary: 'rgba(237, 246, 255, 0.72)',
    textSubtle: 'rgba(237, 246, 255, 0.6)',
    accent: palette.aqua,
    accentSecondary: palette.blueLight,
    accentTertiary: palette.aquaSoft,
    success: '#66E3BA',
    warning: '#F6C97A',
    danger: '#F29E9E',
    positiveSoft: palette.successSoft,
    cautionSoft: palette.warnSoft,
    negativeSoft: palette.errorSoft,
    border: 'rgba(202, 226, 240, 0.32)',
    mutedBorder: 'rgba(202, 226, 240, 0.18)',
    shadow: 'rgba(0, 0, 0, 0.35)',
    softShadow: 'rgba(3, 42, 74, 0.35)',
    gradient: [palette.tide, palette.teal],
    heroGradient: [palette.navyDeep, palette.navy, palette.blueMid],
    guidanceGradient: ['rgba(144, 224, 239, 0.25)', 'rgba(3, 4, 94, 0.25)'],
    streakGradient: ['#0F2F63', '#1B4D9E'],
    ringGradient: [palette.blueLight, '#5FD4F6'],
    brandNavy: palette.navy,
    brandMid: palette.blueMid,
    brandLight: palette.blueLight,
    aquaSoft: 'rgba(144, 224, 239, 0.25)',
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
