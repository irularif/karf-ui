export type TFont = {
  name: string;
  weight: '300' | '400' | '500' | '600' | '700' | '800';
  source: NodeRequire;
  style: 'normal' | 'italic';
};

export type TFonts = Array<TFont>;

export interface FontLoaderProps {
  fonts?: TFonts;
}
