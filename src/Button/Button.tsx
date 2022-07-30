import Color from 'color';
import { get } from 'lodash';
import React, { Children, Component, useCallback, useMemo, useState } from 'react';
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
import { View, ViewProps } from '../View';
import { Label } from './Label';

export interface ButtonProps extends TouchableOpacityProps, TouchableNativeFeedbackProps {
  TouchableComponent?: typeof Component;
  disabled?: boolean;
  loading?: boolean;
  title?: string;
  tooltip?: string;
  containerStyle?: StyleProp<ViewStyle>;
  Component?: typeof React.Component;
  componentProps?: Partial<ViewProps>;
  variant?: 'text' | 'outlined' | 'filled' | 'tonal';
  loadingProps?: Partial<ActivityIndicatorProps>;
  shadow?: boolean;
}

const _ButtonBase: RNFunctionComponent<ButtonProps> = ({
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
  shadow = false,
  onPress,
  onPressIn,
  onPressOut,
  ...props
}) => {
  const [isPressIn, setIsPressIn] = useState(false);

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

  const mergeStyle = StyleSheet.flatten([styles.basic, theme?.style, style, componentProps?.style]);

  const baseColor = get(mergeStyle, 'backgroundColor', theme?.colors.primary);
  const finalStyle = StyleSheet.flatten([
    mergeStyle,
    {
      backgroundColor: baseColor,
    },
    variant === 'text' && {
      color: get(mergeStyle, 'color', baseColor),
      backgroundColor: Color(baseColor)
        .alpha(isPressIn && Platform.OS === 'ios' ? 0.1 : 0)
        .rgb()
        .string(),
    },
    variant === 'tonal' && {
      color: Color(get(mergeStyle, 'color', baseColor)).darken(0.2).rgb().string(),
      backgroundColor: Color(baseColor).alpha(0.2).rgb().string(),
    },
    variant === 'outlined' && {
      color: get(mergeStyle, 'color', baseColor),
      backgroundColor: Color(baseColor)
        .alpha(isPressIn ? 0.1 : 0)
        .rgb()
        .string(),
      borderColor: get(mergeStyle, 'borderColor', baseColor),
      borderWidth: 1,
    },
    loading &&
      {
        text: {},
        tonal: {
          backgroundColor: Color(baseColor).alpha(0.15).rgb().string(),
        },
        outlined: {
          borderColor: Color(baseColor).alpha(0.7).rgb().string(),
        },
        filled: {
          backgroundColor: Color(baseColor).alpha(0.5).rgb().string(),
        },
      }[variant],
    disabled &&
      {
        text: {},
        tonal: {
          backgroundColor: Color(theme?.colors?.disabled).alpha(0.3).rgb().string(),
        },
        outlined: {
          backgroundColor: Color(theme?.colors?.disabled).alpha(0).rgb().string(),
          borderColor: Color(theme?.colors?.disabled).alpha(0.8).rgb().string(),
        },
        filled: {
          backgroundColor: Color(theme?.colors?.disabled).alpha(0.3).rgb().string(),
        },
      }[variant],
  ]);

  const finalTitleStyle = StyleSheet.flatten([
    styles.title,
    {
      color: disabled
        ? Color(theme?.colors.disabled).darken(0.1).rgb().string()
        : get(finalStyle, 'color', theme?.colors.white),
    },
    loading && {
      opacity: 0,
    },
  ]);

  const finalContainerStyle = StyleSheet.flatten([
    styles.container,
    containerStyle,
    shadow && {
      ...(disabled || loading ? {} : theme?.shadow),
      overflow: 'visible',
    },
  ]);

  const background =
    Platform.OS === 'android' && Platform.Version >= 21
      ? TouchableNativeFeedback.Ripple(
          Color(baseColor)
            .lighten(variant === 'tonal' || variant === 'text' ? 0.3 : 0.4)
            .rgb()
            .string(),
          false
        )
      : undefined;

  const activeOpacity = useMemo(() => {
    switch (variant) {
      case 'text':
        return 1;
      case 'outlined':
      case 'tonal':
        return 0.5;
      default:
        return 0.6;
    }
  }, [variant]);

  const childs = Children.toArray(children);
  if (!!title) {
    childs.push(title);
  }

  return (
    <View
      // @ts-ignore
      style={finalContainerStyle}
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
        onPressIn={handleOnPressIn}
        onPressOut={handleOnPressOut}
      >
        {/* @ts-ignore */}
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
              if (name === 'ButtonIcon') {
                console.warn(
                  "Button.Icon must be independent and don't use it as a child. Use Button.LeftIcon or Button.RightIcon instead."
                );
              }

              return (
                <React.Fragment key={index.toString()}>
                  {isLabel
                    ? renderNode(Label, get(props, 'children', child), {
                        ...props,
                        theme,
                        style: StyleSheet.flatten([finalTitleStyle, props?.style]),
                      })
                    : isIcon
                    ? renderNode(
                        // @ts-ignore
                        child.type,
                        true,
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
        </Component>
      </NativeTouchableComponent>
    </View>
  );
};

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

_ButtonBase.displayName = 'Button';
export const ButtonBase = withConfig(_ButtonBase);
