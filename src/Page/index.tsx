import { useFocusEffect } from '@react-navigation/native';
import { merge } from 'lodash';
import React, { useCallback, useMemo } from 'react';
import { StatusBar, StatusBarProps, StyleSheet } from 'react-native';
import { parseStyle } from '../helpers/style';
import type { RNFunctionComponent } from '../helpers/withTheme';
import withConfig from '../helpers/withTheme';
import useTheme from '../hooks/theme';
import { defaultTheme } from '../ThemeProvider/context';
import { View, ViewProps } from '../View';

export interface PageProps extends ViewProps {
  statusBar?: StatusBarProps;
}

export const Page: RNFunctionComponent<PageProps> = withConfig(
  ({ style, theme = defaultTheme, statusBar, ...props }) => {
    const { selectTheme } = useTheme();
    const finalStyle = parseStyle([
      {
        backgroundColor: theme.colors.background,
      },
      styles.basic,
      theme.style,
      style,
    ]);

    const finalStatusBar = useMemo(() => {
      return merge(
        {
          translucent: true,
          barStyle: selectTheme({
            light: 'dark-content',
            dark: 'light-content',
          }),
          backgroundColor: 'transparent',
        },
        statusBar
      );
    }, [statusBar, selectTheme]);

    useFocusEffect(
      useCallback(() => {
        StatusBar.setBarStyle(finalStatusBar.barStyle);
      }, [])
    );

    return (
      <>
        <StatusBar {...finalStatusBar} />
        <View {...props} style={finalStyle} />
      </>
    );
  }
);

const styles = StyleSheet.create({
  basic: {
    flexGrow: 1,
    flexShrink: 1,
  },
});
