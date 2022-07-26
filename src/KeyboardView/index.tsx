import React from 'react';
import { KeyboardAvoidingView, KeyboardAvoidingViewProps, StyleSheet } from 'react-native';
import type { RNFunctionComponent } from '../helpers';
import withConfig from '../helpers/withConfig';

export interface KeyboardViewProps extends KeyboardAvoidingViewProps {}

export const KeyboardView: RNFunctionComponent<KeyboardViewProps> = withConfig(
  ({ style, ...props }) => {
    const finalStyle = StyleSheet.flatten([styles.basic, style]);

    return <KeyboardAvoidingView behavior="height" {...props} style={finalStyle} />;
  }
);

const styles = StyleSheet.create({
  basic: {
    flexGrow: 1,
    flexShrink: 1,
  },
});
