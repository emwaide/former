import { PropsWithChildren, createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Appearance, useColorScheme as useSystemColorScheme } from 'react-native';
import { NativeWindStyleSheet } from 'nativewind';

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

NativeWindStyleSheet.setOutput({ default: 'native' });

export const ThemeProvider = ({ children, initialScheme }: ThemeProviderProps) => {
  const systemScheme = useSystemColorScheme();
  const derivedScheme = (initialScheme ?? systemScheme ?? 'light') as 'light' | 'dark';
  const [colorScheme, setColorSchemeState] = useState<'light' | 'dark'>(derivedScheme);

  useEffect(() => {
    NativeWindStyleSheet.setColorScheme(colorScheme);
  }, [colorScheme]);

  useEffect(() => {
    if (systemScheme) {
      NativeWindStyleSheet.setColorScheme(systemScheme as 'light' | 'dark');
      setColorSchemeState(systemScheme as 'light' | 'dark');
    }
  }, [systemScheme]);

  const setColorScheme = useCallback((scheme: 'light' | 'dark') => {
    setColorSchemeState(scheme);
    NativeWindStyleSheet.setColorScheme(scheme);
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
