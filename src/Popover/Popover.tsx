import { Portal } from '@gorhom/portal';
import Color from 'color';
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
import {
  Animated,
  Dimensions,
  Pressable,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { v4 as uuid } from 'uuid';
import type { ITheme } from '../../types/theme';
import { getStyleValue, RNFunctionComponent, trimStyle } from '../helpers';
import { renderNode } from '../helpers/node';
import withConfig from '../helpers/withConfig';
import { Text } from '../Text';
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
  isOpen?: boolean;
  onIsOpenChanged?: (isOpen: boolean) => void;
  children: [ReactElement<PopoverTriggerProps>, ReactElement<PopoverContentProps>];
  position?: 'top' | 'bottom' | 'left' | 'right';
  toggleAction?: 'onPress' | 'onLongPress' | 'onPressIn' | 'onPressOut';
  containerStyle?: StyleProp<ViewStyle>;
  wrapperStyle?: StyleProp<ViewStyle>;
  triangleStyle?: StyleProp<ViewStyle>;
  withoutArrow?: boolean;
  withoutBackdrop?: boolean;
  withoutShadow?: boolean;
}

const _Popover: RNFunctionComponent<PopoverProps> = ({
  theme,
  toggleAction = 'onLongPress',
  children: _children,
  style,
  wrapperStyle,
  isOpen = false,
  onIsOpenChanged,
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
    (x: any) => get(x, 'type.displayName', get(x, 'type.name', '')) === 'Popover.Trigger'
  );
  const children = child?.props?.children;
  const watchRef: any = useRef();

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

  const open = useCallback(() => {
    setIsVisible(true);
    Animated.spring(fadeAnim, {
      toValue: 1,
      useNativeDriver: true,
      bounciness: 0,
      delay: 100,
    }).start();
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
  }, [childRef.current, children]);

  const watchPosition = useCallback(() => {
    if (isVisible) {
      watchRef.current = setTimeout(() => {
        onChildPosition();
        watchPosition();
      }, 10);
    }
  }, [isVisible]);

  const handleOnPress = useCallback(
    (ev: any) => {
      console.log(child.props.children.props);
      onChildPosition();
      open();
      if (!!child.props[toggleAction]) {
        child.props[toggleAction]?.(ev);
      }
    },
    [child]
  );

  useEffect(() => {
    if (!!onIsOpenChanged) {
      onIsOpenChanged(isVisible);
    }
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

  useEffect(() => {
    setIsVisible((prev) => (prev != isOpen ? isOpen : prev));
  }, [isOpen]);

  const isChildButton = ['Button', 'TouchableOpacity', 'Pressable'].includes(
    get(child, 'props.children.type.displayName', get(child, 'props.children.type.name', ''))
  );
  const Component = isChildButton ? child.props.children.type : Pressable;

  const childProps = get(child, 'props.children.props', {});

  const pressableProps = Object.assign(
    {},
    isChildButton
      ? childProps
      : {
          children: child.props.children,
        }
  );

  const finalWrapperStyle = StyleSheet.flatten([
    styles.wrapper,
    trimStyle(get(children, 'props.style', {}), [
      'backgroundColor',
      'padding',
      'paddingHorizontal',
      'paddingVertical',
      'paddingTop',
      'paddingBottom',
      'paddingLeft',
      'paddingRight',
    ]),
    wrapperStyle,
  ]);

  return (
    <>
      <Component
        {...pressableProps}
        ref={forwardRef}
        delayLongPress={250}
        style={finalWrapperStyle}
        {...{ [toggleAction]: handleOnPress }}
      />
      <RenderContent
        {...props}
        children={_children}
        style={style}
        theme={theme}
        fadeAnim={fadeAnim}
        visibleState={visibleState}
        childPositionState={childPositionState}
        close={close}
      />
    </>
  );
};

interface IRenderContent extends Partial<PopoverProps> {
  visibleState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  childPositionState: [Layout, React.Dispatch<React.SetStateAction<Layout>>];
  fadeAnim: Animated.Value;
  theme?: ITheme;
  close: () => void;
}

const RenderContent = ({
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
  withoutBackdrop = false,
  withoutShadow = false,
  close,
  ...props
}: IRenderContent) => {
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

  const child: any = Children.toArray(_children).find(
    (x: any) => get(x, 'type.displayName', get(x, 'type.name', '')) === 'Popover.Content'
  );
  const children = child?.props?.children;

  const onTooltipLayout = useCallback((ev: any) => {
    setLayout(ev.nativeEvent.layout);
  }, []);

  const positionAvailability = useMemo(() => {
    let _position = position;
    switch (position) {
      case 'top':
        if (childPosition.pageY - layout.height - 2 - layout.height < 0) {
          _position = 'bottom';
        }
        break;
      case 'bottom':
        if (childPosition.pageY + childPosition.height + 2 + layout.height > height) {
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
          top: childPosition.pageY - layout.height - 2,
          left: Math.max(0, childPosition.pageX + childPosition.width / 2 - layout.width / 2),
          flexDirection: 'column-reverse',
          borderTopColor: get(style, 'backgroundColor', theme?.colors.black),
        };
        break;
      case 'bottom':
        _style = {
          top: childPosition.pageY + childPosition.height + 2,
          left: Math.max(0, childPosition.pageX + childPosition.width / 2 - layout.width / 2),
          flexDirection: 'column',
          borderBottomColor: get(style, 'backgroundColor', theme?.colors.black),
        };
        break;
      case 'left':
        _style = {
          top: childPosition.pageY + childPosition.height / 2 - layout.height / 2,
          left: childPosition.pageX - 2 - layout.width,
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
    !withoutShadow && theme?.shadow,
    containerStyle,
    positionStyle,
    {
      opacity: fadeAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      }),
    },
  ]);

  const bg = getStyleValue(
    StyleSheet.flatten(get(children, 'props.style', {})),
    ['backgroundColor'],
    getStyleValue(style, ['backgroundColor'], theme?.colors.white)
  );
  const finalTriangleStyle = StyleSheet.flatten([
    styles.triangle,
    styles[positionAvailability],
    {
      borderColor: bg || get(style, 'backgroundColor', theme?.colors.black),
    },
    !withoutShadow && theme?.shadow,
    triangleStyle,
  ]);
  const finalTextStyle = StyleSheet.flatten([
    styles.text,
    {
      backgroundColor: bg,
      color: Color(bg).isDark() ? theme?.colors.white : theme?.colors.black,
    },
  ]);
  const finalContainerButtonStyle = StyleSheet.flatten([
    styles.containerButton,
    {
      opacity: fadeAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      }),
    },
  ]);
  if (isVisible) {
    const Background = Animated.createAnimatedComponent(TouchableOpacity);
    return (
      <Portal hostName="@karf-ui" name={`@karf-ui-popover-${id}`}>
        {!withoutBackdrop && (
          <Background activeOpacity={1} style={finalContainerButtonStyle} onPress={close} />
        )}
        <View {...props} isAnimated style={finalContainerStyle} onLayout={onTooltipLayout}>
          {!withoutArrow && <View style={finalTriangleStyle} />}
          {typeof children === 'string'
            ? renderNode(Text, children, {
                style: finalTextStyle,
              })
            : renderNode(children?.type, children?.props)}
        </View>
      </Portal>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
  },
  container: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerButton: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
    borderTopWidth: 16,
    borderRightWidth: 16,
    borderBottomWidth: 0,
    borderLeftWidth: 16,
    borderRightColor: 'transparent',
    borderLeftColor: 'transparent',
  },
  bottom: {
    marginBottom: -1,
    borderTopWidth: 0,
    borderRightWidth: 16,
    borderBottomWidth: 16,
    borderLeftWidth: 16,
    borderRightColor: 'transparent',
    borderLeftColor: 'transparent',
  },
  left: {
    marginLeft: -1,
    borderBottomWidth: 16,
    borderRightWidth: 0,
    borderTopWidth: 16,
    borderLeftWidth: 16,
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
  },
  right: {
    marginRight: -1,
    borderBottomWidth: 16,
    borderRightWidth: 16,
    borderTopWidth: 16,
    borderLeftWidth: 0,
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
    borderLeftColor: 'transparent',
  },
});

_Popover.displayName = 'Popover';
export const BasePopover = withConfig(_Popover);
