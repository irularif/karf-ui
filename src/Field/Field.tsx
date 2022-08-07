import Color from 'color';
import { get } from 'lodash';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';
import { getStyleValue, RNFunctionComponent } from '../helpers';
import { findNode, renderNode } from '../helpers/node';
import withConfig from '../helpers/withConfig';
import type { TextInputMethods } from '../Input/Text';
import { View, ViewProps } from '../View';

export interface FieldProps extends ViewProps {
  containerProps?: ViewProps;
  variant?: 'flat' | 'outlined';
}

const _FieldBase: RNFunctionComponent<FieldProps> = ({
  children,
  containerProps,
  style,
  theme,
  variant = 'flat',
  onLayout: _onLayout,
  ...props
}) => {
  const inputRef = useRef<TextInputMethods>();

  const labelNode = findNode(children, 'Field.Label');
  const infoNode = findNode(children, 'Field.Info');
  const errorNode = findNode(children, 'Field.ErrorMessage');
  const prefixNode = findNode(children, 'Field.Prefix');
  const suffixNode = findNode(children, 'Field.Suffix');
  const inputNode = findNode(children, 'Input.');

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const inputLayoutState = useState({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  });
  const [labelLayout, setLabelLayout] = useState({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  });

  const [inputLayout] = inputLayoutState;

  const startAnimation = useCallback(
    (config: Partial<Animated.SpringAnimationConfig>) => {
      Animated.spring(fadeAnim, {
        toValue: 1,
        useNativeDriver: false,
        bounciness: 0,
        ...config,
      }).start();
    },
    [fadeAnim]
  );

  const closeAnimation = useCallback(() => {
    Animated.spring(fadeAnim, {
      toValue: 0,
      useNativeDriver: false,
      bounciness: 0,
    }).start();
  }, [fadeAnim]);

  const onLabelLayout = useCallback(
    (e: any) => {
      setLabelLayout(e.nativeEvent.layout);
      if (labelNode?.props?.onLayout) {
        labelNode.props.onLayout(e);
      }
    },
    [_onLayout]
  );

  const onLabelPress = useCallback(() => {
    inputRef.current?.focus?.();
  }, [inputRef.current]);

  const finalStyle = StyleSheet.flatten([
    styles.basic,
    styles[variant],
    style,
    {
      flat: {},
      outlined: {
        borderColor: errorNode ? theme?.colors.error : theme?.colors.divider,
        paddingTop:
          getStyleValue(style, ['padding', 'paddingVertical', 'paddingTop'], 0) +
          labelLayout.height / 2,
        backgroundColor: get(style, 'backgroundColor', theme?.colors.background),
      },
    }[variant],
  ]);
  const finalContainerStyle = StyleSheet.flatten([
    styles.container,
    style,
    {
      flat: {},
      outlined: {
        paddingTop:
          getStyleValue(style, ['paddingVertical', 'paddingTop'], 0) + labelLayout.height / 2,
      },
    }[variant],
  ]);
  const finalLabelStyle = StyleSheet.flatten([
    {
      color: theme?.colors.grey500,
    },
    labelNode?.props?.style,
    {
      flat: {},
      outlined: {
        overflow: 'hidden',
        transform: [
          {
            scale: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [1.2, 1],
            }),
          },
          {
            translateX: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [(labelLayout.width * 0.2) / 2 - 4, 0],
            }),
          },
        ],
        backgroundColor: get(style, 'backgroundColor', theme?.colors.background),
        marginBottom: 0,
        paddingHorizontal:
          getStyleValue(labelNode?.props?.style, ['padding', 'paddingHorizontal'], 0) + 4,
      },
    }[variant],
  ]);

  const finalContainerLabelStyle = StyleSheet.flatten([
    variant === 'outlined' && styles.labelContainerOutlined,
    {
      flat: {},
      outlined: {
        marginBottom: 0,
        backgroundColor: fadeAnim.interpolate({
          inputRange: [0, 0.1, 1],
          outputRange: [
            get(style, 'backgroundColor', theme?.colors.background),
            Color(get(finalStyle, 'backgroundColor', theme?.colors.background))
              .alpha(0)
              .rgb()
              .toString(),
            Color(get(finalStyle, 'backgroundColor', theme?.colors.background))
              .alpha(0)
              .rgb()
              .toString(),
          ],
        }),
        left: fadeAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [inputLayout.x - 1, 8],
        }),
        top: fadeAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [inputLayout.y - 1, -(labelLayout.height / 2)],
        }),
        height: fadeAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [inputLayout.height, labelLayout.height] as any,
        }),
        width: fadeAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [inputLayout.width, labelLayout.width] as any,
        }),
      },
    }[variant],
  ]);
  
  return (
    <View {...containerProps} style={finalContainerStyle}>
      {!!labelNode &&
        variant === 'flat' &&
        renderNode(labelNode.type, true, {
          ...labelNode.props,
          suppressHighlighting: true,
          style: finalLabelStyle,
          onPress: onLabelPress,
        })}
      <View {...props} style={finalStyle}>
        {!!prefixNode && renderNode(prefixNode.type, true, prefixNode.props)}
        {/* @ts-ignore */}
        <View isAnimated style={finalContainerLabelStyle}>
          <Pressable onPress={onLabelPress} style={styles.labelButtonOutlined}>
            {labelNode &&
              variant === 'outlined' &&
              renderNode(labelNode.type, true, {
                ...labelNode.props,
                suppressHighlighting: true,
                isAnimated: true,
                style: finalLabelStyle,
                onLayout: onLabelLayout,
              })}
          </Pressable>
        </View>
        {!!inputNode && (
          <RenderChild
            child={inputNode}
            inputLayoutState={inputLayoutState}
            startAnimation={startAnimation}
            closeAnimation={closeAnimation}
            inputRef={inputRef}
            finalLabelStyle={finalLabelStyle}
            variant={variant}
          />
        )}
        {!!suffixNode && renderNode(suffixNode.type, true, suffixNode.props)}
      </View>
      {errorNode ? renderNode(errorNode.type, errorNode.props) : null}
      {infoNode ? renderNode(infoNode.type, infoNode.props) : null}
    </View>
  );
};

