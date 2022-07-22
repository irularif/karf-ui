import { createContext } from 'react';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import type { TFont } from '../AppProvider/font/FontLoader';
import { lightColors, ThemeColors } from '../helpers/colors';
import { defaultSpacing, ThemeSpacing } from '../helpers/spacing';

export interface IStyles {
  Text: StyleProp<TextStyle>;
  View: StyleProp<ViewStyle>;
  Icon: StyleProp<ViewStyle>;
}

export type ThemeMode = 'light' | 'dark';

export interface IConfigTheme {
  mode: ThemeMode;
  lightColors: ThemeColors;
  darkColors: ThemeColors;
  spacing: ThemeSpacing;
  font: Partial<
    Omit<TFont, 'source' | 'name'> & {
      family: string;
      size: number;
      color: string;
    }
  >;
  shadow?: {
    shadowColor: string;
    shadowOffset: {
      width: number;
      height: number;
    };
    shadowOpacity: number;
    shadowRadius: number;
    elevation: number;
  };
  styles?: Partial<IStyles>;
}

export interface ITheme extends Omit<IConfigTheme, 'lightColors' | 'darkColors' | 'font' | 'styles'> {
  style: IStyles[keyof IStyles];
  colors: ThemeColors;
  font: {
    fontFamily: string;
    fontSize: number;
    fontWeight: string;
    fontStyle: string;
  };
}

export const defaultTheme: ITheme = {
  mode: 'light',
  colors: lightColors,
  spacing: defaultSpacing,
  font: {
    fontFamily: 'Open Sans',
    fontSize: 14,
    fontWeight: '400',
    fontStyle: 'normal',
  },
  style: {},
};

export interface IThemeContext extends Omit<IConfigTheme, 'lightColors' | 'darkColors'> {
  colors: ThemeColors;
  updateColors: (theme: Omit<IConfigTheme, 'mode'>) => void;
  changeTheme: (themeMode: ThemeMode) => void;
}

export const ThemeContext = createContext<IThemeContext | undefined>(undefined);
