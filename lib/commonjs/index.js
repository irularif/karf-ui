"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _AppProvider = require("./AppProvider");

Object.keys(_AppProvider).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _AppProvider[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _AppProvider[key];
    }
  });
});

var _context = require("./ScreenProvider/context");

Object.keys(_context).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _context[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _context[key];
    }
  });
});

var _context2 = require("./ThemeProvider/context");

Object.keys(_context2).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _context2[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _context2[key];
    }
  });
});

var _Text = require("./Text");

Object.keys(_Text).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _Text[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _Text[key];
    }
  });
});

var _View = require("./View");

Object.keys(_View).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _View[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _View[key];
    }
  });
});

var _Page = require("./Page");

Object.keys(_Page).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _Page[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _Page[key];
    }
  });
});

var _TopBar = require("./TopBar");

Object.keys(_TopBar).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _TopBar[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _TopBar[key];
    }
  });
});

var _Icon = require("./Icon");

Object.keys(_Icon).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _Icon[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _Icon[key];
    }
  });
});

var _helpers = require("./helpers");

Object.keys(_helpers).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _helpers[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _helpers[key];
    }
  });
});

var _hooks = require("./hooks");

Object.keys(_hooks).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _hooks[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _hooks[key];
    }
  });
});
//# sourceMappingURL=index.js.map