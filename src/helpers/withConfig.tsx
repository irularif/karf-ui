import { get, merge } from 'lodash';
import React, { forwardRef } from 'react';
import type { Responsive } from '../../types/screen';
import type { ITheme, IThemeContext } from '../../types/theme';
import { useScreen } from '../hooks';
import { defaultTheme, ThemeContext } from '../ThemeProvider/context';

export type ComponentProps<T> = T & {
  theme?: ITheme;
  children?: React.ReactNode;
} & Partial<Responsive<T>>;

export type RNFunctionComponent<T> = React.FunctionComponent<ComponentProps<T>>;

const withConfig = <P extends {}>(
  WrappedComponent: React.ComponentType<P>
): React.FunctionComponent<P> | React.ForwardRefExoticComponent<P> => {
  const name = WrappedComponent.displayName || WrappedComponent.name || 'Component';
  return Object.assign(
    forwardRef((props: any, ref: any) => {
      const { select } = useScreen();

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

              return <WrappedComponent {...newProps} ref={ref} />;
            }

            const { colors, mode, spacing, typography, shadow, styles }: IThemeContext = context;

            const basicTheme = {
              colors,
              mode,
              spacing,
              typography,
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

            return <WrappedComponent {...newProps} ref={ref} />;
          }}
        </ThemeContext.Consumer>
      );
    }),
    { displayName: name }
  );
};

export default withConfig;
