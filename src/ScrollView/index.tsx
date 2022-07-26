import React from 'react';
import {
  ScrollViewProps as NativeScrollViewProps,
  ScrollView as NativeScrollView,
  StyleSheet,
} from 'react-native';
import type { RNFunctionComponent } from '../helpers';
import withConfig from '../helpers/withConfig';
import { KeyboardView, KeyboardViewProps } from '../KeyboardView';

export interface ScrollViewProps extends NativeScrollViewProps {
  keyboardViewProps?: KeyboardViewProps;
}

export const ScrollView: RNFunctionComponent<ScrollViewProps> = withConfig(
  ({ style, keyboardViewProps, ...props }) => {
    const finalStyle = StyleSheet.flatten([style]);

    return (
      <KeyboardView {...keyboardViewProps}>
        <NativeScrollView {...props} style={finalStyle} />
      </KeyboardView>
    );
  }
);
