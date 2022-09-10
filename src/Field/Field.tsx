import Color from 'color';
import { debounce, get } from 'lodash';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useMemo } from 'react';
import type { ViewStyle } from 'react-native';
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

interface ILayout {
  width: number;
  height: number;
  x: number;
  y: number;
}

interface RenderNodeProps {
  node: React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | null;
  style?: ViewStyle;
}

interface RenderLabelProps extends RenderNodeProps {
  labelLayoutState: [ILayout, React.Dispatch<React.SetStateAction<ILayout>>];
  variant: 'flat' | 'outlined';
  shouldVariant: 'flat' | 'outlined';
  onPress?: () => void;
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
  const readyState = useState(false);
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
  const labelLayoutState = useState({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  });
  const [labelLayout] = labelLayoutState;

  const [inputLayout] = inputLayoutState;

  const startAnimation = useCallback((config: Partial<Animated.SpringAnimationConfig>) => {
    Animated.spring(fadeAnim, {
      toValue: 1,
      useNativeDriver: false,
      bounciness: 0,
      ...config,
    }).start();
  }, []);

  const closeAnimation = useCallback(() => {
    Animated.spring(fadeAnim, {
      toValue: 0,
      useNativeDriver: false,
      bounciness: 0,
    }).start();
  }, []);

  const onLabelPress = useCallback(() => {
    inputRef.current?.focus?.();
  }, [inputRef.current]);

  const finalStyle = StyleSheet.flatten([
    styles.basic,
    styles[variant],
    style,
    {
      borderColor: errorNode ? theme?.colors.error : theme?.colors.divider,
    },
    {
      flat: {},
      outlined: {
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
    get(labelNode, 'props.style', {}),
    {
      flat: {},
      outlined: {
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
          {
            translateY: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [labelLayout.height / 2 - 4, 0],
            }),
          },
        ],
        backgroundColor: fadeAnim.interpolate({
          inputRange: [0, 0.7, 1],
          outputRange: [
            Color(get(finalStyle, 'backgroundColor', theme?.colors.background))
              .alpha(0)
              .rgb()
              .toString(),
            Color(get(finalStyle, 'backgroundColor', theme?.colors.background))
              .alpha(0)
              .rgb()
              .toString(),
            get(style, 'backgroundColor', theme?.colors.background),
          ],
        }),
        marginBottom: 0,
        paddingHorizontal:
          getStyleValue(get(labelNode, 'props.style', {}), ['padding', 'paddingHorizontal'], 0) + 4,
      },
    }[variant],
  ]);
  const finalContainerLabelStyle = StyleSheet.flatten([
    variant === 'outlined' && styles.labelContainerOutlined,
    {
      flat: {},
      outlined: {
        overflow: 'hidden',
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
          outputRange: [inputLayout.y - labelLayout.height / 2, -(labelLayout.height / 2)],
        }),
        width: fadeAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [inputLayout.width, labelLayout.width] as any,
        }),
        height: fadeAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [inputLayout.height, labelLayout.height] as any,
        }),
      },
    }[variant],
  ]);
  const finalButtonLabelStyle = StyleSheet.flatten([styles.labelButtonOutlined]);

  return (
    <View {...containerProps} style={finalContainerStyle}>
      <RenderLabel
        node={labelNode}
        style={finalLabelStyle}
        variant={variant}
        labelLayoutState={labelLayoutState}
        onPress={onLabelPress}
        shouldVariant="flat"
      />
      <View {...props} style={finalStyle}>
        {!!prefixNode && renderNode(prefixNode.type, true, prefixNode.props)}
        {/* @ts-ignore */}
        <View isAnimated style={finalContainerLabelStyle}>
          <Pressable onPress={onLabelPress} style={finalButtonLabelStyle}>
            <RenderLabel
              node={labelNode}
              style={finalLabelStyle}
              variant={variant}
              labelLayoutState={labelLayoutState}
              shouldVariant="outlined"
            />
          </Pressable>
        </View>
        <RenderChild
          child={inputNode}
          inputLayoutState={inputLayoutState}
          startAnimation={startAnimation}
          closeAnimation={closeAnimation}
          inputRef={inputRef}
          finalLabelStyle={finalLabelStyle}
          variant={variant}
          fadeAnim={fadeAnim}
          readyState={readyState}
        />
        <RenderSuffix node={suffixNode} />
      </View>
      <RenderNode node={errorNode} />
      <RenderNode node={infoNode} />
    </View>
  );
};

const RenderNode = ({ node }: RenderNodeProps) => {
  if (!!node) {
    return renderNode(node.type, node.props);
  }
  return null;
};

const RenderSuffix = ({ node }: RenderNodeProps) => {
  if (!!node) {
    return renderNode(node.type, true, node.props);
  }
  return null;
};

const RenderLabel = ({
  style,
  labelLayoutState,
  node,
  variant,
  onPress,
  shouldVariant,
}: RenderLabelProps) => {
  const [_, setLabelLayout] = labelLayoutState;

  const updateLabelLayout = useCallback(
    debounce((layout) => {
      setLabelLayout(layout);
    }, 50),
    []
  );

  const onLabelLayout = useCallback((e: any) => {
    updateLabelLayout(e.nativeEvent.layout);
  }, []);

  // const newProps = useMemo(() => {
  const nprops = get(node, 'props', {});
  let _newProps = Object.assign({}, nprops, {
    suppressHighlighting: true,
    style: style,
  });

  if (variant === 'flat') {
    _newProps = Object.assign(_newProps, {
      onPress,
    });
  } else if (variant === 'outlined') {
    _newProps = Object.assign(_newProps, {
      isAnimated: true,
      onLayout: onLabelLayout,
    });
  }
  //   return _newProps;
  // }, [node, style]);

  if (!!node && variant === shouldVariant) {
    return renderNode(node.type, true, _newProps);
  }
  return null;
};

const RenderChild = memo((props: any) => {
  const {
    child,
    inputLayoutState,
    startAnimation,
    closeAnimation,
    inputRef,
    finalLabelStyle,
    readyState,
    variant,
  } = props;
  const [isReady, setIsReady] = readyState;
  const [_, setInputLayout] = inputLayoutState;
  const onLayout = useCallback(
    (e: any) => {
      setInputLayout(e.nativeEvent.layout);
      if (!isReady) {
        setIsReady(true);
      }
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
      const state = inputRef.current?.getState?.();
      if (!state.value) {
        startAnimation();
      }
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

  const secureProps = useMemo(() => {
    let _secureProps = undefined;
    if (child.props.type === 'password') {
      _secureProps = {
        style: StyleSheet.flatten([
          child.props?.secureProps?.style,
          {
            backgroundColor: get(finalLabelStyle, 'color', undefined),
          },
        ]),
      };
    }
    return _secureProps;
  }, [child]);

  const newProps = {
    ...child.props,
    secureProps,
    onLayout,
    onBlur,
    onFocus,
    ref: setRef,
  };

  useEffect(() => {
    if (!!newProps.value && !!isReady && variant === 'outlined') {
      startAnimation({
        delay: 300,
      });
    }
  }, [newProps.value, isReady]);

  if (!!child) {
    return renderNode(child?.type, true, newProps);
  }

  return null;
});

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    position: 'relative',
    overflow: 'hidden',
    alignItems: 'flex-start',
    justifyContent: 'center',
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
    paddingHorizontal: 8,
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
