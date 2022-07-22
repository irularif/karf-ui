import React from 'react';
import { View as NativeView, ViewProps as NativeViewProps } from 'react-native';
import renderNode from '../helpers/renderNode';
import { parseStyle } from '../helpers/style';
import type { RNFunctionComponent } from '../helpers/withTheme';
import withTheme from '../helpers/withTheme';
import useScreen from '../hooks/screen';
import type { ResponsiveProps } from '../ScreenProvider/context';
import { Text } from '../Text';
import { defaultTheme } from '../ThemeProvider/context';

export interface ViewProps extends NativeViewProps {}

export const View: RNFunctionComponent<ViewProps> = withTheme(
  ({ children, style, theme = defaultTheme, ...props }) => {
    const { select } = useScreen();
    const responsive: ResponsiveProps = select(props);
    const finalStyle = parseStyle([theme.style, style, responsive?.style]);

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
