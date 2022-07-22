import { StatusBarProps } from 'react-native';
import type { RNFunctionComponent } from '../helpers/withTheme';
import { ViewProps } from '../View';
export interface PageProps extends ViewProps {
    statusBar?: StatusBarProps;
}
export declare const Page: RNFunctionComponent<PageProps>;
