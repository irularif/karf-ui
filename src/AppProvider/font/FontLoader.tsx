import * as Font from 'expo-font';
import { useEffect } from 'react';

import { fonts as libFonts } from '../../../assets/fonts';
import { useApp } from '../context';

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

export const FontLoader = ({ fonts = [] }: FontLoaderProps) => {
  const { updateInitialize } = useApp();

  const prepare = async () => {
    try {
      const _fonts = libFonts.concat(fonts).reduce(
        (prev: any, v: TFont) => ({
          ...prev,
          [`${v.name.replace(/\s/g, '-')}_${v.style}_${v.weight}`]: v.source,
        }),
        {}
      );
      await Font.loadAsync(_fonts);
    } catch (e) {
      console.warn(e);
    } finally {
      updateInitialize('fonts', true);
    }
  };

  useEffect(() => {
    prepare();
  }, []);

  return null;
};
