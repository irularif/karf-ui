import { StyleSheet } from 'react-native';

interface PlatformColors {
  primary: string;
  secondary: string;
  grey: string;
  searchBg: string;
  success: string;
  error: string;
  warning: string;
}

export interface ThemeColors {
  readonly primary: string;
  readonly secondary: string;
  readonly background: string;
  readonly white: string;
  readonly black: string;
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
  readonly platform: {
    ios: PlatformColors;
    android: PlatformColors;
    web: PlatformColors;
    default: PlatformColors;
  };
}

export const lightPlatformColors: PlatformColors = {
  primary: '#1363DF',
  secondary: '#47B5FF',
  grey: '#8F9CA9',
  searchBg: '#36414C',
  success: '#38C976',
  error: '#FE5050',
  warning: '#FFA23A',
}

export const darkPlatformColors: PlatformColors = {
  primary: '#47B5FF',
  secondary: '#1363DF',
  grey: '#B8C1CC',
  searchBg: '#36414C',
  success: '#38C976',
  error: '#FE5050',
  warning: '#FFA23A',
}

export const lightColors: ThemeColors = {
  primary: '#1363DF',
  secondary: '#47B5FF',
  background: '#ffffff',
  white: '#ffffff',
  black: '#242424',
  grey100: '#EEF2F6',
  grey200: '#E7ECF2',
  grey300: '#D5DDE5',
  grey400: '#B8C1CC',
  grey500: '#ADB9C7',
  grey600: '#8F9CA9',
  grey700: '#66737F',
  grey800: '#36414C',
  grey900: '#272D37',
  greyOutline: '#B8C1CC',
  searchBg: '#36414C',
  success: '#38C976',
  error: '#FE5050',
  warning: '#FFA23A',
  disabled: '#B8C1CC',
  divider: StyleSheet.hairlineWidth < 1 ? '#8F9CA9' : '#B8C1CC',
  platform: {
    ios: lightPlatformColors,
    android: lightPlatformColors,
    web: lightPlatformColors,
    default: lightPlatformColors,
  },
};

export const darkColors: ThemeColors = {
  primary: '#1363DF',
  secondary: '#47B5FF',
  background: '#080808',
  white: '#080808',
  black: '#EEF2F6',
  grey900: '#EEF2F6',
  grey800: '#E7ECF2',
  grey700: '#D5DDE5',
  grey600: '#B8C1CC',
  grey500: '#ADB9C7',
  grey400: '#8F9CA9',
  grey300: '#66737F',
  grey200: '#36414C',
  grey100: '#272D37',
  greyOutline: '#B8C1CC',
  searchBg: '#36414C',
  success: '#38C976',
  error: '#FE5050',
  warning: '#FFA23A',
  disabled: '#B8C1CC',
  divider: StyleSheet.hairlineWidth < 1 ? '#8F9CA9' : '#B8C1CC',
  platform: {
      ios: darkPlatformColors,
      android: darkPlatformColors,
      web: darkPlatformColors,
      default: darkPlatformColors,
  },
};
