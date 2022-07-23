import { get } from 'lodash';
import { StyleProp, StyleSheet, TextStyle } from 'react-native';
import normalize from './normalizeText';

const fontStyle = (style: StyleProp<TextStyle>) => {
  const fontStyle = get(style, 'fontStyle', 'normal');
  let fontWeight = get(style, 'fontWeight', '400');
  switch (fontWeight) {
    case 'normal':
      fontWeight = '400';
      break;
    case 'bold':
      fontWeight = '700';
      break;
  }
  const fontFamily =
    get(style, 'fontFamily', 'Open Sans').replace(/\s/g, '-') + '_' + fontStyle + '_' + fontWeight;
  const fontSize = normalize(get(style, 'fontSize', 14));

  return StyleSheet.flatten([
    style,
    {
      fontFamily,
      fontSize,
      fontWeight,
      fontStyle,
    },
  ]);
};

export const parseStyle = (...style: StyleProp<any>): StyleProp<any> => {
  let _style = StyleSheet.flatten([...style]);
  const isText = Object.keys(_style).findIndex((x) => x.indexOf('font') > -1) > -1;
  if (isText) {
    _style = fontStyle(_style);
  }

  return _style;
};

export const getStyleValue = (style: StyleProp<any>, attr: Array<string>) => {
  let value: any = undefined;
  attr.forEach((key) => {
    value = get(style, key, value);
  });

  return value;
};
