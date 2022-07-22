"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initialScreen = exports.ScreenContext = exports.Device = void 0;

var _react = require("react");

var _reactNative = require("react-native");

var _responsive = require("../helpers/responsive");

const screen = _reactNative.Dimensions.get('screen');

const {
  width: screenWidth,
  height: screenHeight
} = screen;
const Device = ['xs', 'sm', 'md', 'lg', 'xl'];
exports.Device = Device;
const initialScreen = {
  orientation: screenHeight >= screenWidth ? 'LANDSCAPE' : 'PORTRAIT',
  size: (0, _responsive.getSize)(screen),
  scaleSize: screen
};
exports.initialScreen = initialScreen;
const ScreenContext = /*#__PURE__*/(0, _react.createContext)(undefined);
exports.ScreenContext = ScreenContext;
//# sourceMappingURL=context.js.map