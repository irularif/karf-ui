import React from 'react';
import { StyleSheet } from 'react-native';
import type { RNFunctionComponent } from '../helpers';
import withConfig from '../helpers/withTheme';
import { Text, TextProps } from '../Text';

export interface TopBarTitleProps extends TextProps {}

export const TopBarTitle: RNFunctionComponent<TopBarTitleProps> = withConfig(
  ({ style, ...props }) => {
    const finalStyle = StyleSheet.flatten([styles.basic, style]);

    return <Text {...props} style={finalStyle} />;
  }
);

const styles = StyleSheet.create({
  basic: {
    flex: 1,
    marginVertical: 8,
    marginHorizontal: 16,
  },
});

TopBarTitle.displayName = 'TopBar.Title';