const RenderChild = (props: any) => {
  const { child, inputLayoutState, startAnimation, closeAnimation, inputRef, finalLabelStyle } =
    props;
  const [_, setInputLayout] = inputLayoutState;
  const newProps = {
    ...child.props,
  };

  const onLayout = useCallback(
    (e: any) => {
      setInputLayout(e.nativeEvent.layout);
      if (!!child.props?.onLayout) {
        child.props.onLayout(e);
      }
    },
    [child.props]
  );

  const onBlur = useCallback(
    (e: any) => {
      const state = inputRef.current?.getState?.();
      if (!state?.value) {
        closeAnimation();
      }
      if (!!child.props?.onBlur) {
        child.props.onBlur(e);
      }
    },
    [child.props]
  );

  const onFocus = useCallback(
    (e: any) => {
      startAnimation();
      if (!!child.props?.onFocus) {
        child.props.onFocus(e);
      }
    },
    [child.props]
  );

  const setRef = useCallback(
    (ref: any) => {
      if (!ref) return;
      inputRef.current = ref;
      if (!!child.props?.ref) {
        child.props.ref(ref);
      }
    },
    [child.props]
  );

  newProps.onLayout = onLayout;
  newProps.onFocus = onFocus;
  newProps.onBlur = onBlur;
  newProps.ref = setRef;
  if (newProps.type === 'password') {
    newProps.secureProps = {
      style: StyleSheet.flatten([
        newProps?.secureProps?.style,
        {
          backgroundColor: get(finalLabelStyle, 'color', undefined),
        },
      ]),
    };
  }

  useEffect(() => {
    if (!!newProps.value) {
      startAnimation({
      });
    }
  }, []);

  return renderNode(child?.type, true, newProps);
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  basic: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    position: 'relative',
    justifyContent: 'flex-start',
  },
  flat: {
    borderBottomWidth: 1,
  },
  outlined: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 4,
  },
  labelContainerOutlined: {
    position: 'absolute',
    zIndex: 1,
    textAlignVertical: 'center',
  },
  labelButtonOutlined: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

_FieldBase.displayName = 'Field';
export const FieldBase = withConfig(_FieldBase);
