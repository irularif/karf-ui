"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TopBar = void 0;

var _TopBar = require("./TopBar");

var _Title = require("./Title");

var _LeftAction = require("./LeftAction");

var _RightAction = require("./RightAction");

const TopBar = Object.assign(_TopBar.TopBarBase, {
  Title: _Title.TopBarTitle,
  LeftAction: _LeftAction.TopBarLeftAction,
  RightAction: _RightAction.TopBarRightAction
});
exports.TopBar = TopBar;
//# sourceMappingURL=index.js.map