import React from 'react';
import { StyleSheet } from 'react-native';
import type { RNFunctionComponent } from '../helpers';
import withConfig from '../helpers/withConfig';
import { Text, TextProps } from '../Text';

export interface FieldInfoProps extends TextProps {}

const _FieldInfo: RNFunctionComponent<FieldInfoProps> = ({ style, theme, ...props }) => {
  const finalStyle = StyleSheet.flatten([
    styles.label,
    {
      color: theme?.colors.grey400,
    },
    style,
  ]);

  return <Text {...props} style={finalStyle} />;
};

const styles = StyleSheet.create({
  label: {
    fontWeight: '600',
    fontSize: 12,
    marginHorizontal: 4,
  },
});

_FieldInfo.displayName = 'Field.Info';
export const FieldInfo = withConfig(_FieldInfo);
