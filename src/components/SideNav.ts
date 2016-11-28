/**
 * Created by tushar.mathur on 04/11/16.
 */

import * as O from 'observable-air'
import {h} from '../Tasks'
import * as R from 'ramda'
import {Dispatcher} from '../../rwc/Dispatcher'
import {SideNavModel} from '../types/Model'
import {Action} from '../../rwc/Action'
import {IVNode} from '../types/IVNode'


const TRANSLATE_END = -1.05
const clientX = (ev: TouchEvent) => ev.changedTouches[0].clientX
const translateCSS = (completion: number) => `translateX(${completion * 100}%)`
const completion = (width: number, startX: number, currentX: number) => (currentX - startX) / width
const opacityCSS = R.compose(R.toString, R.inc)
const initialState = (touchStart: TouchEvent): SideNavModel => ({
  completion: 0,
  isMoving: true,
  startX: clientX(touchStart),
  width: (touchStart.currentTarget as HTMLElement).querySelector('.side-nav-slot').getBoundingClientRect().width
})
const touchStartR = (touchStart: TouchEvent) => R.always(initialState(touchStart))
const touchEndR = R.curry((touchEnd: TouchEvent, state: SideNavModel) => {
  const value = completion(state.width, state.startX, clientX(touchEnd))
  if (value < 0 || value === 0 && touchEnd.target.matches('.overlay'))
    return R.merge(state, {completion: TRANSLATE_END, isMoving: false})
  return R.assoc('isMoving', false, state)
})
const touchMoveR = R.curry((touchMove: TouchEvent, state: SideNavModel) => {
  const value = completion(state.width, state.startX, clientX(touchMove))
  if (value > 0) return R.assoc('completion', 0, state)
  return R.assoc('completion', value, state)
})
const onShow = R.assoc('completion', 0)
const onHide = R.assoc('completion', TRANSLATE_END)

export const update = (args: {ev: O.IObservable<Action<Event>>, show$: O.IObservable<Event>, hide$: O.IObservable<Event>}) => {

  O.forEach(x => console.log(x), args.hide$)

  type TReducer = (t: SideNavModel) => SideNavModel
  const touchStart$ = Dispatcher.select('touchStart', args.ev)
  const touchMove$ = O.rafThrottle(Dispatcher.select('touchMove', args.ev))
  const touchEnd$ = Dispatcher.select('touchEnd', args.ev)
  return O.merge(
    O.map<TouchEvent, TReducer>(touchStartR, touchStart$),
    O.map<TouchEvent, TReducer>(touchEndR, touchEnd$),
    O.map<TouchEvent, TReducer>(touchMoveR, touchMove$),
    O.of(R.identity),
    O.map(R.always(onShow), args.show$),
    O.map(R.always(onHide), args.hide$)
  )
}

export const view = (f: Dispatcher<Event>, state: SideNavModel, children: IVNode) =>
  h('div.side-nav-container', {
    'class': {'no-anime': state.isMoving, 'no-show': state.completion < -1},
    on: {
      touchmove: f.of('touchMove').listen,
      touchstart: f.of('touchStart').listen,
      touchend: f.of('touchEnd').listen
    }
  }, [
    h('div.overlay', {
      style: {opacity: opacityCSS(state.completion) },
      on: {click: f.of('click').listen}
    }),
    h('div.side-nav-slot', {
        style: {transform: translateCSS(state.completion)}
      },
      [children]
    )
  ])

export const init = () => ({
  width: 0,
  startX: 0,
  completion: TRANSLATE_END,
  isMoving: false
})

export default {view, update, init}
