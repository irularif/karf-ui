import React from 'react';
import { View as NativeView, ViewProps as NativeViewProps } from 'react-native';
import renderNode from '../helpers/renderNode';
import { parseStyle } from '../helpers/style';
import type { RNFunctionComponent } from '../helpers/withTheme';
import withConfig from '../helpers/withTheme';
import { Text } from '../Text';
import { defaultTheme } from '../ThemeProvider/context';

export interface ViewProps extends NativeViewProps {}

export const View: RNFunctionComponent<ViewProps> = withConfig(
  ({ children, style, theme = defaultTheme, ...props }) => {
    const finalStyle = parseStyle([theme.style, style]);

    return (
      <NativeView {...props} style={finalStyle}>
        {React.Children.toArray(children).map((child, index) => (
          <React.Fragment key={index}>
            {typeof child === 'string' ? renderNode(Text, child) : child}
          </React.Fragment>
        ))}
      </NativeView>
    );
  }
);
