function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import React from 'react';
import { StyleSheet, Text as NativeText } from 'react-native';
import { parseStyle } from '../helpers/style';
import withTheme from '../helpers/withTheme';
import useScreen from '../hooks/screen';
import { defaultTheme } from '../ThemeProvider/context';
export const Text = withTheme(_ref => {
  let {
    children,
    heading,
    style,
    theme = defaultTheme,
    ...props
  } = _ref;
  const {
    select
  } = useScreen();
  const responsive = select(props);
  const finalStyle = parseStyle([{
    color: theme.colors.black
  }, styles.basic, theme.font, theme.style, !!heading && styles[heading], style, responsive === null || responsive === void 0 ? void 0 : responsive.style]);
  return /*#__PURE__*/React.createElement(NativeText, _extends({}, props, {
    accessibilityRole: "text",
    style: finalStyle
  }), children);
});
const styles = StyleSheet.create({
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