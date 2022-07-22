"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TopBarLeftAction = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactNative = require("react-native");

var _withTheme = _interopRequireDefault(require("../helpers/withTheme"));

var _View = require("../View");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const TopBarLeftAction = (0, _withTheme.default)(_ref => {
  let {
    style,
    theme,
    ...props
  } = _ref;

  const finalStyle = _reactNative.StyleSheet.flatten([styles.basic, style]);

  return /*#__PURE__*/_react.default.createElement(_View.View, _extends({}, props, {
    style: finalStyle
  }));
});
exports.TopBarLeftAction = TopBarLeftAction;

const styles = _reactNative.StyleSheet.create({
  basic: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

TopBarLeftAction.displayName = 'TopBar.LeftAction';
//# sourceMappingURL=LeftAction.js.map