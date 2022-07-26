import { get } from 'lodash';
import React, { Children } from 'react';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { RNFunctionComponent } from '../helpers';
import withConfig from '../helpers/withConfig';
import { View, ViewProps } from '../View';

export interface TopBarProps extends ViewProps {
  disableShadow?: boolean;
}

export const TopBarBase: RNFunctionComponent<TopBarProps> = withConfig(
  ({ children, style, theme, disableShadow = false, ...props }) => {
    const inset = useSafeAreaInsets();
    const finalStyle = StyleSheet.flatten([
      styles.basic,
      {
        backgroundColor: theme?.colors?.background,
        paddingTop: inset.top,
      },
      !disableShadow && theme?.shadow,
      style,
    ]);

    return (
      <View {...props} style={finalStyle}>
        {Children.toArray(children).sort((elA, elB) => {
          const el = ['TopBar.LeftAction', 'TopBar.Title', 'TopBar.RightAction'];
          const nameA = get(elA, 'type.displayName', get(elA, 'type.name', ''));
          const nameB = get(elB, 'type.displayName', get(elB, 'type.name', ''));
          if (el.indexOf(nameA) < el.indexOf(nameB)) {
            return -1;
          }
          if (el.indexOf(nameA) > el.indexOf(nameB)) {
            return 1;
          }
          return 0;
        })}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  basic: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99,
  },
});

TopBarBase.displayName = 'TopBar';
