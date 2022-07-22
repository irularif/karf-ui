function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import { get } from 'lodash';
import React from 'react';
import { StyleSheet } from 'react-native';
import { getIconStyle, getIconType } from '../helpers/icon';
import withTheme from '../helpers/withTheme';
export const Icon = withTheme(_ref => {
  var _theme$font, _theme$colors;

  let {
    type,
    name,
    solid,
    brand,
    style,
    theme,
    ...props
  } = _ref;
  const size = get(props, 'size', theme === null || theme === void 0 ? void 0 : (_theme$font = theme.font) === null || _theme$font === void 0 ? void 0 : _theme$font.fontSize);
  const color = get(props, 'color', theme === null || theme === void 0 ? void 0 : (_theme$colors = theme.colors) === null || _theme$colors === void 0 ? void 0 : _theme$colors.black);
  const IconComponent = getIconType(type);
  const iconSpecificStyle = getIconStyle(type, {
    solid,
    brand
  });
  const finalStyle = StyleSheet.flatten([styles.basic, theme === null || theme === void 0 ? void 0 : theme.style, style]);
  console.log(IconComponent);
  return /*#__PURE__*/React.createElement(IconComponent, _extends({
    name: name,
    size: size,
    color: color
  }, iconSpecificStyle, {
    style: finalStyle
  }));
});
const styles = StyleSheet.create({
  basic: {
    padding: 4
  }
});
//# sourceMappingURL=index.js.map