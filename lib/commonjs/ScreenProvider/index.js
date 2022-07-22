"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.screenConfig = exports.ScreenProvider = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactNative = require("react-native");

var _context = require("./context");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const screenConfig = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280
};
exports.screenConfig = screenConfig;

const initialScreen = _reactNative.Dimensions.get('screen');

const ScreenProvider = _ref => {
  let {
    children
  } = _ref;
  const getSize = (0, _react.useCallback)(screen => {
    const {
      width
    } = screen;
    let size = 'xs';

    if (width < screenConfig.sm) {
      size = 'xs';
    } else if (width < screenConfig.md) {
      size = 'sm';
    } else if (width < screenConfig.lg) {
      size = 'md';
    } else if (width < screenConfig.xl) {
      size = 'lg';
    } else if (width >= screenConfig.xl) {
      size = 'xl';
    }

    return size;
  }, []);
  const getOrientation = (0, _react.useCallback)(screen => {
    const {
      width,
      height
    } = screen;
    let orientation = 'PORTRAIT';

    if (width > height) {
      orientation = 'LANDSCAPE';
    }

    return orientation;
  }, []);
  const [screen, setScreen] = (0, _react.useState)({
    orientation: getOrientation(initialScreen),
    size: getSize(initialScreen),
    scaleSize: initialScreen
  });
  const updateScreen = (0, _react.useCallback)(() => {
    const screen = _reactNative.Dimensions.get('screen');

    let size = getSize(screen);
    let orientation = getOrientation(screen);
    setScreen(prev => ({ ...prev,
      orientation,
      size
    }));
  }, []);
  (0, _react.useEffect)(() => {
    const listener = _reactNative.Dimensions.addEventListener('change', updateScreen);

    return () => {
      listener.remove();
    };
  }, []);
  return /*#__PURE__*/_react.default.createElement(_context.ScreenContext.Provider, {
    value: screen
  }, children);
};

exports.ScreenProvider = ScreenProvider;
//# sourceMappingURL=index.js.map