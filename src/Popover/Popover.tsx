import { Portal } from '@gorhom/portal';
import { get } from 'lodash';
import React, {
  Children,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Animated, Dimensions, Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { v4 as uuid } from 'uuid';
import { RNFunctionComponent, trimStyle } from '../helpers';
import { renderNode } from '../helpers/node';
import withConfig from '../helpers/withConfig';
import type { ITheme } from '../ThemeProvider/context';
import { View, ViewProps } from '../View';
import type { PopoverContentProps } from './Content';
import type { PopoverTriggerProps } from './Trigger';

type Layout = {
  height: number;
  width: number;
  x: number;
  y: number;
  pageX: number;
  pageY: number;
};

export interface PopoverProps extends ViewProps {
  children: [ReactElement<PopoverTriggerProps>, ReactElement<PopoverContentProps>];
  position?: 'top' | 'bottom' | 'left' | 'right';
  duration?: number;
  toggleAction?: 'onPress' | 'onLongPress' | 'onPressIn' | 'onPressOut';
  containerStyle?: StyleProp<ViewStyle>;
  wrapperStyle?: StyleProp<ViewStyle>;
  triangleStyle?: StyleProp<ViewStyle>;
  withoutArrow?: boolean;
}

const _Popover: RNFunctionComponent<PopoverProps> = ({
  theme,
  duration = 3000,
  toggleAction = 'onLongPress',
  children: _children,
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
  const [isVisible, setIsVisible] = visibleState;
  const [__, setChildPosition] = childPositionState;
  const childRef = React.useRef<any>(null);
  const child: any = Children.toArray(_children).find(
    (x) => get(x, 'type.displayName', get(x, 'type.name', '')) === 'Popover.Trigger'
  );
  const children = child.props.children;
  const watchRef: any = useRef();

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

  const onChildPosition = useCallback(() => {
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
        setChildPosition((prev) => {
          if (prev.pageX !== pageX || prev.pageY !== pageY) {
            return {
              ...prev,
              ...layout,
            };
          }
          return prev;
        });
      }
    );
  }, [childRef.current]);

  const handleOnPress = useCallback(
    (ev: any) => {
      onChildPosition();
      open();
      if (!!children.props[toggleAction]) {
        children.props[toggleAction]?.(ev);
      }
    },
    [children]
  );

  const watchPosition = useCallback(() => {
    if (isVisible) {
      watchRef.current = setTimeout(() => {
        onChildPosition();
        watchPosition();
      }, 10);
    }
  }, [isVisible]);

  useEffect(() => {
    if (isVisible) {
      watchPosition();
    } else {
      clearTimeout(watchRef.current);
    }

    return () => {
      if (isVisible) {
        close();
        clearTimeout(watchRef.current);
      }
    };
  }, [isVisible]);

  const finalWrapperStyle = StyleSheet.flatten([
    {
      position: 'relative',
      alignItems: 'center',
    },
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
        children={_children}
        style={style}
        theme={theme}
        fadeAnim={fadeAnim}
        visibleState={visibleState}
        childPositionState={childPositionState}
      />
    </>
  );
};

interface IRenderElement extends Partial<PopoverProps> {
  visibleState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  childPositionState: [Layout, React.Dispatch<React.SetStateAction<Layout>>];
  fadeAnim: Animated.Value;
  theme?: ITheme;
}

const RenderElement = ({
  children: _children,
  visibleState,
  childPositionState,
  position = 'top',
  triangleStyle,
  containerStyle,
  fadeAnim,
  style,
  theme,
  withoutArrow = false,
  ...props
}: IRenderElement) => {
  const [isVisible] = visibleState;
  const [childPosition] = childPositionState;
  const id = useRef(uuid()).current;
  const { height, width } = Dimensions.get('screen');
  const [layout, setLayout] = useState({
    height: 0,
    width: 0,
    x: 0,
    y: 0,
  });

  const children: any = Children.toArray(_children).find(
    (x) => get(x, 'type.displayName', get(x, 'type.name', '')) === 'Popover.Content'
  );

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
    theme?.shadow,
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
    theme?.shadow,
    triangleStyle,
  ]);

  if (isVisible) {
    return (
      <Portal hostName="@karf-ui" name={`@karf-ui-popover-${id}`}>
        <View {...props} isAnimated style={finalContainerStyle} onLayout={onTooltipLayout}>
          {!withoutArrow && <View style={finalTriangleStyle} />}
          {children}
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

_Popover.displayName = 'Popover';
export const BasePopover = withConfig(_Popover);
