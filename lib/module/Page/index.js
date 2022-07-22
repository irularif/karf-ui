function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import { useFocusEffect } from '@react-navigation/native';
import { merge } from 'lodash';
import React, { useCallback } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { parseStyle } from '../helpers/style';
import withTheme from '../helpers/withTheme';
import useTheme from '../hooks/theme';
import { defaultTheme } from '../ThemeProvider/context';
import { View } from '../View';
export const Page = withTheme(_ref => {
  let {
    style,
    theme = defaultTheme,
    statusBar,
    ...props
  } = _ref;
  const {
    selectTheme
  } = useTheme();
  const finalStyle = parseStyle([{
    backgroundColor: theme.colors.background
  }, styles.basic, theme.style, style]);
  const finalStatusBar = merge({
    translucent: true,
    barStyle: selectTheme({
      light: 'dark-content',
      dark: 'light-content'
    }),
    backgroundColor: 'transparent'
  }, statusBar);
  useFocusEffect(useCallback(() => {
    StatusBar.setBarStyle(finalStatusBar.barStyle);
  }, []));
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(StatusBar, finalStatusBar), /*#__PURE__*/React.createElement(View, _extends({}, props, {
    style: finalStyle
  })));
});
const styles = StyleSheet.create({
  basic: {
    flexGrow: 1,
    flexShrink: 1
  }
});
//# sourceMappingURL=index.js.map