import { Portal } from '@gorhom/portal';
import { get } from 'lodash';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Animated, Dimensions, Pressable, StyleSheet } from 'react-native';
import { v4 as uuid } from 'uuid';
import { RNFunctionComponent, trimStyle } from '../helpers';
import renderNode from '../helpers/renderNode';
import withConfig from '../helpers/withConfig';
import { Text } from '../Text';
import { View, ViewProps } from '../View';

const { height, width } = Dimensions.get('window');

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
  text?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  duration?: number;
  toggleAction?: 'onPress' | 'onLongPress' | 'onPressIn' | 'onPressOut';
}

const _Tooltip: RNFunctionComponent<TooltipProps> = ({
  text,
  theme,
  position = 'top',
  duration = 3000,
  toggleAction = 'onLongPress',
  children,
  ...props
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [isVisible, setIsVisible] = React.useState(false);
  const id = useRef(uuid()).current;
  const [childPosition, setChildPosition] = React.useState<Layout>({
    height: 0,
    width: 0,
    x: 0,
    y: 0,
    pageX: 0,
    pageY: 0,
  });
  const [layout, setLayout] = useState({
    height: 0,
    width: 0,
    x: 0,
    y: 0,
  });
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

  const onTooltipLayout = useCallback((ev: any) => {
    setLayout(ev.nativeEvent.layout);
  }, []);

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
    let style = {};
    let _position = positionAvailability;
    switch (_position) {
      case 'top':
        style = {
          bottom: height - childPosition.pageY,
          left: childPosition.pageX + childPosition.width / 2 - layout.width / 2,
          flexDirection: 'column-reverse',
          borderTopColor: theme?.colors.black,
        };
        break;
      case 'bottom':
        style = {
          top: childPosition.pageY + childPosition.height,
          left: childPosition.pageX + childPosition.width / 2 - layout.width / 2,
          flexDirection: 'column',
          borderBottomColor: theme?.colors.black,
        };
        break;
      case 'left':
        style = {
          top: childPosition.pageY + childPosition.height / 2 - layout.height / 2,
          right: width - childPosition.pageX,
          flexDirection: 'row-reverse',
          borderLeftColor: theme?.colors.black,
        };
        break;
      case 'right':
        style = {
          top: childPosition.pageY + childPosition.height / 2 - layout.height / 2,
          left: childPosition.pageX + childPosition.width,
          flexDirection: 'row',
          borderRightColor: theme?.colors.black,
        };
    }
    return style;
  }, [positionAvailability, childPosition, layout]);

  const finalContainerStyle = StyleSheet.flatten([
    styles.container,
    positionStyle,
    {
      opacity: fadeAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      }),
    },
  ]);

  const finalTriangleStyle = StyleSheet.flatten([styles.triangle, styles[positionAvailability]]);

  const finalTextStyle = StyleSheet.flatten([
    styles.text,
    {
      backgroundColor: theme?.colors.black,
      color: theme?.colors.white,
    },
  ]);

  const style = trimStyle(children.props.style, ['backgroundColor', 'color']);

  return (
    <>
      <Pressable
        ref={forwardRef}
        onLayout={onLayout}
        delayLongPress={250}
        {...{ [toggleAction]: handleOnPress }}
        style={style}
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
      {isVisible && (
        <Portal hostName="@karf-ui" name={`@karf-ui-tooltip-${id}`}>
          <View {...props} isAnimated style={finalContainerStyle} onLayout={onTooltipLayout}>
            <View style={finalTriangleStyle} />
            <Text style={finalTextStyle}>{text}</Text>
          </View>
        </Portal>
      )}
    </>
  );
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
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderRadius: 2,
  },
  top: {
    marginTop: -2,
    borderTopWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 0,
    borderLeftWidth: 8,
    borderRightColor: 'transparent',
    borderLeftColor: 'transparent',
  },
  bottom: {
    marginBottom: -2,
    borderTopWidth: 0,
    borderRightWidth: 8,
    borderBottomWidth: 8,
    borderLeftWidth: 8,
    borderRightColor: 'transparent',
    borderLeftColor: 'transparent',
  },
  left: {
    marginLeft: -2,
    borderBottomWidth: 8,
    borderRightWidth: 0,
    borderTopWidth: 8,
    borderLeftWidth: 8,
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
  },
  right: {
    marginRight: -2,
    borderBottomWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderLeftWidth: 0,
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
  },
});

_Tooltip.displayName = 'Tooltip';
export const Tooltip = withConfig(_Tooltip);
