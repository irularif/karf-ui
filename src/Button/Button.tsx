import Color from 'color';
import { get } from 'lodash';
import React, { Children, Component, useCallback, useMemo, useRef, useState } from 'react';
import {
  Platform,
  StyleProp,
  StyleSheet,
  TouchableNativeFeedback,
  TouchableNativeFeedbackProps,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from 'react-native';
import type { RNFunctionComponent } from '../helpers';
import renderNode from '../helpers/renderNode';
import withConfig from '../helpers/withTheme';
import { Text } from '../Text';
import { View, ViewProps } from '../View';
import { Tooltip, TooltipProps } from './Tooltip';

export interface ButtonProps extends TouchableOpacityProps, TouchableNativeFeedbackProps {
  TouchableComponent?: typeof Component;
  disabled?: boolean;
  loading?: boolean;
  title?: string;
  tooltip?: string;
  containerStyle?: StyleProp<ViewStyle>;
  Component?: typeof React.Component;
  componentProps?: Partial<ViewProps>;
  tooltipProps?: TooltipProps;
}

export const ButtonBase: RNFunctionComponent<ButtonProps> = withConfig(
  ({
    TouchableComponent,
    children,
    theme,
    style,
    loading,
    disabled,
    containerStyle,
    title,
    Component = View,
    componentProps,
    onPress,
    onLongPress,
    ...props
  }) => {
    const ref = useRef<any>();
    const isTooltipState = useState(false);
    const [_, setIsTooltip] = isTooltipState;
    const buttonPositionState = useState({
      height: 0,
      width: 0,
      x: 0,
      y: 0,
      pageX: 0,
      pageY: 0,
    });
    const [__, setButtonPosition] = buttonPositionState;

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
            Color(get(style, 'backgroundColor', theme?.colors.white).toString())
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

    const handleOnLongPress = useCallback(
      (evt: any) => {
        setIsTooltip(true);
        if (!loading && !disabled && onLongPress) {
          onLongPress(evt);
        }
      },
      [loading, onLongPress, disabled]
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
      componentProps?.style,
    ]);

    const finalTitleStyle = StyleSheet.flatten([
      styles.title,
      {
        color: theme?.colors.white,
      },
    ]);

    const finalContainerStyle = StyleSheet.flatten([styles.container, containerStyle]);

    const childs = Children.toArray(children);
    if (!!title) {
      childs.push(title);
    }

    return (
      <View
        innerRef={ref}
        style={finalContainerStyle}
        onLayout={(e) => {
          ref.current?.measure?.(
            (x: number, y: number, width: number, height: number, pageX: number, pageY: number) => {
              setButtonPosition({
                x,
                y,
                width,
                height,
                pageX,
                pageY,
              });
            }
          );
        }}
      >
        <NativeTouchableComponent
          onPress={handleOnPress}
          delayPressIn={0}
          activeOpacity={0.6}
          accessibilityRole="button"
          accessibilityState={accessibilityState}
          disabled={disabled}
          background={background}
          onLongPress={handleOnLongPress}
          {...props}
        >
          <Component {...componentProps} style={finalStyle}>
            {!loading &&
              childs
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
                          style: finalTitleStyle,
                        })
                      : child}
                  </React.Fragment>
                ))}
          </Component>
          <Tooltip
            isTooltipState={isTooltipState}
            buttonPositionState={buttonPositionState}
            theme={theme}
          />
        </NativeTouchableComponent>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    margin: 4,
    overflow: 'hidden',
  },
  basic: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  title: {
    marginHorizontal: 8,
    fontWeight: '700',
  },
});

ButtonBase.displayName = 'Button';
