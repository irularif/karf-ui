"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TopBarTitle = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactNative = require("react-native");

var _withTheme = _interopRequireDefault(require("../helpers/withTheme"));

var _Text = require("../Text");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const TopBarTitle = (0, _withTheme.default)(_ref => {
  let {
    style,
    ...props
  } = _ref;

  const finalStyle = _reactNative.StyleSheet.flatten([styles.basic, style]);

  return /*#__PURE__*/_react.default.createElement(_Text.Text, _extends({}, props, {
    style: finalStyle
  }));
});
exports.TopBarTitle = TopBarTitle;

const styles = _reactNative.StyleSheet.create({
  basic: {
    flex: 1,
    marginVertical: 8,
    marginHorizontal: 16
  }
});

TopBarTitle.displayName = 'TopBar.Title';
//# sourceMappingURL=Title.js.map