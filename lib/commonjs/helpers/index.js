"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  registerIcon: true
};
Object.defineProperty(exports, "registerIcon", {
  enumerable: true,
  get: function () {
    return _icon.registerIcon;
  }
});

var _colors = require("./colors");

Object.keys(_colors).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _colors[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _colors[key];
    }
  });
});

var _spacing = require("./spacing");

Object.keys(_spacing).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _spacing[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _spacing[key];
    }
  });
});

var _renderNode = require("./renderNode");

Object.keys(_renderNode).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _renderNode[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _renderNode[key];
    }
  });
});

var _normalizeText = require("./normalizeText");

Object.keys(_normalizeText).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _normalizeText[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _normalizeText[key];
    }
  });
});

var _style = require("./style");

Object.keys(_style).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _style[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _style[key];
    }
  });
});

var _withTheme = require("./withTheme");

Object.keys(_withTheme).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _withTheme[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _withTheme[key];
    }
  });
});

var _icon = require("./icon");
//# sourceMappingURL=index.js.map