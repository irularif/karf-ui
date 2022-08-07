import React from 'react';
import {
  KeyboardAvoidingView,
  KeyboardAvoidingViewProps,
  Platform,
  StyleSheet,
} from 'react-native';
import type { RNFunctionComponent } from '../helpers';
import withConfig from '../helpers/withConfig';

export interface KeyboardViewProps extends KeyboardAvoidingViewProps {}

const _KeyboardView: RNFunctionComponent<KeyboardViewProps> = ({ style, ...props }) => {
  const finalStyle = StyleSheet.flatten([styles.basic, style]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({
        ios: 'padding',
        android: 'height',
      })}
      {...props}
      style={finalStyle}
    />
  );
};

const styles = StyleSheet.create({
  basic: {
    flexGrow: 1,
    flexShrink: 1,
  },
});

_KeyboardView.displayName = 'KeyboardView';
export const KeyboardView = withConfig(_KeyboardView);
