"use strict";
/**
 * Created by tushar.mathur on 04/11/16.
 */
var preact_1 = require("preact");
var O = require("observable-air");
var R = require("ramda");
var Tasks_1 = require("../Tasks");
var SideNav_1 = require("./SideNav");
var MenuItems_1 = require("./MenuItems");
var Dispatcher_1 = require("../../rwc/Dispatcher");
var HorizontalNav = require("./HorizontalNav");
exports.view = function (d, model, menuItems, horizontalNav) {
    return preact_1.h('div', null, horizontalNav, SideNav_1.default.view(d, model.sideNav, menuItems));
};
function main() {
    var snDispatcher = Dispatcher_1.dispatcher();
    var snReducer$ = SideNav_1.default.update(snDispatcher);
    var model$ = O.scan(function (f, v) { return R.assoc('sideNav', f(v.sideNav), v); }, { sideNav: SideNav_1.default.init() }, snReducer$);
    var menuItemsView = MenuItems_1.default.view(snDispatcher);
    var horizontalNavView = HorizontalNav.view(snDispatcher);
    return O.map(function (model) { return Tasks_1.default.dom(exports.view(snDispatcher, model, menuItemsView, horizontalNavView)); }, model$);
}
exports.main = main;
