import { get } from 'lodash';
import React, { Children } from 'react';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getStyleValue, RNFunctionComponent } from '../helpers';
import withConfig from '../helpers/withTheme';
import { View, ViewProps } from '../View';

export interface TopBarProps extends ViewProps {
  disableShadow?: boolean;
}

export const TopBarBase: RNFunctionComponent<TopBarProps> = withConfig(
  ({ children, style, theme, disableShadow = false, ...props }) => {
    const inset = useSafeAreaInsets();
    const mergeStyle = StyleSheet.flatten([styles.basic, !disableShadow && theme?.shadow, style]);
    const finalStyle = StyleSheet.flatten([
      mergeStyle,
      {
        backgroundColor: theme?.colors?.background,
        paddingTop:
          inset.top +
          (getStyleValue(mergeStyle, ['padding', 'paddingVertical', 'paddingTop']) || 0),
      },
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
  },
});

TopBarBase.displayName = 'TopBar';
