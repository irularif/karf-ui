import Color from 'color';
import { get } from 'lodash';
import React, { Children, Component, useCallback, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  ActivityIndicatorProps,
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
import withConfig from '../helpers/withConfig';
import { Icon } from '../Icon';
import { View, ViewProps } from '../View';
import { Label } from './Label';
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
  variant?: 'text' | 'outlined' | 'filled' | 'elevated';
  loadingProps?: Partial<ActivityIndicatorProps>;
}

export const ButtonBase: RNFunctionComponent<ButtonProps> = withConfig(
  ({
    TouchableComponent,
    children,
    theme,
    style,
    loading = false,
    disabled,
    containerStyle,
    title,
    Component = View,
    componentProps,
    tooltip,
    variant = 'filled',
    loadingProps,
    onPress,
    onLongPress,
    onPressIn,
    onPressOut,
    ...props
  }) => {
    const [isPressIn, setIsPressIn] = useState(false);
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
        if (!!tooltip) {
          setIsTooltip(true);
        }
        if (!loading && !disabled && onLongPress) {
          onLongPress(evt);
        }
      },
      [loading, onLongPress, disabled, tooltip]
    );

    const handleOnPressIn = useCallback(
      (evt: any) => {
        setIsPressIn(true);
        if (!!onPressIn) {
          onPressIn(evt);
        }
      },
      [isPressIn, onPressIn]
    );

    const handleOnPressOut = useCallback(
      (evt: any) => {
        setIsPressIn(false);
        if (!!onPressOut) {
          onPressOut(evt);
        }
      },
      [isPressIn, onPressOut]
    );

    const accessibilityState = useMemo(
      () => ({
        disabled: !!disabled,
        busy: !!loading,
      }),
      [disabled, loading]
    );

    const mergeStyle = StyleSheet.flatten([
      styles.basic,
      theme?.style,
      style,
      componentProps?.style,
    ]);

    const finalStyle = StyleSheet.flatten([
      mergeStyle,
      {
        backgroundColor: loading
          ? Color(get(mergeStyle, 'backgroundColor', theme?.colors.primary))
              .lighten(0.2)
              .rgb()
              .string()
          : get(mergeStyle, 'backgroundColor', theme?.colors.primary),
      },
      variant === 'text' && {
        color: get(mergeStyle, 'color', get(mergeStyle, 'backgroundColor', theme?.colors.primary)),
        backgroundColor: Color(get(mergeStyle, 'backgroundColor', theme?.colors.primary))
          .alpha(isPressIn ? 0.1 : 0)
          .rgb()
          .string(),
      },
      variant === 'elevated' && {
        color: get(mergeStyle, 'color', get(mergeStyle, 'backgroundColor', theme?.colors.primary)),
        backgroundColor: loading
          ? Color(get(mergeStyle, 'backgroundColor', theme?.colors.primary))
              .lighten(0.5)
              .rgb()
              .string()
          : Color(get(mergeStyle, 'backgroundColor', theme?.colors.primary))
              .lighten(0.5)
              .rgb()
              .string(),
      },
      variant === 'outlined' && {
        color: get(mergeStyle, 'color', get(mergeStyle, 'backgroundColor', theme?.colors.primary)),
        backgroundColor: Color(get(mergeStyle, 'backgroundColor', theme?.colors.primary))
          .alpha(isPressIn ? 0.1 : 0)
          .rgb()
          .string(),
        borderColor: get(mergeStyle, 'borderColor', theme?.colors.primary),
        borderWidth: 1,
      },
      disabled &&
        variant !== 'text' && {
          backgroundColor: Color(theme?.colors?.disabled).lighten(0.4).rgb().string(),
        },
      disabled &&
        variant === 'outlined' && {
          backgroundColor: Color(theme?.colors?.disabled).alpha(0).rgb().string(),
          borderColor: Color(theme?.colors?.disabled).alpha(0.8).rgb().string(),
        },
    ]);

    const finalTitleStyle = StyleSheet.flatten([
      styles.title,
      {
        color:
          disabled || loading
            ? Color(theme?.colors.disabled)
                .alpha(loading ? 0 : 0.8)
                .rgb()
                .string()
            : get(finalStyle, 'color', theme?.colors.white),
      },
    ]);

    const finalContainerStyle = StyleSheet.flatten([
      styles.container,
      containerStyle,
      variant === 'elevated' && {
        ...(disabled || loading ? {} : theme?.shadow),
        overflow: 'visible',
      },
    ]);

    const background =
      Platform.OS === 'android' && Platform.Version >= 21
        ? TouchableNativeFeedback.Ripple(
            Color(get(finalStyle, 'backgroundColor', theme?.colors.primary).toString())
              .lighten(0.4)
              .rgb()
              .string(),
            false
          )
        : undefined;

    const activeOpacity = useMemo(() => {
      switch (variant) {
        case 'text':
          return 1;
        case 'elevated':
          return 0.8;
        default:
          return 0.5;
      }
    }, [variant]);

    const childs = Children.toArray(children);
    if (!!title) {
      childs.push(title);
    }

    return (
      <View
        innerRef={ref}
        // @ts-ignore
        style={finalContainerStyle}
        onLayout={() => {
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
          {...props}
          onPress={handleOnPress}
          delayPressIn={0}
          activeOpacity={activeOpacity}
          accessibilityRole="button"
          accessibilityState={accessibilityState}
          disabled={disabled || loading}
          background={background}
          onLongPress={handleOnLongPress}
          onPressIn={handleOnPressIn}
          onPressOut={handleOnPressOut}
        >
          <Component {...componentProps} style={finalStyle}>
            {!!loading && (
              <ActivityIndicator
                {...loadingProps}
                color={get(finalStyle, 'color', theme?.colors.white)}
                style={styles.loading}
              />
            )}
            {childs
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
              .map((child, index) => {
                const name = get(child, 'type.displayName', get(child, 'type.name', ''));
                const isIcon = ['ButtonLeftIcon', 'ButtonRightIcon', 'Icon'].includes(name);
                const isLabel = typeof child === 'string' || ['ButtonLabel', 'Text'].includes(name);
                let props: any = {};
                if (React.isValidElement(child)) {
                  props = child.props;
                }

                return (
                  <React.Fragment key={index}>
                    {isLabel
                      ? renderNode(Label, get(props, 'children', child), {
                          ...props,
                          theme,
                          style: StyleSheet.flatten([finalTitleStyle, props.style]),
                        })
                      : isIcon
                      ? renderNode(
                          Icon,
                          {},
                          {
                            ...props,
                            color: get(
                              props,
                              'color',
                              get(finalTitleStyle, 'color', theme?.colors.white)
                            ),
                          }
                        )
                      : child}
                  </React.Fragment>
                );
              })}
            <Tooltip
              isTooltipState={isTooltipState}
              buttonPositionState={buttonPositionState}
              theme={theme}
              text={tooltip}
            />
          </Component>
        </NativeTouchableComponent>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    margin: 4,
    overflow: 'visible',
  },
  basic: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  title: {
    marginHorizontal: 8,
    fontWeight: '700',
  },
  loading: {
    position: 'absolute',
  },
});

ButtonBase.displayName = 'Button';
