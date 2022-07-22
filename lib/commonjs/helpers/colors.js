"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.lightPlatformColors = exports.lightColors = exports.darkPlatformColors = exports.darkColors = void 0;

var _reactNative = require("react-native");

const lightPlatformColors = {
  primary: '#1363DF',
  secondary: '#47B5FF',
  grey: '#8F9CA9',
  searchBg: '#36414C',
  success: '#38C976',
  error: '#FE5050',
  warning: '#FFA23A'
};
exports.lightPlatformColors = lightPlatformColors;
const darkPlatformColors = {
  primary: '#47B5FF',
  secondary: '#1363DF',
  grey: '#B8C1CC',
  searchBg: '#36414C',
  success: '#38C976',
  error: '#FE5050',
  warning: '#FFA23A'
};
exports.darkPlatformColors = darkPlatformColors;
const lightColors = {
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
  divider: _reactNative.StyleSheet.hairlineWidth < 1 ? '#8F9CA9' : '#B8C1CC',
  platform: {
    ios: lightPlatformColors,
    android: lightPlatformColors,
    web: lightPlatformColors,
    default: lightPlatformColors
  }
};
exports.lightColors = lightColors;
const darkColors = {
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
  divider: _reactNative.StyleSheet.hairlineWidth < 1 ? '#8F9CA9' : '#B8C1CC',
  platform: {
    ios: darkPlatformColors,
    android: darkPlatformColors,
    web: darkPlatformColors,
    default: darkPlatformColors
  }
};
exports.darkColors = darkColors;
//# sourceMappingURL=colors.js.map