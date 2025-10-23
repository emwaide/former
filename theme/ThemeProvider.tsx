import React, { PropsWithChildren, useCallback, useMemo, useState } from 'react';
import { Appearance, useColorScheme } from 'react-native';
import { ThemeContext, resolveTokens } from './tokens';

type ThemeProviderProps = PropsWithChildren<{
  initialScheme?: 'light' | 'dark';
}>;

export const ThemeProvider = ({ children, initialScheme }: ThemeProviderProps) => {
  const systemScheme = useColorScheme();
  const derivedScheme = (initialScheme ?? systemScheme ?? 'light') as 'light' | 'dark';
  const [colorScheme, setColorSchemeState] = useState<'light' | 'dark'>(derivedScheme);

  const setColorScheme = useCallback((scheme: 'light' | 'dark') => {
    setColorSchemeState(scheme);
    Appearance.setColorScheme?.(scheme);
  }, []);

  const value = useMemo(
    () => ({
      tokens: resolveTokens(colorScheme),
      colorScheme,
      setColorScheme,
    }),
    [colorScheme, setColorScheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
