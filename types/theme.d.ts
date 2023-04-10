import type {
  AppbarLeftActionProps,
  AppbarProps,
  AppbarRightActionProps,
  AppbarTitleProps,
  BlurViewProps,
  ButtonIconProps,
  ButtonLabelProps,
  ButtonProps,
  IconProps,
  KeyboardViewProps,
  ListProps,
  ModalProps,
  PageProps,
  ScrollViewProps,
  TextProps,
  ThemeColors,
  ThemeMode,
  TooltipProps,
  ViewProps
} from '../src';

export type ThemeMode = 'light' | 'dark';

export interface ThemeColors {
  readonly primary: string;
  readonly secondary: string;
  readonly background: string;
  readonly white: string;
  readonly black: string;
  readonly grey50: string;
  readonly grey100: string;
  readonly grey200: string;
  readonly grey300: string;
  readonly grey400: string;
  readonly grey500: string;
  readonly grey600: string;
  readonly grey700: string;
  readonly grey800: string;
  readonly grey900: string;
  readonly greyOutline: string;
  readonly searchBg: string;
  readonly success: string;
  readonly warning: string;
  readonly error: string;
  readonly disabled: string;
  readonly divider: string;
  readonly [key: string & {}]: string;
}

export type ThemeSpacing = Record<TDevice, number>;

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
    | 'contentContainerStyle'
    | 'ListFooterComponentStyle'
    | 'ListHeaderComponentStyle'
  >;
  Modal: Pick<ModalProps, 'style'>;
  Page: Pick<PageProps, 'style'>;
  Tooltip: Pick<TooltipProps, 'style'>;
  Appbar: Pick<AppbarProps, 'style'>;
  'Appbar.Title': Pick<AppbarTitleProps, 'style'>;
  'Appbar.LeftAction': Pick<AppbarLeftActionProps, 'style'>;
  'Appbar.RightAction': Pick<AppbarRightActionProps, 'style'>;
  Button: Pick<ButtonProps, 'style'>;
  'Button.Label': Pick<ButtonLabelProps, 'style'>;
  'Button.LeftIcon': Pick<ButtonIconProps, 'style' | 'type' | 'color' | 'size'>;
  'Button.RightIcon': Pick<ButtonIconProps, 'style' | 'type' | 'color' | 'size'>;
  ButtonIcon: Pick<ButtonIconProps, 'style' | 'type' | 'color' | 'size'>;
  BlurView: Pick<BlurViewProps, 'style'>;
}

export interface IConfigTheme {
  mode: ThemeMode;
  lightColors: ThemeColors;
  darkColors: ThemeColors;
  spacing: ThemeSpacing;
  typography: Partial<{
    fontFamily: string;
    fontSize: number;
    fontWeight: string;
    fontStyle: string;
    color: string;
  }>;
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
  typography: {
    fontFamily: string;
    fontSize: number;
    fontWeight: string;
    fontStyle: string;
    color: string;
  };
}

export interface IThemeContext extends Omit<IConfigTheme, 'lightColors' | 'darkColors'> {
  colors: ThemeColors;
}

export interface IThemeDispatchContext {
  updateColors: (theme: Omit<IConfigTheme, 'mode'>) => void;
  changeTheme: (themeMode: ThemeMode) => void;
}
