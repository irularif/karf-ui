function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import React from 'react';
import { StyleSheet } from 'react-native';
import withTheme from '../helpers/withTheme';
import { Text } from '../Text';
export const TopBarTitle = withTheme(_ref => {
  let {
    style,
    ...props
  } = _ref;
  const finalStyle = StyleSheet.flatten([styles.basic, style]);
  return /*#__PURE__*/React.createElement(Text, _extends({}, props, {
    style: finalStyle
  }));
});
const styles = StyleSheet.create({
  basic: {
    flex: 1,
    marginVertical: 8,
    marginHorizontal: 16
  }
});
TopBarTitle.displayName = 'TopBar.Title';
//# sourceMappingURL=Title.js.map