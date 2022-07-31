import AsyncStorage from '@react-native-async-storage/async-storage';
import { get, merge } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { defaultSpacing } from '../helpers';
import { darkColors, lightColors } from '../helpers/colors';
import { IConfigTheme, ThemeContext, ThemeDispatchContext, ThemeMode } from './context';

interface ThemeProviderProps {
  themes?: Partial<IConfigTheme>;
  children: React.ReactNode;
}

export const ThemeProvider = ({ children, themes }: ThemeProviderProps) => {
  const [theme, setTheme] = useState<IConfigTheme>({
    mode: get(themes, 'mode', 'light'),
    lightColors: merge(lightColors, get(themes, 'lightColors', {})),
    darkColors: merge(darkColors, get(themes, 'darkColors', {})),
    spacing: get(themes, 'spacing', defaultSpacing),
    font: get(themes, 'font', {
      family: 'Open Sans',
      size: 14,
      weight: '400',
    }),
    shadow: get(themes, 'shadow', {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,

      elevation: 5,
    }),
    styles: get(themes, 'styles', {}),
  });

  const getThemeFromStorage = useCallback(async () => {
    const value = await AsyncStorage.getItem('theme');
    if (value) {
      setTheme(JSON.parse(value));
    }
  }, []);

  const currentColors = useMemo(() => {
    if (theme.mode === 'dark') {
      return theme.darkColors;
    }
    return theme.lightColors;
  }, [theme]);

  const updateColors = useCallback(
    (newColors: Pick<IConfigTheme, 'lightColors' | 'darkColors'>) => {
      const newTheme = merge({}, theme, {
        lightColors: get(newColors, 'lightColors', {}),
        darkColors: get(newColors, 'darkColors', {}),
      });

      setTheme(newTheme);
      AsyncStorage.setItem('theme', JSON.stringify(newTheme));
    },
    [theme]
  );

  const changeTheme = useCallback(
    (themeMode: ThemeMode) => {
      const newTheme = merge({}, theme, {
        mode: themeMode,
      });

      setTheme(newTheme);
      AsyncStorage.setItem('theme', JSON.stringify(newTheme));
    },
    [theme]
  );

  const ThemeContextValue = useMemo(() => {
    return {
      mode: theme.mode,
      spacing: theme.spacing,
      font: Object.keys(theme.font).reduce(
        (prev: any, k: string) => ({
          ...prev,
          [`font${k.charAt(0).toUpperCase() + k.slice(1)}`]: (theme.font as any)[k],
        }),
        {}
      ),
      shadow: theme.shadow,
      styles: theme.styles,
      colors: currentColors,
    };
  }, [theme]);

  const ThemeDispatchContextValue = useMemo(() => {
    return {
      updateColors: updateColors,
      changeTheme: changeTheme,
    };
  }, [theme]);

  useEffect(() => {
    getThemeFromStorage();
  }, []);

  return (
    <ThemeDispatchContext.Provider value={ThemeDispatchContextValue}>
      <ThemeContext.Provider value={ThemeContextValue}>{children}</ThemeContext.Provider>
    </ThemeDispatchContext.Provider>
  );
};
