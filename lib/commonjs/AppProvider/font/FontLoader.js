"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FontLoader = void 0;

var Font = _interopRequireWildcard(require("expo-font"));

var _react = require("react");

var _fonts2 = require("../../../assets/fonts");

var _context = require("../context");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const FontLoader = _ref => {
  let {
    fonts = []
  } = _ref;
  const {
    updateInitialize
  } = (0, _context.useApp)();

  const prepare = async () => {
    try {
      const _fonts = _fonts2.fonts.concat(fonts).reduce((prev, v) => ({ ...prev,
        [`${v.name.replace(/\s/g, '-')}_${v.style}_${v.weight}`]: v.source
      }), {});

      await Font.loadAsync(_fonts);
    } catch (e) {
      console.warn(e);
    } finally {
      updateInitialize('fonts', true);
    }
  };

  (0, _react.useEffect)(() => {
    prepare();
  }, []);
  return null;
};

exports.FontLoader = FontLoader;
//# sourceMappingURL=FontLoader.js.map