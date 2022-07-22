function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import { get } from 'lodash';
import React, { Children } from 'react';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getStyleValue } from '../helpers';
import withTheme from '../helpers/withTheme';
import { View } from '../View';
export const TopBarBase = withTheme(_ref => {
  var _theme$colors;

  let {
    children,
    style,
    theme,
    disableShadow = false,
    ...props
  } = _ref;
  const inset = useSafeAreaInsets();
  const mergeStyle = StyleSheet.flatten([styles.basic, !disableShadow && (theme === null || theme === void 0 ? void 0 : theme.shadow), style]);
  const finalStyle = StyleSheet.flatten([mergeStyle, {
    backgroundColor: theme === null || theme === void 0 ? void 0 : (_theme$colors = theme.colors) === null || _theme$colors === void 0 ? void 0 : _theme$colors.background,
    paddingTop: inset.top + (getStyleValue(mergeStyle, ['padding', 'paddingVertical', 'paddingTop']) || 0)
  }]);
  return /*#__PURE__*/React.createElement(View, _extends({}, props, {
    style: finalStyle
  }), Children.toArray(children).sort((elA, elB) => {
    const el = ['TopBar.LeftAction', 'TopBar.Title', 'TopBar.RightAction'];
    const nameA = get(elA, 'type.displayName', get(elA, 'type.name', ''));
    const nameB = get(elB, 'type.displayName', get(elB, 'type.name', ''));

    if (el.indexOf(nameA) < el.indexOf(nameB)) {
      return -1;
    }

    if (el.indexOf(nameA) > el.indexOf(nameB)) {
      return 1;
    }

    return 0;
  }));
});
const styles = StyleSheet.create({
  basic: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
TopBarBase.displayName = 'TopBar';
//# sourceMappingURL=TopBar.js.map