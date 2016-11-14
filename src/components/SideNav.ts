/**
 * Created by tushar.mathur on 04/11/16.
 */

import * as O from 'observable-air'
import {h} from 'preact'
import * as R from 'ramda'
import {Dispatcher} from '../../rwc/Dispatcher'
import {Model} from '../types/Model'


const TRANSLATE_END = -1.05
const clientX = (ev: TouchEvent) => ev.changedTouches[0].clientX
const translateCSS = (completion: number) => `translateX(${completion * 100}%)`
const completion = (width: number, startX: number, currentX: number) => (currentX - startX) / width
const opacityCSS = R.compose(R.toString, R.inc)
const initialState = (touchStart: TouchEvent): Model => ({
  width: (touchStart.currentTarget as HTMLElement).querySelector('.side-nav-slot').getBoundingClientRect().width,
  startX: clientX(touchStart),
  completion: 0,
  isMoving: true
})
const touchStartR = R.curry((touchStart: TouchEvent, state: Model) =>
  initialState(touchStart)
)
const touchEndR = R.curry((touchEnd: TouchEvent, state: Model) => {
  const value = completion(state.width, state.startX, clientX(touchEnd))
  if (value < 0 || value === 0 && touchEnd.target.matches('.overlay'))
    return R.merge(state, {completion: TRANSLATE_END, isMoving: false})
  return R.assoc('isMoving', false, state)
})
const touchMoveR = R.curry((touchMove: TouchEvent, state: Model) => {
  const value = completion(state.width, state.startX, clientX(touchMove))
  if (value > 0) return R.assoc('completion', 0, state)
  return R.assoc('completion', value, state)
})
const onShow = R.assoc('completion', 0)
const onHide = R.assoc('completion', TRANSLATE_END)

export const update = (ev: Dispatcher<Event>) => {
  const touchStart$ = ev.select('touchStart')
  const touchMove$ = O.rafThrottle(ev.select('touchMove'))
  const touchEnd$ = ev.select('touchEnd')
  const hide$ = O.merge(ev.select('hide'), ev.select('click'))
  const show$ = ev.select('show')
  return O.merge(
    O.map(touchStartR, touchStart$),
    O.map(touchEndR, touchEnd$),
    O.map(touchMoveR, touchMove$),
    O.of(R.identity),
    O.map(R.always(onShow), show$),
    O.map(R.always(onHide), hide$)
  )
}

export const view = (f: Dispatcher<Event>, state: Model, children: JSX.Element) =>
  h('div', {
      className: `side-nav-container ${state.isMoving ? 'no-anime' : ''} ${state.completion < -1 ? 'no-show' : ''}`,
      onTouchMove: f.listener('touchMove'),
      onTouchStart: f.listener('touchStart'),
      onTouchEnd: f.listener('touchEnd')
    },
    h('div', {
      className: 'overlay',
      style: {opacity: opacityCSS(state.completion)},
      onClick: f.listener('click')
    }),
    h('div', {
        style: {transform: translateCSS(state.completion)},
        className: `side-nav-slot`
      },
      children
    )
  )

export const init = () => ({
  width: 0,
  startX: 0,
  completion: TRANSLATE_END,
  isMoving: false
})

export default {view, update, init}
