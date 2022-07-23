import React from 'react';
import { StyleSheet } from 'react-native';
import type { RNFunctionComponent } from '../helpers';
import withConfig from '../helpers/withTheme';
import { View, ViewProps } from '../View';

export interface TopBarRightActionProps extends ViewProps {}

export const TopBarRightAction: RNFunctionComponent<TopBarRightActionProps> = withConfig(
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

TopBarRightAction.displayName = 'TopBar.RightAction';
