/**
 * Created by tushar.mathur on 04/11/16.
 */

import * as O from 'observable-air'
import {EventDispatcher} from '../EventDispatcher'
import {h} from 'preact'
import * as R from 'ramda'
import {Dispatcher} from '../../rwc/Dispatcher'
import {SideNavState} from '../types/SideNavState'


const TRANSLATE_END = -1.05
const clientX = (ev: TouchEvent) => ev.changedTouches[0].clientX
const translateCSS = (completion: number) => `translateX(${completion * 100}%)`
const completion = (width: number, startX: number, currentX: number) => (currentX - startX) / width
const opacityCSS = R.compose(R.toString, R.inc)
const initialState = (touchStart: TouchEvent): SideNavState => ({
  width: (touchStart.currentTarget as HTMLElement).querySelector('.side-nav-slot').getBoundingClientRect().width,
  startX: clientX(touchStart),
  completion: 0,
  isMoving: true
})
const touchStartR = R.curry((touchStart: TouchEvent, state: SideNavState) =>
  initialState(touchStart)
)
const touchEndR = R.curry((touchEnd: TouchEvent, state: SideNavState) => {
  const value = completion(state.width, state.startX, clientX(touchEnd))
  if (value < 0 || value === 0 && touchEnd.target.matches(".overlay"))
    return R.merge(state, {completion: TRANSLATE_END, isMoving: false})
  return R.assoc("isMoving", false, state)
})
const touchMoveR = R.curry((touchMove: TouchEvent, state: SideNavState) => {
  const value = completion(state.width, state.startX, clientX(touchMove))
  if (value > 0) return R.assoc("completion", 0, state)
  return R.assoc("completion", value, state)
})
const onShow = R.assoc('completion', 0)
const onHide = R.assoc('completion', TRANSLATE_END)

export const reducer = (ev: Dispatcher<Event>) => {
  const touchStart$ = ev.select('touchStart')
  const touchMove$ = ev.select('touchMove')
  const touchEnd$ = ev.select('touchEnd')
  const hide$ = ev.select('hide')
  const show$ = ev.select('show')
  return O.merge([
    O.map(touchStartR, touchStart$),
    O.map(touchEndR, touchEnd$),
    O.map(touchMoveR, O.rafThrottle(touchMove$)),
    O.Observable.of(R.identity),
    O.map(R.always(onShow), show$),
    O.map(R.always(onHide), hide$)
  ])
}

export const view = R.curry((f: EventDispatcher, state: SideNavState, children: JSX.Element) =>
  h("div", {
      className: `side-nav-container ${state.isMoving ? 'no-anime' : ''} ${state.completion < -1 ? 'no-show' : ''}`,
      onTouchMove: f.get('touchMove'),
      onTouchStart: f.get('touchStart'),
      onTouchEnd: f.get('touchEnd'),
      onClick: f.get('overlay.click')
    },
    h("div", {
      className: 'overlay',
      style: {opacity: opacityCSS(state.completion)},
      onTouchEnd: f.get('overlay.touchEnd'),
      onClick: f.get('overlay.click')
    }),
    h("div", {
        style: {transform: translateCSS(state.completion)},
        className: `side-nav-slot`
      },
      children
    )
  )
)

export default {view, reducer}
