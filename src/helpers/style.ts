import { cloneDeep, get } from 'lodash';
import { StyleProp, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import normalize from './normalizeText';

const fontStyle = (style: TextStyle) => {
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

export const getTextStyle = (style: ViewStyle | TextStyle) => {
  const textKey = ['text', 'font', 'color', 'lineHeight', 'letterSpacing'];
  const styleKey = Object.keys(style).filter(
    (x) => textKey.filter((y) => x.includes(y)).length > -1
  );
  const _style: any = {};
  styleKey.forEach((x) => {
    _style[x] = (style as any)[x];
  });
  return _style;
};

export const getStyleValue = (
  style: StyleProp<any>,
  attr: Array<string>,
  defaultValue: any = undefined
) => {
  let value: any = defaultValue;
  attr.forEach((key) => {
    value = get(style, key, value);
  });

  return value;
};

export const trimStyle = (style: any, prefixs: Array<string | RegExp>) => {
  const s = cloneDeep(style);
  Object.keys(s).forEach((k) => {
    const isExist = prefixs.filter((x) => k.match(new RegExp(x)));
    if (isExist.length > 0) {
      delete s[k];
    }
  });

  return s;
};

export const extractStyle = (style: any, prefixs: Array<string>) => {
  const s: any = {};
  Object.keys(style).forEach((k) => {
    const isExist = prefixs.filter((x) => k === x);
    if (isExist.length > 0) {
      s[k] = style[k];
    }
  });

  return s;
};
