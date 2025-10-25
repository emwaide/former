import { PropsWithChildren, createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Appearance, useColorScheme as useSystemColorScheme } from 'react-native';
import { colorScheme as nativewindColorScheme } from 'nativewind';

type ThemeContextValue = {
  colorScheme: 'light' | 'dark';
  setColorScheme: (scheme: 'light' | 'dark') => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  colorScheme: 'light',
  setColorScheme: () => {},
});

type ThemeProviderProps = PropsWithChildren<{
  initialScheme?: 'light' | 'dark';
}>;

export const ThemeProvider = ({ children, initialScheme }: ThemeProviderProps) => {
  const systemScheme = useSystemColorScheme();
  const derivedScheme = (initialScheme ?? systemScheme ?? 'light') as 'light' | 'dark';
  const [colorScheme, setColorSchemeState] = useState<'light' | 'dark'>(derivedScheme);

  useEffect(() => {
    nativewindColorScheme.set(colorScheme);
  }, [colorScheme]);

  useEffect(() => {
    if (systemScheme) {
      nativewindColorScheme.set(systemScheme as 'light' | 'dark');
      setColorSchemeState(systemScheme as 'light' | 'dark');
    }
  }, [systemScheme]);

  const setColorScheme = useCallback((scheme: 'light' | 'dark') => {
    setColorSchemeState(scheme);
    nativewindColorScheme.set(scheme);
    Appearance.setColorScheme?.(scheme);
  }, []);

  const value = useMemo(
    () => ({
      colorScheme,
      setColorScheme,
    }),
    [colorScheme, setColorScheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
