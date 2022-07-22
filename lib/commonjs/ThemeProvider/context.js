"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultTheme = exports.ThemeContext = void 0;

var _react = require("react");

var _colors = require("../helpers/colors");

var _spacing = require("../helpers/spacing");

const defaultTheme = {
  mode: 'light',
  colors: _colors.lightColors,
  spacing: _spacing.defaultSpacing,
  font: {
    fontFamily: 'Open Sans',
    fontSize: 14,
    fontWeight: '400',
    fontStyle: 'normal'
  },
  style: {}
};
exports.defaultTheme = defaultTheme;
const ThemeContext = /*#__PURE__*/(0, _react.createContext)(undefined);
exports.ThemeContext = ThemeContext;
//# sourceMappingURL=context.js.map