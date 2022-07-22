"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Page = void 0;

var _native = require("@react-navigation/native");

var _lodash = require("lodash");

var _react = _interopRequireWildcard(require("react"));

var _reactNative = require("react-native");

var _style = require("../helpers/style");

var _withTheme = _interopRequireDefault(require("../helpers/withTheme"));

var _theme = _interopRequireDefault(require("../hooks/theme"));

var _context = require("../ThemeProvider/context");

var _View = require("../View");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const Page = (0, _withTheme.default)(_ref => {
  let {
    style,
    theme = _context.defaultTheme,
    statusBar,
    ...props
  } = _ref;
  const {
    selectTheme
  } = (0, _theme.default)();
  const finalStyle = (0, _style.parseStyle)([{
    backgroundColor: theme.colors.background
  }, styles.basic, theme.style, style]);
  const finalStatusBar = (0, _lodash.merge)({
    translucent: true,
    barStyle: selectTheme({
      light: 'dark-content',
      dark: 'light-content'
    }),
    backgroundColor: 'transparent'
  }, statusBar);
  (0, _native.useFocusEffect)((0, _react.useCallback)(() => {
    _reactNative.StatusBar.setBarStyle(finalStatusBar.barStyle);
  }, []));
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_reactNative.StatusBar, finalStatusBar), /*#__PURE__*/_react.default.createElement(_View.View, _extends({}, props, {
    style: finalStyle
  })));
});
exports.Page = Page;

const styles = _reactNative.StyleSheet.create({
  basic: {
    flexGrow: 1,
    flexShrink: 1
  }
});
//# sourceMappingURL=index.js.map