import React from 'react';
import { StyleSheet } from 'react-native';
import type { RNFunctionComponent } from '../helpers';
import withTheme from '../helpers/withTheme';
import { View, ViewProps } from '../View';

export interface TopBarLeftActionProps extends ViewProps {}

export const TopBarLeftAction: RNFunctionComponent<TopBarLeftActionProps> = withTheme(
  ({ style, theme, ...props }) => {
    const finalStyle = StyleSheet.flatten([styles.basic, style]);

    return <View {...props} style={finalStyle} />;
  }
);

const styles = StyleSheet.create({
  basic: {
    flexDirection: 'row',
  },
});

TopBarLeftAction.displayName = 'TopBar.LeftAction';
