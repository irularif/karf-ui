import React, { forwardRef } from 'react';
import {
  ScrollView as NativeScrollView,
  ScrollViewProps as NativeScrollViewProps,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getStyleValue, RNFunctionComponent } from '../helpers';
import withConfig from '../helpers/withConfig';
import { KeyboardView, KeyboardViewProps } from '../KeyboardView';

export interface ScrollViewProps extends NativeScrollViewProps {
  keyboardViewProps?: KeyboardViewProps;
  insetTop?: boolean;
  insetBottom?: boolean;
  stretchContent?: boolean;
}

const _ScrollView: RNFunctionComponent<ScrollViewProps> = forwardRef(
  (
    {
      style,
      keyboardViewProps,
      insetBottom = false,
      insetTop = false,
      stretchContent = true,
      ...props
    },
    ref: React.ForwardedRef<NativeScrollView>
  ) => {
    const inset = useSafeAreaInsets();

    const finalKeyboardStyle = StyleSheet.flatten([
      keyboardViewProps?.style,
      !stretchContent && {
        flexGrow: 0,
        flexShrink: 0,
      },
    ]);

    const finalStyle = StyleSheet.flatten([
      styles.basic,
      style,
      insetTop && {
        paddingTop:
          getStyleValue(style, ['padding', 'paddingVertical', 'paddingTop'], 0) + inset.top,
      },
      insetBottom && {
        paddingBottom:
          getStyleValue(style, ['padding', 'paddingVertical', 'paddingBottom'], 0) + inset.bottom,
      },
      !stretchContent && {
        flexGrow: 0,
        flexShrink: 0,
      },
    ]);

    return (
      <KeyboardView {...keyboardViewProps} style={finalKeyboardStyle}>
        <NativeScrollView {...props} style={finalStyle} ref={ref} />
      </KeyboardView>
    );
  }
);

const styles = StyleSheet.create({
  basic: {
    flexGrow: 1,
    flexShrink: 1,
  },
});

_ScrollView.displayName = 'ScrollView';
export const ScrollView = withConfig(_ScrollView);
