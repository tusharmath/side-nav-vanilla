/**
 * Created by tushar.mathur on 04/11/16.
 */
"use strict";
var O = require("observable-air");
var preact_1 = require("preact");
var R = require("ramda");
var TRANSLATE_END = -1.05;
var clientX = function (ev) { return ev.changedTouches[0].clientX; };
var translateCSS = function (completion) { return "translateX(" + completion * 100 + "%)"; };
var completion = function (width, startX, currentX) { return (currentX - startX) / width; };
var opacityCSS = R.compose(R.toString, R.inc);
var initialState = function (touchStart) { return ({
    completion: 0,
    isMoving: true,
    startX: clientX(touchStart),
    width: touchStart.currentTarget.querySelector('.side-nav-slot').getBoundingClientRect().width
}); };
var touchStartR = function (touchStart) { return R.always(initialState(touchStart)); };
var touchEndR = R.curry(function (touchEnd, state) {
    var value = completion(state.width, state.startX, clientX(touchEnd));
    if (value < 0 || value === 0 && touchEnd.target.matches('.overlay'))
        return R.merge(state, { completion: TRANSLATE_END, isMoving: false });
    return R.assoc('isMoving', false, state);
});
var touchMoveR = R.curry(function (touchMove, state) {
    var value = completion(state.width, state.startX, clientX(touchMove));
    if (value > 0)
        return R.assoc('completion', 0, state);
    return R.assoc('completion', value, state);
});
var onShow = R.assoc('completion', 0);
var onHide = R.assoc('completion', TRANSLATE_END);
var RAF$ = new O.Observable(function (observer, scheduler) {
    var onFrame = function () {
        observer.next(undefined);
        subscription = scheduler.requestAnimationFrame(onFrame);
    };
    var subscription = scheduler.requestAnimationFrame(onFrame);
    return function () { return subscription.unsubscribe(); };
});
exports.update = function (ev) {
    var touchStart$ = ev.select('touchStart');
    // const touchMove$ = O.sample(R.identity, RAF$, [ev.select('touchMove')])
    var touchMove$ = O.rafThrottle(ev.select('touchMove'));
    var touchEnd$ = ev.select('touchEnd');
    var hide$ = O.merge(ev.select('hide'), ev.select('click'));
    var show$ = ev.select('show');
    return O.merge(O.map(touchStartR, touchStart$), O.map(touchEndR, touchEnd$), O.map(touchMoveR, touchMove$), O.of(R.identity), O.map(R.always(onShow), show$), O.map(R.always(onHide), hide$));
};
exports.view = function (f, state, children) {
    return preact_1.h('div', {
        className: "side-nav-container " + (state.isMoving ? 'no-anime' : '') + " " + (state.completion < -1 ? 'no-show' : ''),
        onTouchMove: f.listener('touchMove'),
        onTouchStart: f.listener('touchStart'),
        onTouchEnd: f.listener('touchEnd')
    }, preact_1.h('div', {
        className: 'overlay',
        style: { opacity: opacityCSS(state.completion) },
        onClick: f.listener('click')
    }), preact_1.h('div', {
        style: { transform: translateCSS(state.completion) },
        className: "side-nav-slot"
    }, children));
};
exports.init = function () { return ({
    width: 0,
    startX: 0,
    completion: TRANSLATE_END,
    isMoving: false
}); };
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = { view: exports.view, update: exports.update, init: exports.init };
