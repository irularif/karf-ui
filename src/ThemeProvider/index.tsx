import { get, merge } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import type { IConfigTheme, ThemeMode } from '../../types/theme';
import { defaultSpacing } from '../helpers';
import { darkColors, lightColors } from '../helpers/colors';
import { getStorage, setStorage } from '../helpers/storage';
import { ThemeContext, ThemeDispatchContext } from './context';

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
    typography: get(themes, 'typography', {
      fontFamily: 'Open Sans',
      fontSize: 14,
      fontWeight: '400',
      fontStyle: 'normal',
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
    const value = await getStorage('theme');
    if (value) {
      setTheme(JSON.parse(value));
    } else {
      setStorage('theme', JSON.stringify(theme));
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
      setStorage('theme', JSON.stringify(newTheme));
    },
    [theme]
  );

  const changeTheme = useCallback(
    (themeMode: ThemeMode) => {
      const newTheme = merge({}, theme, {
        mode: themeMode,
      });

      setTheme(newTheme);
      setStorage('theme', JSON.stringify(newTheme));
    },
    [theme]
  );

  const updateTheme = useCallback(
    (_theme: Partial<IConfigTheme>) => {
      const newTheme = merge({}, theme, _theme, {
        lightColors: theme.lightColors,
        darkColors: theme.darkColors,
        mode: theme.mode,
      });

      setTheme(newTheme);
      setStorage('theme', JSON.stringify(newTheme));
    },
    [theme]
  );

  const ThemeContextValue = useMemo(() => {
    return {
      ...theme,
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

  useEffect(() => {
    updateTheme({
      ...themes,
    });
  }, [themes]);

  return (
    <ThemeDispatchContext.Provider value={ThemeDispatchContextValue}>
      <ThemeContext.Provider value={ThemeContextValue}>{children}</ThemeContext.Provider>
    </ThemeDispatchContext.Provider>
  );
};
