import { get, merge } from 'lodash';
import { initialScreen, Responsive, ScreenContext, TScreen } from '../ScreenProvider/context';
import { defaultTheme, ITheme, IThemeContext, ThemeContext } from '../ThemeProvider/context';

export type RNFunctionComponent<T> = React.FC<
  T & {
    theme?: ITheme;
  } & Partial<Responsive<T>>
>;

function withConfig<P = {}>(WrappedComponent: React.ComponentType<P>): React.FunctionComponent<P> {
  const name = WrappedComponent.displayName || WrappedComponent.name || 'Component';

  return Object.assign(
    (props: any) => {
      const { children, ...rest } = props;

      return (
        <ScreenContext.Consumer>
          {(screen) => {
            let { size }: TScreen = screen || initialScreen;

            return (
              <ThemeContext.Consumer>
                {(context) => {
                  const responsive = rest[size];
                  if (!context) {
                    const style = merge({}, rest.style, responsive?.style);

                    const newProps = {
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
          }}
        </ScreenContext.Consumer>
      );
    },
    { displayName: name }
  );
}

export default withConfig;
