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
import { renderNode } from '../helpers/node';
import withConfig from '../helpers/withConfig';
import { useModal } from '../hooks/modal';
import type { TModalProps } from '../Modal/context';
import { View, ViewProps } from '../View';
import { Label } from './Label';

export interface ButtonProps extends TouchableOpacityProps, TouchableNativeFeedbackProps {
  TouchableComponent?: typeof Component;
  disabled?: boolean;
  loading?: boolean;
  tooltip?: string;
  containerStyle?: StyleProp<ViewStyle>;
  Component?: typeof React.Component;
  componentProps?: Partial<ViewProps>;
  variant?: 'text' | 'outlined' | 'filled' | 'tonal';
  loadingProps?: Partial<ActivityIndicatorProps>;
  shadow?: boolean;
  modalId?: string;
  modalProps?: Omit<TModalProps, 'id'>;
  containerProps?: Partial<ViewProps>;
  rounded?: boolean;
}

interface LoadingProps {
  loadingProps?: Partial<ActivityIndicatorProps>;
  loading?: boolean;
  style?: ViewStyle | any;
  theme?: any;
}

interface ChildProps {
  loading?: boolean;
  disabled?: boolean;
  theme?: any;
  children?: React.ReactNode;
  style?: ViewStyle | any;
}

const _ButtonBase: RNFunctionComponent<ButtonProps> = ({
  TouchableComponent,
  children,
  theme,
  style,
  disabled,
  containerStyle,
  Component = View,
  componentProps,
  tooltip,
  variant = 'filled',
  shadow = false,
  loading = false,
  loadingProps,
  modalId,
  modalProps,
  rounded = false,
  onPress,
  onPressIn,
  onPressOut,
  containerProps,
  ...props
}) => {
  const [isPressIn, setIsPressIn] = useState(false);
  const { isOpen, setIsOpen } = useModal(modalId);

  const NativeTouchableComponent =
    TouchableComponent ||
    Platform.select({
      // @ts-ignore
      android: TouchableNativeFeedback,
      ios: TouchableOpacity,
    });

  const handleModal = useCallback(() => {
    if (!modalId) return;

    setIsOpen(!isOpen, modalProps);
  }, [modalId, modalProps, setIsOpen, isOpen]);

  const handleOnPress = useCallback(
    (evt: any) => {
      if (!loading && !disabled) {
        handleModal();
        if (onPress) {
          onPress(evt);
        }
      }
    },
    [loading, onPress, disabled, modalProps, handleModal]
  );

  const handleOnPressIn = useMemo(
    () =>
      ['text', 'outlined'].indexOf(variant) > -1
        ? (evt: any) => {
            setIsPressIn(true);
            if (!!onPressIn) {
              onPressIn(evt);
            }
          }
        : undefined,
    [isPressIn, onPressIn]
  );

  const handleOnPressOut = useMemo(
    () =>
      ['text', 'outlined'].indexOf(variant) > -1
        ? (evt: any) => {
            setTimeout(() => {
              setIsPressIn(false);
            }, 200);
            if (!!onPressOut) {
              onPressOut(evt);
            }
          }
        : undefined,
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
    {
      text: {
        color: get(mergeStyle, 'color', baseColor),
        backgroundColor: Color(baseColor)
          .alpha(isPressIn && Platform.OS === 'ios' ? 0.1 : 0)
          .rgb()
          .toString(),
      },
      outlined: {
        color: get(mergeStyle, 'color', baseColor),
        backgroundColor: Color(baseColor)
          .alpha(isPressIn && Platform.OS === 'ios' ? 0.1 : 0)
          .rgb()
          .toString(),
        borderColor: get(mergeStyle, 'borderColor', baseColor),
        borderWidth: 1,
      },
      filled: {},
      tonal: {
        color: Color(get(mergeStyle, 'color', baseColor)).darken(0.2).rgb().toString(),
        backgroundColor: Color(baseColor).alpha(0.2).rgb().toString(),
      },
    }[variant],
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
    rounded && {
      borderRadius: 9999,
    },
  ]);

  const finalContainerStyle = StyleSheet.flatten([
    styles.container,
    containerStyle,
    shadow && {
      ...(disabled || loading ? {} : theme?.shadow),
      overflow: 'visible',
    },
    rounded && {
      borderRadius: 9999,
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

  return (
    <View
      {...containerProps}
      // @ts-ignore
      style={finalContainerStyle}
    >
      <NativeTouchableComponent
        {...props}
        onPress={handleOnPress}
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
          <RenderLoading
            loading={loading}
            loadingProps={loadingProps}
            style={finalStyle}
            theme={theme}
          />
          <RenderChild
            loading={loading}
            disabled={disabled}
            style={finalStyle}
            theme={theme}
            children={children}
          />
        </Component>
      </NativeTouchableComponent>
    </View>
  );
};

const RenderLoading = ({ loading = false, loadingProps, style, theme }: LoadingProps) => {
  if (loading) {
    return (
      <ActivityIndicator
        {...loadingProps}
        color={get(style, 'color', theme?.colors.white)}
        style={styles.loading}
      />
    );
  }

  return null;
};

const RenderChild = ({ loading = false, disabled = false, theme, children, style }: ChildProps) => {
  const finalTitleStyle = StyleSheet.flatten([
    styles.title,
    {
      color: disabled
        ? Color(theme?.colors.disabled).darken(0.1).rgb().string()
        : get(style, 'color', theme?.colors.white),
    },
    loading && {
      opacity: 0,
    },
  ]);

  const childs = Children.toArray(children);

  return (
    <>
      {childs
        .sort((elA, elB) => {
          const nameA = get(elA, 'type.displayName', get(elA, 'type.name', ''));
          const nameB = get(elB, 'type.displayName', get(elB, 'type.name', ''));
          const idxA = nameA === 'Button.LeftIcon' ? 0 : nameA === 'Button.RightIcon' ? 2 : 1;
          const idxB = nameB === 'Button.LeftIcon' ? 0 : nameB === 'Button.RightIcon' ? 2 : 1;
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
          const isIcon = ['Button.LeftIcon', 'Button.RightIcon', 'Icon'].includes(name);
          const isLabel = typeof child === 'string' || ['Button.Label', 'Text'].includes(name);
          let props: any = {};
          if (React.isValidElement(child)) {
            props = child.props;
          }
          // if (name === 'Button.Icon') {
          //   console.warn(
          //     "Button.Icon must be independent and don't use it as a child. Use Button.LeftIcon or Button.RightIcon instead."
          //   );
          // }

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
    </>
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
