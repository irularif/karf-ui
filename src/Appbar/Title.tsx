import React from 'react';
import { StyleSheet } from 'react-native';
import type { RNFunctionComponent } from '../helpers';
import withConfig from '../helpers/withConfig';
import { Text, TextProps } from '../Text';

export interface AppbarTitleProps extends TextProps {}

const _AppbarTitle: RNFunctionComponent<AppbarTitleProps> = ({ style, ...props }) => {
  const finalStyle = StyleSheet.flatten([styles.basic, style]);

  return <Text {...props} style={finalStyle} />;
};

const styles = StyleSheet.create({
  basic: {
    flex: 1,
    marginVertical: 8,
    marginHorizontal: 8,
    fontWeight: '600',
    fontSize: 16,
  },
});

_AppbarTitle.displayName = 'Appbar.Title';
export const AppbarTitle = withConfig(_AppbarTitle);
