import { Portal } from '@gorhom/portal';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions } from 'react-native';
import { Animated, StyleSheet, TouchableOpacity, ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getStyleValue, RNFunctionComponent } from '../helpers';
import withConfig from '../helpers/withTheme';
import { View } from '../View';

const { height } = Dimensions.get('window');

export interface ModalProps {
  id: string;
  isOpen: boolean;
  isBlocking?: boolean;
  onDismiss?: () => void;
  containerProps?: Partial<ViewProps>;
  contentContainerProps?: Partial<ViewProps>;
  children?: React.ReactNode;
  position?: 'top' | 'bottom' | 'center' | 'full';
}

export const Modal: RNFunctionComponent<ModalProps> = withConfig(
  ({
    id,
    containerProps,
    contentContainerProps,
    isOpen,
    isBlocking,
    onDismiss,
    position = 'center',
    theme,
    children,
  }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const inset = useSafeAreaInsets();
    const [visible, setVisible] = useState(false);
    const [isReady, setIsReady] = useState(false);

    const open = useCallback(() => {
      setVisible(true);
      setIsReady(true);
      Animated.spring(fadeAnim, {
        toValue: 1,
        useNativeDriver: true,
        bounciness: position === 'center' ? 10 : 0,
      }).start();
    }, [fadeAnim, position]);

    const close = useCallback(() => {
      setIsReady(false);
      Animated.spring(fadeAnim, {
        toValue: 0,
        useNativeDriver: true,
        overshootClamping: true,
      }).start(({ finished }) => {
        if (finished) {
          setVisible(false);
          onDismiss && onDismiss();
        }
      });
    }, [onDismiss]);

    useEffect(() => {
      if (isOpen) {
        open();
      } else {
        close();
      }
    }, [isOpen]);

    const contentContainerStyle = useMemo(() => {
      let style: any = {
        opacity: fadeAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
        }),
        transform: [
          {
            translateY: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [100, 0],
            }),
          },
        ],
      };
      switch (position) {
        case 'top':
          style = {
            paddingTop:
              (getStyleValue(contentContainerProps, ['padding', 'paddingVertical', 'paddingTop']) ||
                0) + inset.top,
            transform: [
              {
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-100, 0],
                }),
              },
            ],
          };
          break;
        case 'bottom':
          style = {
            paddingBottom:
              (getStyleValue(contentContainerProps, [
                'padding',
                'paddingVertical',
                'paddingBottom',
              ]) || 0) + inset.bottom,
            transform: [
              {
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [100, 0],
                }),
              },
            ],
          };
          break;
        case 'full':
          style = {
            height: '100%',
            paddingTop:
              (getStyleValue(contentContainerProps, ['padding', 'paddingVertical', 'paddingTop']) ||
                0) + inset.top,
            transform: [
              {
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [height / 2, 0],
                }),
              },
            ],
          };
          break;
      }
    }, [position]);

    const finalContainerStyle = StyleSheet.flatten([
      containerProps?.style,
      styles.container,
      stylesContent[position],
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
    const finalContentContainerStyle = StyleSheet.flatten([
      styles.contentContainer,
      {
        backgroundColor: theme?.colors.white,
      },
      contentContainerProps?.style,
      contentContainerStyle,
    ]);

    const Background = Animated.createAnimatedComponent(TouchableOpacity);

    if (!visible) {
      return null;
    }

    return (
      <Portal hostName="@karf-ui" name={`@karf-ui-modal-${id}`}>
        <View style={finalContainerStyle} pointerEvents="box-none">
          <Background
            activeOpacity={1}
            style={finalContainerButtonStyle}
            onPress={close}
            disabled={isBlocking || !isReady}
          />
          {/* @ts-ignore */}
          <View isAnimated style={finalContentContainerStyle}>
            {children}
          </View>
        </View>
      </Portal>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
  },
  containerButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  contentContainer: {
    borderRadius: 8,
  },
});

const stylesContent = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  top: {
    justifyContent: 'flex-start',
  },
  bottom: {
    justifyContent: 'flex-end',
  },
  full: {
    justifyContent: 'flex-start',
    height: '100%',
    width: '100%',
  },
});

Modal.displayName = 'Modal';