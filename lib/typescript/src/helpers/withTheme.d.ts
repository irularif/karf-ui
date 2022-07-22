/// <reference types="react" />
import type { Responsive } from '../ScreenProvider/context';
import { ITheme } from '../ThemeProvider/context';
export declare type RNFunctionComponent<T> = React.FC<T & {
    theme?: ITheme;
} & Partial<Responsive>>;
declare function withTheme<P = {}>(WrappedComponent: React.ComponentType<P>): React.FunctionComponent<P>;
export default withTheme;
