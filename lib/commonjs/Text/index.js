"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Text = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactNative = require("react-native");

var _style = require("../helpers/style");

var _withTheme = _interopRequireDefault(require("../helpers/withTheme"));

var _screen = _interopRequireDefault(require("../hooks/screen"));

var _context = require("../ThemeProvider/context");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const Text = (0, _withTheme.default)(_ref => {
  let {
    children,
    heading,
    style,
    theme = _context.defaultTheme,
    ...props
  } = _ref;
  const {
    select
  } = (0, _screen.default)();
  const responsive = select(props);
  const finalStyle = (0, _style.parseStyle)([{
    color: theme.colors.black
  }, styles.basic, theme.font, theme.style, !!heading && styles[heading], style, responsive === null || responsive === void 0 ? void 0 : responsive.style]);
  return /*#__PURE__*/_react.default.createElement(_reactNative.Text, _extends({}, props, {
    accessibilityRole: "text",
    style: finalStyle
  }), children);
});
exports.Text = Text;

const styles = _reactNative.StyleSheet.create({
  basic: {
    fontSize: 16
  },
  h6: {
    fontSize: 18,
    fontWeight: '700'
  },
  h5: {
    fontSize: 20,
    fontWeight: '700'
  },
  h4: {
    fontSize: 25,
    fontWeight: '700'
  },
  h3: {
    fontSize: 31,
    fontWeight: '700'
  },
  h2: {
    fontSize: 40,
    fontWeight: '700'
  },
  h1: {
    fontSize: 48,
    fontWeight: '700'
  }
});
//# sourceMappingURL=index.js.map