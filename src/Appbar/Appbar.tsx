import { get } from 'lodash';
import React, { Children } from 'react';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getStyleValue, RNFunctionComponent } from '../helpers';
import renderNode from '../helpers/renderNode';
import withConfig from '../helpers/withConfig';
import { View, ViewProps } from '../View';

export interface AppbarProps extends ViewProps {
  disableShadow?: boolean;
  insetTop?: boolean;
  insetBottom?: boolean;
}

const _AppbarBase: RNFunctionComponent<AppbarProps> = ({
  children,
  style,
  theme,
  disableShadow = false,
  insetTop = false,
  insetBottom = false,
  ...props
}) => {
  const inset = useSafeAreaInsets();
  const finalStyle = StyleSheet.flatten([styles.basic, style]);
  const finalContainerStyle = StyleSheet.flatten([
    styles.container,
    {
      backgroundColor: theme?.colors?.background,
    },
    !disableShadow && theme?.shadow,
    !!insetTop && {
      paddingTop: getStyleValue(style, ['paddingTop', 'paddingVertical', 'padding'], 0) + inset.top,
    },
    !!insetBottom && {
      paddingBottom:
        getStyleValue(style, ['paddingBottom', 'paddingVertical', 'padding'], 0) + inset.bottom,
    },
  ]);

  return (
    <View style={finalContainerStyle}>
      <View {...props} style={finalStyle}>
        {Children.toArray(children)
          .sort((elA, elB) => {
            const el = ['Appbar.LeftAction', 'Appbar.Title', 'Appbar.RightAction'];
            const nameA = get(elA, 'type.displayName', get(elA, 'type.name', ''));
            const nameB = get(elB, 'type.displayName', get(elB, 'type.name', ''));
            if (el.indexOf(nameA) < el.indexOf(nameB)) {
              return -1;
            }
            if (el.indexOf(nameA) > el.indexOf(nameB)) {
              return 1;
            }
            return 0;
          })
          .map((child, index) => (
            <React.Fragment key={index.toString()}>
              {typeof child === 'string' ? renderNode(Text, child) : child}
            </React.Fragment>
          ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  basic: {
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    zIndex: 99,
  },
});

_AppbarBase.displayName = 'Appbar';
export const AppbarBase = withConfig(_AppbarBase);
