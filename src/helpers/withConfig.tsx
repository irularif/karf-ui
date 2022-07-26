import { get, merge } from 'lodash';
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
      const { children, ...rest } = props;
      const { size, select } = useScreen();

      return (
        <ThemeContext.Consumer>
          {(context) => {
            const responsive = select(rest);
            if (!context) {
              const style = merge({}, rest.style, responsive?.style);

              const newProps = {
                key: size,
                ...rest,
                ...responsive,
                theme: defaultTheme,
                style,
                children,
              };

              return <WrappedComponent {...newProps} />;
            }

            const { colors, mode, spacing, font, shadow, styles }: IThemeContext = context;

            const basicStyle = get(styles, 'displayName', {});
            const basicTheme = {
              colors,
              mode,
              spacing,
              font,
              shadow,
              style: basicStyle,
            };
            const theme = merge({}, basicTheme, rest.theme, responsive?.theme);
            const style = merge({}, basicStyle, rest.style, responsive?.style);

            const newProps = {
              key: size,
              ...rest,
              ...responsive,
              style,
              theme,
              children,
            };

            return <WrappedComponent {...newProps} />;
          }}
        </ThemeContext.Consumer>
      );
    },
    { displayName: name }
  );
}

export default withConfig;
