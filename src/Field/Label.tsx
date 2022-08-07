import React, { forwardRef } from 'react';
import { StyleSheet } from 'react-native';
import type { RNFunctionComponent } from '../helpers';
import withConfig from '../helpers/withConfig';
import { Text, TextMethod, TextProps } from '../Text';

export interface FieldLabelProps extends TextProps {}

const _FieldLabel: RNFunctionComponent<FieldLabelProps> = forwardRef(
  ({ style, theme, ...props }, ref: React.ForwardedRef<TextMethod>) => {
    const finalStyle = StyleSheet.flatten([
      styles.label,
      {
        color: theme?.colors.black,
      },
      style,
    ]);

    return <Text {...props} style={finalStyle} ref={ref} />;
  }
);

const styles = StyleSheet.create({
  label: {
    fontWeight: '600',
    fontSize: 12,
    marginBottom: 4,
  },
});

_FieldLabel.displayName = 'Field.Label';
export const FieldLabel = withConfig(_FieldLabel);
