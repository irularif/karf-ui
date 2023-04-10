import { BlurView as NativeBlurView, BlurViewProps as NativeBlurViewProps } from 'expo-blur';
import React, { Children, forwardRef } from 'react';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { renderNode } from '../helpers/node';
import { getTextStyle, parseStyle } from '../helpers/style';
import type { RNFunctionComponent } from '../helpers/withConfig';
import withConfig from '../helpers/withConfig';
import { Text } from '../Text';
import { defaultTheme } from '../ThemeProvider/context';

export interface BlurViewProps extends NativeBlurViewProps {
  isAnimated?: boolean;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle | TextStyle>;
}

const _BlurView: RNFunctionComponent<BlurViewProps> = forwardRef(
  ({ children, style, isAnimated, theme = defaultTheme, ...props }, ref) => {
    const finalStyle = parseStyle([style]);
    const finalTextStyle = getTextStyle(finalStyle);

    return (
      // @ts-ignore
      <NativeBlurView {...props} style={finalStyle} ref={ref}>
        {Children.toArray(children).map((child, index) => (
          <React.Fragment key={index.toString()}>
            {typeof child === 'string'
              ? renderNode(Text, child, {
                  style: finalTextStyle,
                })
              : child}
          </React.Fragment>
        ))}
      </NativeBlurView>
    );
  }
);

_BlurView.displayName = 'BlurView';
export const BlurView = withConfig(_BlurView);
