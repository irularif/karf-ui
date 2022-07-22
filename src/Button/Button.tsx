import Color from 'color';
import { get } from 'lodash';
import React, { Children, Component, useCallback, useMemo } from 'react';
import {
  Platform,
  StyleSheet,
  TouchableNativeFeedback,
  TouchableNativeFeedbackProps,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import type { RNFunctionComponent } from '../helpers';
import renderNode from '../helpers/renderNode';
import withTheme from '../helpers/withTheme';
import { Text } from '../Text';
import { View } from '../View';

export interface ButtonProps extends TouchableOpacityProps, TouchableNativeFeedbackProps {
  TouchableComponent?: typeof Component;
  disabled?: boolean;
  loading?: boolean;
  title?: string;
}

export const ButtonBase: RNFunctionComponent<ButtonProps> = withTheme(
  ({ TouchableComponent, children, theme, style, loading, disabled, onPress, ...props }) => {
    const NativeTouchableComponent =
      TouchableComponent ||
      Platform.select({
        // @ts-ignore
        android: TouchableNativeFeedback,
        ios: TouchableOpacity,
      });

    const background =
      Platform.OS === 'android' && Platform.Version >= 21
        ? TouchableNativeFeedback.Ripple(
            Color(get(style, 'backgroundColor', theme?.colors.primary).toString())
              .alpha(0.32)
              .rgb()
              .string(),
            false
          )
        : undefined;

    const handleOnPress = useCallback(
      (evt: any) => {
        if (!loading && !disabled && onPress) {
          onPress(evt);
        }
      },
      [loading, onPress, disabled]
    );

    const accessibilityState = useMemo(
      () => ({
        disabled: !!disabled,
        busy: !!loading,
      }),
      [disabled, loading]
    );

    const finalStyle = StyleSheet.flatten([
      styles.basic,
      {
        backgroundColor: theme?.colors.primary,
      },
      theme?.style,
      style,
    ]);

    return (
      <NativeTouchableComponent
        onPress={handleOnPress}
        delayPressIn={0}
        activeOpacity={0.3}
        accessibilityRole="button"
        accessibilityState={accessibilityState}
        disabled={disabled}
        background={background}
        {...props}
      >
        <View style={finalStyle}>
          {!loading &&
            Children.toArray(children)
              .sort((elA, elB) => {
                const nameA = get(elA, 'type.displayName', get(elA, 'type.name', ''));
                const nameB = get(elB, 'type.displayName', get(elB, 'type.name', ''));
                const idxA = nameA === 'ButtonLeftIcon' ? 0 : nameA === 'ButtonRightIcon' ? 2 : 1;
                const idxB = nameB === 'ButtonLeftIcon' ? 0 : nameB === 'ButtonRightIcon' ? 2 : 1;
                if (idxA < idxB) {
                  return -1;
                }
                if (idxA > idxB) {
                  return 1;
                }
                return 0;
              })
              .map((child, index) => (
                <React.Fragment key={index}>
                  {typeof child === 'string'
                    ? renderNode(Text, child, {
                        style: styles.title,
                      })
                    : child}
                </React.Fragment>
              ))}
        </View>
      </NativeTouchableComponent>
    );
  }
);

const styles = StyleSheet.create({
  basic: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginHorizontal: 8,
  },
});

ButtonBase.displayName = 'Button';
