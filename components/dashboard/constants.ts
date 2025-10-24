export const palette = {
  navy: '#03045E',
  blueMid: '#0077B6',
  blueLight: '#00B4D8',
  aquaSoft: '#90E0EF',
  skyTint: '#CAF0F8',
  successSoft: '#B6E2C4',
  warnSoft: '#F9D6B4',
  errorSoft: '#F4B6B6',
};

export const typography = {
  title: 24,
  subtitle: 16,
  body: 15,
  caption: 13,
};

export const spacing = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
};

export const cardShadow = {
  shadowColor: 'rgba(0,0,0,0.05)',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 1,
  shadowRadius: 12,
  elevation: 3,
};

export const cardBaseStyle = {
  backgroundColor: '#FFFFFF',
  borderRadius: 16,
  padding: spacing.lg,
  marginBottom: spacing.xl,
  ...cardShadow,
};
