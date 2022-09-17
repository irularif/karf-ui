import { Portal } from '@gorhom/portal';
import Color from 'color';
import { get } from 'lodash';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Animated, Dimensions, Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { v4 as uuid } from 'uuid';
import { RNFunctionComponent, trimStyle } from '../helpers';
import { renderNode } from '../helpers/node';
import withConfig from '../helpers/withConfig';
import { Text } from '../Text';
import type { ITheme } from '../ThemeProvider/context';
import { View, ViewProps } from '../View';

type Layout = {
  height: number;
  width: number;
  x: number;
  y: number;
  pageX: number;
  pageY: number;
};

export interface TooltipProps extends ViewProps {
  children: React.ReactElement;
  renderElement: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  duration?: number;
  toggleAction?: 'onPress' | 'onLongPress' | 'onPressIn' | 'onPressOut';
  containerStyle?: StyleProp<ViewStyle>;
  wrapperStyle?: StyleProp<ViewStyle>;
  triangleStyle?: StyleProp<ViewStyle>;
}

const _Tooltip: RNFunctionComponent<TooltipProps> = ({
  theme,
  duration = 3000,
  toggleAction = 'onLongPress',
  children,
  style,
  wrapperStyle,
  ...props
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const visibleState = React.useState(false);
  const childPositionState = React.useState<Layout>({
    height: 0,
    width: 0,
    x: 0,
    y: 0,
    pageX: 0,
    pageY: 0,
  });
  const [_, setIsVisible] = visibleState;
  const [__, setChildPosition] = childPositionState;
  const childRef = React.useRef<any>(null);
  const isChildButton =
    ['Button', 'TouchableOpacity'].indexOf(
      get(children, 'type.displayName', get(children, 'type.name', ''))
    ) > -1;

  const forwardRef = useCallback(
    (ref: any) => {
      childRef.current = ref;
      if (typeof children?.props?.ref === 'function') {
        children.props.ref?.(ref);
      } else if (children.props.ref) {
        children.props.ref = ref;
      }
    },
    [children]
  );

  const onLayout = useCallback(() => {
    childRef.current?.measure(
      (x: number, y: number, width: number, height: number, pageX: number, pageY: number) => {
        const layout: Layout = {
          height,
          width,
          x,
          y,
          pageX,
          pageY,
        };
        setChildPosition(layout);
      }
    );
  }, [childRef, children]);

  const open = useCallback(() => {
    setIsVisible(true);
    Animated.spring(fadeAnim, {
      toValue: 1,
      useNativeDriver: true,
      bounciness: 0,
      delay: 100,
    }).start(({ finished }) => {
      if (finished) {
        setTimeout(() => {
          close();
        }, duration);
      }
    });
  }, [fadeAnim]);

  const close = useCallback(() => {
    Animated.spring(fadeAnim, {
      toValue: 0,
      useNativeDriver: true,
      overshootClamping: true,
    }).start(({ finished }) => {
      if (finished) {
        setIsVisible(false);
      }
    });
  }, []);

  const handleOnPress = useCallback(
    (ev: any) => {
      open();
      if (!!children.props[toggleAction]) {
        children.props[toggleAction]?.(ev);
      }
    },
    [children]
  );

  const finalWrapperStyle = StyleSheet.flatten([
    trimStyle(children.props.style, ['backgroundColor', 'margin', 'padding']),
    wrapperStyle,
  ]);

  return (
    <>
      <Pressable
        ref={forwardRef}
        onLayout={onLayout}
        delayLongPress={250}
        {...{ [toggleAction]: handleOnPress }}
        style={finalWrapperStyle}
      >
        {renderNode(children.type, true, {
          ...children.props,
          ...(isChildButton
            ? {
                delayLongPress: 250,
                [toggleAction]: handleOnPress,
              }
            : {}),
        })}
      </Pressable>
      <RenderElement
        {...props}
        theme={theme}
        fadeAnim={fadeAnim}
        visibleState={visibleState}
        childPositionState={childPositionState}
      />
    </>
  );
};

interface IRenderElement extends Partial<TooltipProps> {
  visibleState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  childPositionState: [Layout, React.Dispatch<React.SetStateAction<Layout>>];
  fadeAnim: Animated.Value;
  theme?: ITheme;
}

const RenderElement = ({
  renderElement,
  visibleState,
  childPositionState,
  position = 'top',
  triangleStyle,
  containerStyle,
  fadeAnim,
  style,
  theme,
  ...props
}: IRenderElement) => {
  const [isVisible] = visibleState;
  const [childPosition] = childPositionState;
  const id = useRef(uuid()).current;
  const { height, width } = Dimensions.get('window');
  const [layout, setLayout] = useState({
    height: 0,
    width: 0,
    x: 0,
    y: 0,
  });
  const onTooltipLayout = useCallback((ev: any) => {
    setLayout(ev.nativeEvent.layout);
  }, []);

  const positionAvailability = useMemo(() => {
    let _position = position;
    switch (position) {
      case 'top':
        if (height - childPosition.pageY - layout.height < 0) {
          _position = 'bottom';
        }
        break;
      case 'bottom':
        if (childPosition.pageY + childPosition.height + layout.height > height) {
          _position = 'top';
        }
        break;
      case 'left':
        if (childPosition.pageX - layout.width < 0) {
          _position = 'right';
        }
        break;
      case 'right':
        if (childPosition.pageX + childPosition.width + layout.width > width) {
          _position = 'left';
        }
        break;
    }
    return _position;
  }, [position, layout, childPosition]);

  const positionStyle = useMemo(() => {
    let _style = {};
    let _position = positionAvailability;

    switch (_position) {
      case 'top':
        _style = {
          bottom: height - childPosition.pageY + 2,
          left: childPosition.pageX + childPosition.width / 2 - layout.width / 2,
          flexDirection: 'column-reverse',
          borderTopColor: get(style, 'backgroundColor', theme?.colors.black),
        };
        break;
      case 'bottom':
        _style = {
          top: childPosition.pageY + childPosition.height + 2,
          left: childPosition.pageX + childPosition.width / 2 - layout.width / 2,
          flexDirection: 'column',
          borderBottomColor: get(style, 'backgroundColor', theme?.colors.black),
        };
        break;
      case 'left':
        _style = {
          top: childPosition.pageY + childPosition.height / 2 - layout.height / 2,
          right: width - childPosition.pageX + 2,
          flexDirection: 'row-reverse',
          borderLeftColor: get(style, 'backgroundColor', theme?.colors.black),
        };
        break;
      case 'right':
        _style = {
          top: childPosition.pageY + childPosition.height / 2 - layout.height / 2,
          left: childPosition.pageX + childPosition.width + 2,
          flexDirection: 'row',
          borderRightColor: get(style, 'backgroundColor', theme?.colors.black),
        };
        break;
    }
    return _style;
  }, [style, positionAvailability, childPosition, layout]);

  const finalContainerStyle = StyleSheet.flatten([
    styles.container,
    containerStyle,
    positionStyle,
    {
      opacity: fadeAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      }),
    },
  ]);

  const finalTriangleStyle = StyleSheet.flatten([
    styles.triangle,
    styles[positionAvailability],
    {
      borderColor: get(style, 'backgroundColor', theme?.colors.black),
    },
    triangleStyle,
  ]);

  const finalTextStyle = StyleSheet.flatten([
    styles.text,
    {
      backgroundColor: theme?.colors.black,
      color: Color(get(style, 'backgroundColor', theme?.colors.black)).isDark()
        ? theme?.colors.white
        : theme?.colors.black,
    },
    style,
  ]);

  if (isVisible) {
    return (
      <Portal hostName="@karf-ui" name={`@karf-ui-tooltip-${id}`}>
        <View {...props} isAnimated style={finalContainerStyle} onLayout={onTooltipLayout}>
          <View style={finalTriangleStyle} />
          {typeof renderElement === 'string'
            ? renderNode(Text, renderElement, {
                style: finalTextStyle,
              })
            : renderNode(renderElement, true)}
        </View>
      </Portal>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 12,
    fontWeight: '600',
    overflow: 'hidden',
  },
  triangle: {
    width: 2,
    height: 2,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderRadius: 4,
  },
  top: {
    marginTop: -1,
    borderTopWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 0,
    borderLeftWidth: 8,
    borderRightColor: 'transparent',
    borderLeftColor: 'transparent',
  },
  bottom: {
    marginBottom: -1,
    borderTopWidth: 0,
    borderRightWidth: 8,
    borderBottomWidth: 8,
    borderLeftWidth: 8,
    borderRightColor: 'transparent',
    borderLeftColor: 'transparent',
  },
  left: {
    marginLeft: -1,
    borderBottomWidth: 8,
    borderRightWidth: 0,
    borderTopWidth: 8,
    borderLeftWidth: 8,
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
  },
  right: {
    marginRight: -1,
    borderBottomWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderLeftWidth: 0,
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
    borderLeftColor: 'transparent',
  },
});

_Tooltip.displayName = 'Tooltip';
export const Tooltip = withConfig(_Tooltip);
