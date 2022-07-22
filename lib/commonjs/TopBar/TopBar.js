"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TopBarBase = void 0;

var _lodash = require("lodash");

var _react = _interopRequireWildcard(require("react"));

var _reactNative = require("react-native");

var _reactNativeSafeAreaContext = require("react-native-safe-area-context");

var _helpers = require("../helpers");

var _withTheme = _interopRequireDefault(require("../helpers/withTheme"));

var _View = require("../View");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const TopBarBase = (0, _withTheme.default)(_ref => {
  var _theme$colors;

  let {
    children,
    style,
    theme,
    disableShadow = false,
    ...props
  } = _ref;
  const inset = (0, _reactNativeSafeAreaContext.useSafeAreaInsets)();

  const mergeStyle = _reactNative.StyleSheet.flatten([styles.basic, !disableShadow && (theme === null || theme === void 0 ? void 0 : theme.shadow), style]);

  const finalStyle = _reactNative.StyleSheet.flatten([mergeStyle, {
    backgroundColor: theme === null || theme === void 0 ? void 0 : (_theme$colors = theme.colors) === null || _theme$colors === void 0 ? void 0 : _theme$colors.background,
    paddingTop: inset.top + ((0, _helpers.getStyleValue)(mergeStyle, ['padding', 'paddingVertical', 'paddingTop']) || 0)
  }]);

  return /*#__PURE__*/_react.default.createElement(_View.View, _extends({}, props, {
    style: finalStyle
  }), _react.Children.toArray(children).sort((elA, elB) => {
    const el = ['TopBar.LeftAction', 'TopBar.Title', 'TopBar.RightAction'];
    const nameA = (0, _lodash.get)(elA, 'type.displayName', (0, _lodash.get)(elA, 'type.name', ''));
    const nameB = (0, _lodash.get)(elB, 'type.displayName', (0, _lodash.get)(elB, 'type.name', ''));

    if (el.indexOf(nameA) < el.indexOf(nameB)) {
      return -1;
    }

    if (el.indexOf(nameA) > el.indexOf(nameB)) {
      return 1;
    }

    return 0;
  }));
});
exports.TopBarBase = TopBarBase;

const styles = _reactNative.StyleSheet.create({
  basic: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

TopBarBase.displayName = 'TopBar';
//# sourceMappingURL=TopBar.js.map