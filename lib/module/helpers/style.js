import { get } from 'lodash';
import { StyleSheet } from 'react-native';
import normalize from './normalizeText';

const fontStyle = style => {
  const fontStyle = get(style, 'fontStyle', 'normal');
  const fontWeight = get(style, 'fontWeight', '400');
  const fontFamily = get(style, 'fontFamily', 'Open Sans').replace(/\s/g, '-') + '_' + fontStyle + '_' + fontWeight;
  const fontSize = normalize(get(style, 'fontSize', 14));
  return StyleSheet.flatten([style, {
    fontFamily,
    fontSize,
    fontWeight,
    fontStyle
  }]);
};

export const parseStyle = function () {
  for (var _len = arguments.length, style = new Array(_len), _key = 0; _key < _len; _key++) {
    style[_key] = arguments[_key];
  }

  let _style = StyleSheet.flatten([...style]);

  const isText = Object.keys(_style).findIndex(x => x.indexOf('font') > -1) > -1;

  if (isText) {
    _style = fontStyle(_style);
  }

  return _style;
};
export const getStyleValue = (style, attr) => {
  let value = undefined;
  attr.forEach(key => {
    value = get(style, key, value);
  });
  return value;
};
//# sourceMappingURL=style.js.map