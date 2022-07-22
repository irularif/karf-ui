import { get, merge } from 'lodash';
import type { Responsive } from '../ScreenProvider/context';
import { defaultTheme, ITheme, IThemeContext, ThemeContext } from '../ThemeProvider/context';

export type RNFunctionComponent<T> = React.FC<
  T & {
    theme?: ITheme;
  } & Partial<Responsive>
>;

const ThemedComponent = (WrappedComponent: any, displayName?: string) => {
  return Object.assign(
    (props: any) => {
      const { children, ...rest } = props;

      return (
        <ThemeContext.Consumer>
          {(context) => {
            // If user isn't using ThemeProvider
            if (!context) {
              const newProps = {
                ...rest,
                theme: defaultTheme,
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
            const theme = merge({}, basicTheme, rest.theme);

            const newProps = {
              ...rest,
              theme,
              children,
            };

            return <WrappedComponent {...newProps} />;
          }}
        </ThemeContext.Consumer>
      );
    },
    { displayName: displayName }
  );
};

function withTheme<P = {}>(WrappedComponent: React.ComponentType<P>): React.FunctionComponent<P> {
  const name = WrappedComponent.displayName || WrappedComponent.name || 'Component';

  const Component = ThemedComponent(WrappedComponent, name);

  return Component;
}

export default withTheme;
