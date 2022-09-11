import React from 'react';
import { StyleSheet } from 'react-native';
import type { RNFunctionComponent } from '../helpers';
import withConfig from '../helpers/withConfig';
import { Text, TextProps } from '../Text';
import { defaultTheme } from '../ThemeProvider/context';

export interface ButtonLabelProps extends TextProps {}

const _Label: RNFunctionComponent<ButtonLabelProps> = ({ style, theme = defaultTheme, ...props }) => {
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
    textAlign: 'center',
    flexGrow: 1,
    flexShrink: 1,
  },
});

_Label.displayName = 'Button.Label';
export const Label = withConfig(_Label);
