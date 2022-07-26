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
  readonly platform: {
    ios: PlatformColors;
    android: PlatformColors;
    web: PlatformColors;
    default: PlatformColors;
  };
}

export const lightPlatformColors: PlatformColors = {
  primary: '#47B5FF',
  secondary: '#1363DF',
  grey: '#d4d4d4',
  searchBg: '#404040',
  success: '#38C976',
  error: '#FE5050',
  warning: '#FFA23A',
};

export const darkPlatformColors: PlatformColors = {
  primary: '#47B5FF',
  secondary: '#1363DF',
  grey: '#d4d4d4',
  searchBg: '#404040',
  success: '#38C976',
  error: '#FE5050',
  warning: '#FFA23A',
};

export const lightColors: ThemeColors = {
  primary: '#47B5FF',
  secondary: '#1363DF',
  background: '#ffffff',
  white: '#ffffff',
  black: '#242424',
  grey50: '#fafafa',
  grey100: '#f5f5f5',
  grey200: '#e5e5e5',
  grey300: '#d4d4d4',
  grey400: '#a3a3a3',
  grey500: '#737373',
  grey600: '#525252',
  grey700: '#404040',
  grey800: '#262626',
  grey900: '#171717',
  greyOutline: '#d4d4d4',
  searchBg: '#404040',
  success: '#38C976',
  error: '#FE5050',
  warning: '#FFA23A',
  disabled: '#a3a3a3',
  divider: StyleSheet.hairlineWidth < 1 ? '#a3a3a3' : '#d4d4d4',
  platform: {
    ios: lightPlatformColors,
    android: lightPlatformColors,
    web: lightPlatformColors,
    default: lightPlatformColors,
  },
};

export const darkColors: ThemeColors = {
  primary: '#47B5FF',
  secondary: '#1363DF',
  background: '#080808',
  white: '#080808',
  black: '#EEF2F6',
  grey900: '#fafafa',
  grey800: '#f5f5f5',
  grey700: '#e5e5e5',
  grey600: '#d4d4d4',
  grey500: '#a3a3a3',
  grey400: '#737373',
  grey300: '#525252',
  grey200: '#404040',
  grey100: '#262626',
  grey50: '#171717',
  greyOutline: '#d4d4d4',
  searchBg: '#404040',
  success: '#38C976',
  error: '#FE5050',
  warning: '#FFA23A',
  disabled: '#a3a3a3',
  divider: StyleSheet.hairlineWidth < 1 ? '#a3a3a3' : '#d4d4d4',
  platform: {
    ios: darkPlatformColors,
    android: darkPlatformColors,
    web: darkPlatformColors,
    default: darkPlatformColors,
  },
};
