import React, { MutableRefObject, Ref } from 'react';
import { Animated, View as NativeView, ViewProps as NativeViewProps } from 'react-native';
import renderNode from '../helpers/renderNode';
import { parseStyle } from '../helpers/style';
import type { RNFunctionComponent } from '../helpers/withTheme';
import withConfig from '../helpers/withTheme';
import { Text } from '../Text';
import { defaultTheme } from '../ThemeProvider/context';

export interface ViewProps extends NativeViewProps {
  isAnimated?: boolean;
  children?: React.ReactNode;
  innerRef?: MutableRefObject<NativeView | undefined>;
}

export const View: RNFunctionComponent<ViewProps> = withConfig(
  ({ children, style, isAnimated, theme = defaultTheme, innerRef, ...props }) => {
    const finalStyle = parseStyle([theme.style, style]);
    const Component = isAnimated ? Animated.View : NativeView;

    return (
      <Component {...props} style={finalStyle} ref={innerRef}>
        {React.Children.toArray(children).map((child, index) => (
          <React.Fragment key={index}>
            {typeof child === 'string' ? renderNode(Text, child) : child}
          </React.Fragment>
        ))}
      </Component>
    );
  }
);
