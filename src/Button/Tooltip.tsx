import { Portal } from '@gorhom/portal';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Dimensions, StyleSheet } from 'react-native';
import { v4 as uuid } from 'uuid';
import { Text } from '../Text';
import type { ITheme } from '../ThemeProvider/context';
import { View } from '../View';

const { height, width } = Dimensions.get('window');

export interface TooltipProps {
  position?: 'top' | 'bottom' | 'left' | 'right';
  duration?: number;
}

type Layout = {
  height: number;
  width: number;
  x: number;
  y: number;
  pageX: number;
  pageY: number;
};

interface ITooltip extends TooltipProps {
  text?: string;
  theme?: ITheme;
  isTooltipState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  buttonPositionState: [Layout, React.Dispatch<React.SetStateAction<Layout>>];
}

export const Tooltip: React.FC<ITooltip> = ({
  text,
  isTooltipState,
  theme,
  position = 'top',
  buttonPositionState,
  duration = 3000,
  ...props
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [layout, setLayout] = useState({
    height: 0,
    width: 0,
    x: 0,
    y: 0,
  });
  const id = useRef(uuid()).current;
  const [isTooltip, setIsTooltip] = isTooltipState;
  const [buttonPosition] = buttonPositionState;

  const handleOnLayout = useCallback(
    (e: any) => {
      setLayout(e.nativeEvent.layout);
    },
    [setLayout]
  );

  const open = useCallback(() => {
    Animated.spring(fadeAnim, {
      toValue: 1,
      useNativeDriver: true,
      bounciness: 0,
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
        setIsTooltip(false);
      }
    });
  }, []);

  useEffect(() => {
    if (isTooltip) {
      open();
    }
  }, [isTooltip]);

  const positionStyle = useMemo(() => {
    let style = {};
    let _position = position;
    switch (position) {
      case 'top':
        if (height - buttonPosition.pageY - layout.height < 0) {
          _position = 'bottom';
        }
        break;
      case 'bottom':
        if (buttonPosition.pageY + buttonPosition.height + layout.height > height) {
          _position = 'top';
        }
        break;
      case 'left':
        if (buttonPosition.pageX - layout.width < 0) {
          _position = 'right';
        }
        break;
      case 'right':
        if (buttonPosition.pageX + buttonPosition.width + layout.width > width) {
          _position = 'left';
        }
        break;
    }
    switch (_position) {
      case 'top':
        style = {
          bottom: height - buttonPosition.pageY,
          left: buttonPosition.pageX + buttonPosition.width / 2 - layout.width / 2,
          flexDirection: 'column-reverse',
          borderTopColor: theme?.colors.black,
        };
        break;
      case 'bottom':
        style = {
          top: buttonPosition.pageY + buttonPosition.height,
          left: buttonPosition.pageX + buttonPosition.width / 2 - layout.width / 2,
          flexDirection: 'column',
          borderBottomColor: theme?.colors.black,
        };
        break;
      case 'left':
        style = {
          top: buttonPosition.pageY + buttonPosition.height / 2 - layout.height / 2,
          right: width - buttonPosition.pageX,
          flexDirection: 'row-reverse',
          borderLeftColor: theme?.colors.black,
        };
        break;
      case 'right':
        style = {
          top: buttonPosition.pageY + buttonPosition.height / 2 - layout.height / 2,
          left: buttonPosition.pageX + buttonPosition.width,
          flexDirection: 'row',
          borderRightColor: theme?.colors.black,
        };
    }
    return style;
  }, [position, buttonPosition, layout]);

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

  const finalTriangleStyle = StyleSheet.flatten([styles.triangle, styles[position]]);

  const finalTextStyle = StyleSheet.flatten([
    styles.text,
    {
      backgroundColor: theme?.colors.black,
      color: theme?.colors.white,
    },
  ]);

  if (!isTooltip) {
    return null;
  }

  return (
    <Portal hostName="@karf-ui" name={`@karf-ui-tooltip-${id}`}>
      <View {...props} isAnimated style={finalContainerStyle} onLayout={handleOnLayout}>
        <View style={finalTriangleStyle} />
        <Text style={finalTextStyle}>{text}</Text>
      </View>
    </Portal>
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

Tooltip.displayName = 'Button.Tooltip';
