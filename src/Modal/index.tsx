import { Portal } from '@gorhom/portal';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Platform,
  StyleSheet,
  TouchableOpacity,
  ViewProps,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getStyleValue, RNFunctionComponent } from '../helpers';
import withConfig from '../helpers/withConfig';
import { useKeyboard } from '../hooks';
import { View } from '../View';

const { height } = Dimensions.get('window');

export interface ModalProps extends ViewProps {
  id: string;
  isOpen: boolean;
  isBlocking?: boolean;
  onDismiss?: () => void;
  containerProps?: Partial<ViewProps>;
  contentContainerProps?: Partial<ViewProps>;
  children?: React.ReactNode;
  position?: 'top' | 'bottom' | 'center' | 'full';
}

const _Modal: RNFunctionComponent<ModalProps> = ({
  id,
  containerProps,
  contentContainerProps,
  isOpen,
  isBlocking,
  onDismiss,
  position = 'center',
  style,
  theme,
  children,
  ...props
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const keyboardAnim = useRef(new Animated.Value(0)).current;
  const inset = useSafeAreaInsets();
  const [visible, setVisible] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const { isVisible: isVisibleKeyboard, height: keyboardHeight } = useKeyboard();

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

  useEffect(() => {
    if (isVisibleKeyboard) {
      Animated.spring(keyboardAnim, {
        toValue: 1,
        useNativeDriver: false,
        bounciness: 0,
      }).start();
    } else {
      Animated.spring(keyboardAnim, {
        toValue: 0,
        useNativeDriver: false,
        overshootClamping: true,
      }).start();
    }
  }, [isVisibleKeyboard]);

  const finalContainerStyle = StyleSheet.flatten([
    style,
    containerProps?.style,
    styles.container,
    stylesContent[position],
    Platform.select({
      ios: {
        paddingBottom: keyboardAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, keyboardHeight],
        }),
      },
    }),
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
    {
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
    },
    position === 'top' && {
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
      paddingTop:
        getStyleValue(contentContainerProps, ['padding', 'paddingVertical', 'paddingTop'], 0) +
        inset.top,
      transform: [
        {
          translateY: fadeAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [-100, 0],
          }),
        },
      ],
    },
    position === 'bottom' && {
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      paddingBottom:
        getStyleValue(contentContainerProps, ['padding', 'paddingVertical', 'paddingBottom'], 0) +
        inset.bottom,
      transform: [
        {
          translateY: fadeAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [100, 0],
          }),
        },
      ],
    },
    position === 'full' && {
      height: '100%',
      paddingTop:
        getStyleValue(contentContainerProps, ['padding', 'paddingVertical', 'paddingTop'], 0) +
        inset.top,
      transform: [
        {
          translateY: fadeAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [height / 2, 0],
          }),
        },
      ],
    },
  ]);

  const Background = Animated.createAnimatedComponent(TouchableOpacity);

  if (!visible) {
    return null;
  }

  return (
    <Portal hostName="@karf-ui" name={`@karf-ui-modal-${id}`}>
      {/* @ts-ignore */}
      <View {...props} isAnimated style={finalContainerStyle} pointerEvents="box-none">
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
};

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

_Modal.displayName = 'Modal';
export const Modal = withConfig(_Modal);
