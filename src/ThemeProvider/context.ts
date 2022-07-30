import { createContext } from 'react';
import type { AppbarProps } from '../Appbar';
import type { TFont } from '../AppProvider/font/FontLoader';
import { lightColors, ThemeColors } from '../helpers/colors';
import { defaultSpacing, ThemeSpacing } from '../helpers/spacing';
import type { IconProps } from '../Icon';
import type { KeyboardViewProps } from '../KeyboardView';
import type { ListProps } from '../List';
import type { ModalProps } from '../Modal';
import type { PageProps } from '../Page';
import type { ScrollViewProps } from '../ScrollView';
import type { TextProps } from '../Text';
import type { TooltipProps } from '../Tooltip';
import type { ViewProps } from '../View';

export interface IStyles {
  Text: Pick<TextProps, 'style'>;
  View: Pick<ViewProps, 'style'>;
  Icon: Pick<IconProps, 'style' | 'type' | 'color' | 'size'>;
  KeyboardView: Pick<KeyboardViewProps, 'style' | 'contentContainerStyle'>;
  ScrollView: Pick<ScrollViewProps, 'style' | 'indicatorStyle' | 'contentContainerStyle'>;
  List: Pick<
    ListProps<any>,
    | 'style'
    | 'indicatorStyle'
    | 'columnWrapperStyle'
    | 'contentContainerStyle'
    | 'ListFooterComponentStyle'
    | 'ListHeaderComponentStyle'
  >;
  Modal: Pick<ModalProps, 'style'>;
  Page: Pick<PageProps, 'style'>;
  Tooltip: Pick<TooltipProps, 'style'>;
  TopBar: Pick<AppbarProps, 'style'>;
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

export interface ITheme
  extends Omit<IConfigTheme, 'lightColors' | 'darkColors' | 'font' | 'styles'> {
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
