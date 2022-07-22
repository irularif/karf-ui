"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.View = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactNative = require("react-native");

var _renderNode = _interopRequireDefault(require("../helpers/renderNode"));

var _style = require("../helpers/style");

var _withTheme = _interopRequireDefault(require("../helpers/withTheme"));

var _screen = _interopRequireDefault(require("../hooks/screen"));

var _Text = require("../Text");

var _context = require("../ThemeProvider/context");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const View = (0, _withTheme.default)(_ref => {
  let {
    children,
    style,
    theme = _context.defaultTheme,
    ...props
  } = _ref;
  const {
    select
  } = (0, _screen.default)();
  const responsive = select(props);
  const finalStyle = (0, _style.parseStyle)([theme.style, style, responsive === null || responsive === void 0 ? void 0 : responsive.style]);
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, _extends({}, props, {
    style: finalStyle
  }), _react.default.Children.toArray(children).map((child, index) => /*#__PURE__*/_react.default.createElement(_react.default.Fragment, {
    key: index
  }, typeof child === 'string' ? (0, _renderNode.default)(_Text.Text, child) : child)));
});
exports.View = View;
//# sourceMappingURL=index.js.map