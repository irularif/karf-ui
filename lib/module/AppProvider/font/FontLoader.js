import * as Font from 'expo-font';
import { useEffect } from 'react';
import { fonts as libFonts } from '../../../assets/fonts';
import { useApp } from '../context';
export const FontLoader = _ref => {
  let {
    fonts = []
  } = _ref;
  const {
    updateInitialize
  } = useApp();

  const prepare = async () => {
    try {
      const _fonts = libFonts.concat(fonts).reduce((prev, v) => ({ ...prev,
        [`${v.name.replace(/\s/g, '-')}_${v.style}_${v.weight}`]: v.source
      }), {});

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
//# sourceMappingURL=FontLoader.js.map