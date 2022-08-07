import React from 'react';
import { StyleSheet } from 'react-native';
import type { RNFunctionComponent } from '../helpers';
import withConfig from '../helpers/withConfig';
import { Text, TextProps } from '../Text';

export interface FieldErrorMessageProps extends TextProps {}

const _FieldErrorMessage: RNFunctionComponent<FieldErrorMessageProps> = ({
  style,
  theme,
  ...props
}) => {
  const finalStyle = StyleSheet.flatten([
    styles.label,
    {
      color: theme?.colors.error,
    },
    style,
  ]);

  return <Text {...props} style={finalStyle} />;
};

const styles = StyleSheet.create({
  label: {
    fontWeight: '600',
    fontSize: 12,
    marginBottom: 8,
    marginHorizontal: 4,
  },
});

_FieldErrorMessage.displayName = 'Field.ErrorMessage';
export const FieldErrorMessage = withConfig(_FieldErrorMessage);
