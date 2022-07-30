import { get, merge } from 'lodash';
import React from 'react';
import { useScreen } from '../hooks';
import type { Responsive } from '../ScreenProvider/context';
import { defaultTheme, ITheme, IThemeContext, ThemeContext } from '../ThemeProvider/context';

export type RNFunctionComponent<T> = React.FunctionComponent<
  T & {
    theme?: ITheme;
    children?: React.ReactNode | undefined;
  } & Partial<Responsive<T>>
>;

function withConfig<P extends unknown>(
  WrappedComponent: React.ComponentType<P>
): React.FunctionComponent<P> | React.ForwardRefExoticComponent<P> {
  const name = WrappedComponent.displayName || WrappedComponent.name || 'Component';

  return Object.assign(
    (props: any) => {
      const { size, select } = useScreen();

      return (
        <ThemeContext.Consumer>
          {(context) => {
            const responsive = select(props);
            if (!context) {
              const newProps = merge(
                {
                  ...props,
                },
                {
                  theme: defaultTheme,
                },
                responsive
              );

              return <WrappedComponent {...newProps} />;
            }

            const { colors, mode, spacing, font, shadow, styles }: IThemeContext = context;

            const basicTheme = {
              colors,
              mode,
              spacing,
              font,
              shadow,
            };
            const styleProps = get(styles, name, {});

            const newProps = merge(
              {
                ...props,
              },
              styleProps,
              { theme: basicTheme },
              props,
              responsive
            );

            return <WrappedComponent {...newProps} />;
          }}
        </ThemeContext.Consumer>
      );
    },
    { displayName: name }
  );
}

export default withConfig;
