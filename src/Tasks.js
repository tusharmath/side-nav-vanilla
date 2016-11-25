/**
 * Created by tushar.mathur on 03/11/16.
 */
"use strict";
var preact_1 = require("preact");
var preact_2 = require("preact");
exports.h = preact_2.h;
var result;
var element = document.querySelector('#app');
var DOMTask = (function () {
    function DOMTask(view) {
        this.view = view;
    }
    DOMTask.prototype.run = function () {
        result = preact_1.render(this.view, element, result);
    };
    return DOMTask;
}());
exports.DOMTask = DOMTask;
var PreventDefaultTask = (function () {
    function PreventDefaultTask(event) {
        this.event = event;
    }
    PreventDefaultTask.prototype.run = function () {
        this.event.preventDefault();
    };
    return PreventDefaultTask;
}());
exports.PreventDefaultTask = PreventDefaultTask;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    dom: function (view) { return new DOMTask(view); },
    preventDefault: function (ev) { return new PreventDefaultTask(ev); }
};
