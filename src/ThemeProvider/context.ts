import { createContext } from 'react';
import type { IThemeContext, IThemeDispatchContext } from '../../types/theme';
import { lightColors } from '../helpers/colors';
import { defaultSpacing } from '../helpers/spacing';

export const defaultTheme: IThemeContext = {
  mode: 'light',
  colors: lightColors,
  spacing: defaultSpacing,
  typography: {
    fontFamily: 'Open Sans',
    fontSize: 14,
    fontWeight: '400',
    fontStyle: 'normal',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  styles: {},
};

export const ThemeContext = createContext<IThemeContext>(defaultTheme);
export const ThemeDispatchContext = createContext<IThemeDispatchContext>({
  updateColors: () => {},
  changeTheme: () => {},
});
