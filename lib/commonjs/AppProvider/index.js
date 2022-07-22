"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AppProvider = void 0;

var SplashScreen = _interopRequireWildcard(require("expo-splash-screen"));

var _react = _interopRequireWildcard(require("react"));

var _reactNative = require("react-native");

var _reactNativeSafeAreaContext = require("react-native-safe-area-context");

var _responsive = require("../helpers/responsive");

var _ScreenProvider = require("../ScreenProvider");

var _context = require("../ScreenProvider/context");

var _ThemeProvider = require("../ThemeProvider");

var _context2 = require("./context");

var _FontLoader = require("./font/FontLoader");

var _WrapperSplashScreen = require("./splashScreen/WrapperSplashScreen");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

SplashScreen.preventAutoHideAsync();

const AppProvider = _ref => {
  let {
    fonts,
    themes,
    children,
    SplashScreenComponent
  } = _ref;
  const [app, setApp] = (0, _react.useState)({
    initialize: {
      fonts: false
    },
    isReady: false,
    ..._context.initialScreen
  });
  const isLoading = (0, _react.useMemo)(() => {
    return Object.values(app.initialize).some(value => !value);
  }, [app]);
  const updateInitialize = (0, _react.useCallback)((key, value) => {
    setApp(prev => ({ ...prev,
      initialize: { ...prev.initialize,
        [key]: value
      }
    }));
  }, []);
  const setIsReady = (0, _react.useCallback)(value => {
    setApp(prev => ({ ...prev,
      isReady: value
    }));
  }, []);
  const AppContextValue = (0, _react.useMemo)(() => ({ ...app,
    isLoading,
    updateInitialize,
    setIsReady
  }), [app, isLoading, updateInitialize]);
  const handleOrientation = (0, _react.useCallback)(() => {
    const screen = _reactNative.Dimensions.get('screen');

    const {
      width,
      height
    } = screen;
    let size = (0, _responsive.getSize)(screen);

    if (height >= width) {
      setApp(prev => ({ ...prev,
        orientation: 'PORTRAIT',
        size,
        scaleSize: screen
      }));
    } else {
      setApp(prev => ({ ...prev,
        orientation: 'LANDSCAPE',
        size,
        scaleSize: screen
      }));
    }
  }, []);
  (0, _react.useEffect)(() => {
    const event = _reactNative.Dimensions.addEventListener('change', handleOrientation);

    return () => {
      event.remove();
    };
  }, []);
  return /*#__PURE__*/_react.default.createElement(_context2.AppContext.Provider, {
    value: AppContextValue
  }, /*#__PURE__*/_react.default.createElement(_reactNativeSafeAreaContext.SafeAreaProvider, null, /*#__PURE__*/_react.default.createElement(_ScreenProvider.ScreenProvider, null, /*#__PURE__*/_react.default.createElement(_ThemeProvider.ThemeProvider, {
    themes: themes
  }, /*#__PURE__*/_react.default.createElement(_FontLoader.FontLoader, {
    fonts: fonts
  }), /*#__PURE__*/_react.default.createElement(_WrapperSplashScreen.WrapperSplashScreenProps, {
    Component: SplashScreenComponent
  }, children)))));
};

exports.AppProvider = AppProvider;
//# sourceMappingURL=index.js.map