import React from 'react';
import { StyleSheet } from 'react-native';
import type { RNFunctionComponent } from '../helpers';
import withConfig from '../helpers/withConfig';
import { Text, TextProps } from '../Text';

export interface FieldLabelProps extends TextProps {}

const _FieldLabel: RNFunctionComponent<FieldLabelProps> = ({ style, theme, ...props }) => {
  const finalStyle = StyleSheet.flatten([
    styles.label,
    {
      color: theme?.colors.black,
    },
    style,
  ]);

  return <Text {...props} style={finalStyle} />;
};

const styles = StyleSheet.create({
  label: {
    fontWeight: '600',
    fontSize: 12,
    marginBottom: 4,
  },
});

_FieldLabel.displayName = 'Field.Label';
export const FieldLabel = withConfig(_FieldLabel);
