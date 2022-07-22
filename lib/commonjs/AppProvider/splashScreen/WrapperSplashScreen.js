"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WrapperSplashScreenProps = void 0;

var SplashScreen = _interopRequireWildcard(require("expo-splash-screen"));

var _react = _interopRequireWildcard(require("react"));

var _context = require("../context");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const WrapperSplashScreenProps = _ref => {
  let {
    Component: SplashScreenComponent,
    children
  } = _ref;
  const {
    isLoading,
    isReady,
    setIsReady
  } = (0, _context.useApp)();
  const hideSplashScreen = (0, _react.useCallback)(() => {
    setIsReady(true);
  }, []);
  (0, _react.useEffect)(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();

      if (!SplashScreenComponent) {
        setIsReady(true);
      }
    }
  }, [isLoading, setIsReady, SplashScreenComponent]);
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, !!isReady && children, !!SplashScreenComponent && !isLoading && !isReady && /*#__PURE__*/_react.default.createElement(SplashScreenComponent, {
    hideSplashScreen: hideSplashScreen
  }));
};

exports.WrapperSplashScreenProps = WrapperSplashScreenProps;
//# sourceMappingURL=WrapperSplashScreen.js.map