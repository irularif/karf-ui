"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = require("lodash");

var _react = require("react");

var _context = require("../ScreenProvider/context");

const useScreen = () => {
  const context = (0, _react.useContext)(_context.ScreenContext);

  if (context === undefined) {
    throw new Error('useScreen must be used within a ScreenProvider');
  }

  const {
    size
  } = context;
  const select = (0, _react.useCallback)(params => {
    let selected = undefined;
    let pkeys = Object.keys(params);
    let pidx = pkeys.indexOf(size);

    if (pidx > -1) {
      return params[size];
    } else {
      for (let pk of _context.Device) {
        selected = (0, _lodash.get)(params, pk, selected);

        if (pk === size) {
          break;
        }
      }
    }

    return selected;
  }, [size]);
  return { ...context,
    select
  };
};

var _default = useScreen;
exports.default = _default;
//# sourceMappingURL=screen.js.map