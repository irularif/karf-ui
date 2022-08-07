import { Portal } from '@gorhom/portal';
import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  Dimensions,
  Platform,
  StyleSheet,
  TouchableOpacity,
  ViewProps,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { v4 as uuid } from 'uuid';
import { getStyleValue, RNFunctionComponent } from '../helpers';
import withConfig from '../helpers/withConfig';
import { useKeyboard } from '../hooks';
import { useModal, useModalState } from '../hooks/modal';
import { View } from '../View';

const { height } = Dimensions.get('window');

export type ModalMethods = {
  toggleModal: () => void;
};

export interface ModalProps extends ViewProps {
  id?: string;
  isOpen?: boolean;
  isBlocking?: boolean;
  onDismiss?: () => void;
  containerProps?: Partial<ViewProps>;
  contentContainerProps?: Partial<ViewProps>;
  children?: React.ReactNode;
  position?: 'top' | 'bottom' | 'center' | 'full';
  insetTop?: boolean;
  insetBottom?: boolean;
  ref?: React.Ref<ModalMethods>;
}

const _Modal: RNFunctionComponent<ModalProps> = forwardRef(
  (
    {
      id: id,
      containerProps,
      contentContainerProps,
      isOpen: isOpen,
      isBlocking,
      onDismiss,
      position = 'center',
      insetTop = false,
      insetBottom = false,
      style,
      theme,
      children,
      ...props
    },
    ref
  ) => {
    const _id = useRef(id || uuid()).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const keyboardAnim = useRef(new Animated.Value(0)).current;
    const inset = useSafeAreaInsets();
    const [visible, setVisible] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const { isVisible: isVisibleKeyboard, height: keyboardHeight } = useKeyboard();
    const { isOpen: _isOpen, setIsOpen } = useModal(_id);
    const { addUpdateState, deleteState } = useModalState();

    const open = useCallback(() => {
      setVisible(true);
      setIsReady(true);
      Animated.spring(fadeAnim, {
        toValue: 1,
        useNativeDriver: true,
        bounciness: 0,
      }).start();
    }, [fadeAnim]);

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
          if (id && _isOpen) {
            setIsOpen(false);
          }
        }
      });
    }, [fadeAnim, onDismiss, _isOpen]);

    const _insetBottom = useMemo(() => {
      return isVisibleKeyboard ? false : insetBottom;
    }, [insetBottom, isVisibleKeyboard]);

    const forwardRef = useCallback(
      () => ({
        toggleModal: () => {
          if (!visible) {
            open();
          } else {
            close();
          }
        },
      }),
      []
    );

    useImperativeHandle(ref, forwardRef, []);

    useEffect(() => {
      if (id) {
        addUpdateState({
          id: id,
          isOpen: false,
        });
      }

      return () => {
        if (id) {
          deleteState(id);
        }
      };
    }, []);

    useEffect(() => {
      if (_isOpen || isOpen) {
        open();
      } else if (!!isReady && (!_isOpen || !isOpen)) {
        close();
      }
    }, [_isOpen, isOpen]);

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
      {
        top: {
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          transform: [
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-100, 0],
              }),
            },
          ],
        },
        bottom: {
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          transform: [
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [100, 0],
              }),
            },
          ],
        },
        full: {
          borderRadius: 0,
          height: '100%',
          transform: [
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [height / 2, 0],
              }),
            },
          ],
        },
        center: {
          maxWidth: '80%',
        },
      }[position],
      insetTop && {
        paddingTop:
          getStyleValue(contentContainerProps, ['padding', 'paddingVertical', 'paddingTop'], 0) +
          inset.top,
      },
      _insetBottom && {
        paddingBottom:
          getStyleValue(contentContainerProps, ['padding', 'paddingVertical', 'paddingBottom'], 0) +
          inset.bottom,
      },
    ]);
    const Background = Animated.createAnimatedComponent(TouchableOpacity);

    if (!visible) {
      return null;
    }

    return (
      <Portal hostName="@karf-ui" name={`@karf-ui-modal-${_id}`}>
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

_Modal.displayName = 'Modal';
export const Modal = withConfig(memo(_Modal));
