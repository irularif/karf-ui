"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Icon = void 0;

var _lodash = require("lodash");

var _react = _interopRequireDefault(require("react"));

var _reactNative = require("react-native");

var _icon = require("../helpers/icon");

var _withTheme = _interopRequireDefault(require("../helpers/withTheme"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const Icon = (0, _withTheme.default)(_ref => {
  var _theme$font, _theme$colors;

  let {
    type,
    name,
    solid,
    brand,
    style,
    theme,
    ...props
  } = _ref;
  const size = (0, _lodash.get)(props, 'size', theme === null || theme === void 0 ? void 0 : (_theme$font = theme.font) === null || _theme$font === void 0 ? void 0 : _theme$font.fontSize);
  const color = (0, _lodash.get)(props, 'color', theme === null || theme === void 0 ? void 0 : (_theme$colors = theme.colors) === null || _theme$colors === void 0 ? void 0 : _theme$colors.black);
  const IconComponent = (0, _icon.getIconType)(type);
  const iconSpecificStyle = (0, _icon.getIconStyle)(type, {
    solid,
    brand
  });

  const finalStyle = _reactNative.StyleSheet.flatten([styles.basic, theme === null || theme === void 0 ? void 0 : theme.style, style]);

  console.log(IconComponent);
  return /*#__PURE__*/_react.default.createElement(IconComponent, _extends({
    name: name,
    size: size,
    color: color
  }, iconSpecificStyle, {
    style: finalStyle
  }));
});
exports.Icon = Icon;

const styles = _reactNative.StyleSheet.create({
  basic: {
    padding: 4
  }
});
//# sourceMappingURL=index.js.map