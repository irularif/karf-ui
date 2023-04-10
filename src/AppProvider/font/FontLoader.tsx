import * as Font from 'expo-font';
import { useEffect } from 'react';

import { fonts as libFonts } from '../../../assets/fonts';
import type { FontLoaderProps, TFont } from '../../../types/font';
import { useApp } from '../../hooks/app';

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
