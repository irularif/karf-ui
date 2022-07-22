"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _screen = require("./screen");

Object.keys(_screen).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _screen[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _screen[key];
    }
  });
});

var _theme = require("./theme");

Object.keys(_theme).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _theme[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _theme[key];
    }
  });
});
//# sourceMappingURL=index.js.map