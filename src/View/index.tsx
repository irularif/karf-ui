import React, { Children, forwardRef } from 'react';
import {
  Animated,
  StyleProp,
  TextStyle,
  View as NativeView,
  ViewProps as NativeViewProps,
  ViewStyle,
} from 'react-native';
import { renderNode } from '../helpers/node';
import { getTextStyle, parseStyle } from '../helpers/style';
import type { RNFunctionComponent } from '../helpers/withConfig';
import withConfig from '../helpers/withConfig';
import { Text } from '../Text';
import { defaultTheme } from '../ThemeProvider/context';

export interface ViewProps extends NativeViewProps {
  isAnimated?: boolean;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle | TextStyle>;
}

const _View: RNFunctionComponent<ViewProps> = forwardRef(
  ({ children, style, isAnimated, theme = defaultTheme, ...props }, ref) => {
    const finalStyle = parseStyle([theme.style, style]);
    const finalTextStyle = getTextStyle(finalStyle);
    const Component = isAnimated ? Animated.View : NativeView;

    return (
      <Component {...props} style={finalStyle} ref={ref}>
        {Children.toArray(children).map((child, index) => (
          <React.Fragment key={index.toString()}>
            {typeof child === 'string'
              ? renderNode(Text, child, {
                  style: finalTextStyle,
                })
              : child}
          </React.Fragment>
        ))}
      </Component>
    );
  }
);

_View.displayName = 'View';
export const View = withConfig(_View);
