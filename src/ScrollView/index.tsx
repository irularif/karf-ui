import React from 'react';
import {
  ScrollView as NativeScrollView, ScrollViewProps as NativeScrollViewProps, StyleSheet
} from 'react-native';
import type { RNFunctionComponent } from '../helpers';
import withConfig from '../helpers/withConfig';
import { KeyboardView, KeyboardViewProps } from '../KeyboardView';

export interface ScrollViewProps extends NativeScrollViewProps {
  keyboardViewProps?: KeyboardViewProps;
}

const _ScrollView: RNFunctionComponent<ScrollViewProps> = ({
  style,
  keyboardViewProps,
  ...props
}) => {
  const finalStyle = StyleSheet.flatten([style]);

  return (
    <KeyboardView {...keyboardViewProps}>
      <NativeScrollView {...props} style={finalStyle} />
    </KeyboardView>
  );
};

_ScrollView.displayName = 'ScrollView';
export const ScrollView = withConfig(_ScrollView);
