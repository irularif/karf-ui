import { TextProps as NativeTextProps } from 'react-native';
import type { RNFunctionComponent } from '../helpers/withTheme';
declare type Headings = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
export interface TextProps extends NativeTextProps {
    heading?: Headings;
}
export declare const Text: RNFunctionComponent<TextProps>;
export {};
