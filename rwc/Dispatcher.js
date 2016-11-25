"use strict";
/**
 * Created by tushar.mathur on 04/11/16.
 */
var O = require("observable-air");
var Action_1 = require("./Action");
var params = function (x) { return x.params; };
var Dispatcher = (function () {
    function Dispatcher() {
        this.subject = O.subject();
    }
    Dispatcher.prototype.listen = function (type, params) {
        if (params === void 0) { params = null; }
        this.subject.next(new Action_1.Action(type, params));
    };
    Dispatcher.prototype.select = function (type) {
        return O.map(params, O.filter(function (x) { return x.type === type; }, this.subject));
    };
    Dispatcher.prototype.listener = function (type) {
        return this.listen.bind(this, type);
    };
    return Dispatcher;
}());
exports.Dispatcher = Dispatcher;
function dispatcher() {
    return new Dispatcher();
}
exports.dispatcher = dispatcher;
var EventDispatcher = (function () {
    function EventDispatcher() {
    }
    return EventDispatcher;
}());
exports.EventDispatcher = EventDispatcher;
