import React, { forwardRef } from 'react';
import {
  Animated,
  StyleSheet,
  Text as NativeText,
  TextProps as NativeTextProps,
} from 'react-native';
import { parseStyle } from '../helpers/style';
import type { RNFunctionComponent } from '../helpers/withConfig';
import withConfig from '../helpers/withConfig';
import { defaultTheme } from '../ThemeProvider/context';

type Headings = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export type TextMethod = {} & NativeText;
export interface TextProps extends NativeTextProps {
  heading?: Headings;
  isAnimated?: boolean;
  ref?: React.ForwardedRef<TextMethod>
}

const _Text: RNFunctionComponent<TextProps> = forwardRef(
  (
    { children, heading, style, theme = defaultTheme, isAnimated = false, ...props },
    ref: React.ForwardedRef<TextMethod>
  ) => {
    const finalStyle = parseStyle(
      {
        color: theme.colors.black,
      },
      styles.basic,
      theme.font,
      theme.style,
      !!heading && styles[heading],
      style
    );

    const Component = isAnimated ? Animated.Text : NativeText;

    return (
      <Component {...props} accessibilityRole="text" style={finalStyle} ref={ref}>
        {children}
      </Component>
    );
  }
);

const styles = StyleSheet.create({
  basic: {
    fontSize: 16,
  },
  h6: {
    fontSize: 18,
    fontWeight: '700',
  },
  h5: {
    fontSize: 20,
    fontWeight: '700',
  },
  h4: {
    fontSize: 25,
    fontWeight: '700',
  },
  h3: {
    fontSize: 31,
    fontWeight: '700',
  },
  h2: {
    fontSize: 40,
    fontWeight: '700',
  },
  h1: {
    fontSize: 48,
    fontWeight: '700',
  },
});

_Text.displayName = 'Text';
export const Text = withConfig(_Text);
