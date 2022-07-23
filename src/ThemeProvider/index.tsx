import { cloneDeep, get, merge } from 'lodash';
import React, { useCallback, useMemo, useState } from 'react';
import { defaultSpacing } from '../helpers';
import { darkColors, lightColors } from '../helpers/colors';
import { IConfigTheme, IThemeContext, ThemeContext, ThemeMode } from './context';

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

  const currentColors = useMemo(() => {
    if (theme.mode === 'dark') {
      return theme.darkColors;
    }
    return theme.lightColors;
  }, [theme]);

  const updateColors = useCallback((theme: Omit<IConfigTheme, 'mode'>) => {
    setTheme((oldTheme) => {
      return {
        ...oldTheme,
        lightColors: merge(cloneDeep(oldTheme.lightColors), get(theme, 'lightColors', {})),
        darkColors: merge(cloneDeep(oldTheme.darkColors), get(theme, 'darkColors', {})),
      };
    });
  }, []);

  const changeTheme = useCallback((themeMode: ThemeMode) => {
    setTheme((oldTheme) => {
      return {
        ...oldTheme,
        mode: themeMode,
      };
    });
  }, []);

  const ThemeContextValue = useMemo((): IThemeContext => {
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
      updateColors: updateColors,
      changeTheme: changeTheme,
    };
  }, [theme]);

  return <ThemeContext.Provider value={ThemeContextValue}>{children}</ThemeContext.Provider>;
};