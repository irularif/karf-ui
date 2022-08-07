import React from 'react';
import { StyleSheet } from 'react-native';
import type { RNFunctionComponent } from '../helpers';
import withConfig from '../helpers/withConfig';
import { View, ViewProps } from '../View';

export interface AppbarRightActionProps extends ViewProps {}

const _AppbarRightAction: RNFunctionComponent<AppbarRightActionProps> = ({
  style,
  theme,
  ...props
}) => {
  const finalStyle = StyleSheet.flatten([styles.basic, style]);

  return <View {...props} style={finalStyle} />;
};

const styles = StyleSheet.create({
  basic: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});

_AppbarRightAction.displayName = 'Appbar.RightAction';
export const AppbarRightAction = withConfig(_AppbarRightAction);
