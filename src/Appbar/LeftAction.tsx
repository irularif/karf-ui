import React from 'react';
import { StyleSheet } from 'react-native';
import type { RNFunctionComponent } from '../helpers';
import withConfig from '../helpers/withConfig';
import { View, ViewProps } from '../View';

export interface AppbarLeftActionProps extends ViewProps {}

const _AppbarLeftAction: RNFunctionComponent<AppbarLeftActionProps> = ({
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
    alignItems: 'center',
  },
});

_AppbarLeftAction.displayName = 'Appbar.LeftAction';
export const AppbarLeftAction = withConfig(_AppbarLeftAction);
