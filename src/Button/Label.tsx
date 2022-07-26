import React from 'react';
import { StyleSheet } from 'react-native';
import type { RNFunctionComponent } from '../helpers';
import withConfig from '../helpers/withConfig';
import { Text, TextProps } from '../Text';
import type { ITheme } from '../ThemeProvider/context';

export interface LabelProps extends TextProps {
  theme?: ITheme;
}

export const Label: RNFunctionComponent<LabelProps> = withConfig(({ style, theme, ...props }) => {
  const finalStyle = StyleSheet.flatten([
    styles.label,
    {
      color: theme?.colors.black,
    },
    style,
  ]);

  return <Text {...props} style={finalStyle} />;
});

const styles = StyleSheet.create({
  label: {
    fontWeight: '600',
    marginHorizontal: 8,
  },
});

Label.displayName = 'ButtonLabel';