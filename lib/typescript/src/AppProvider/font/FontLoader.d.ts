/// <reference types="node" />
/// <reference types="react-native" />
export declare type TFont = {
    name: string;
    weight: '300' | '400' | '500' | '600' | '700' | '800';
    source: NodeRequire;
    style: 'normal' | 'italic';
};
export declare type TFonts = Array<TFont>;
export interface FontLoaderProps {
    fonts?: TFonts;
}
export declare const FontLoader: ({ fonts }: FontLoaderProps) => null;
