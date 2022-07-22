function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import React from 'react';
import { View as NativeView } from 'react-native';
import renderNode from '../helpers/renderNode';
import { parseStyle } from '../helpers/style';
import withTheme from '../helpers/withTheme';
import useScreen from '../hooks/screen';
import { Text } from '../Text';
import { defaultTheme } from '../ThemeProvider/context';
export const View = withTheme(_ref => {
  let {
    children,
    style,
    theme = defaultTheme,
    ...props
  } = _ref;
  const {
    select
  } = useScreen();
  const responsive = select(props);
  const finalStyle = parseStyle([theme.style, style, responsive === null || responsive === void 0 ? void 0 : responsive.style]);
  return /*#__PURE__*/React.createElement(NativeView, _extends({}, props, {
    style: finalStyle
  }), React.Children.toArray(children).map((child, index) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: index
  }, typeof child === 'string' ? renderNode(Text, child) : child)));
});
//# sourceMappingURL=index.js.map