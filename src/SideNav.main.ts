/**
 * Created by tushar.mathur on 03/11/16.
 */


import * as O from 'observable-air'
import * as T from './Tasks'
import * as R from 'ramda'
import {view} from './SideNav.view'
import {ReactiveHTMLElement} from '../rwc/ReactiveHTMLElement'
import {listen} from '../rwc/ListenerFactory'
import {IState} from './types/IState'

const just = <T> (value: T) => O.fromArray([value])


type Reducer = { (s: IState): IState }
//
const TRANSLATE_END = -1.05
const clientX = (ev: TouchEvent) => ev.changedTouches[0].clientX
const translateCSS = (completion: number) => `translateX(${completion * 100}%)`
const completion = (width: number, startX: number, currentX: number) => (currentX - startX) / width
const opacityCSS = R.compose(R.toString, R.inc)
const initialState = (q: { rootEL: HTMLElement, touchStart: TouchEvent }) => ({
  width: q.rootEL.shadowRoot.querySelector('.side-nav-container').getBoundingClientRect().width,
  startX: clientX(q.touchStart),
  completion: 0,
  isMoving: true
})
const touchStartR = R.curry((rootEL: HTMLElement, touchStart: TouchEvent, state: IState) =>
  initialState({rootEL, touchStart}))
const touchEndR = R.curry((touchEnd: TouchEvent, state: IState) => {
  const value = completion(state.width, state.startX, clientX(touchEnd))
  if (value < 0 || value === 0 && touchEnd.target.matches(".overlay"))
    return R.merge(state, {completion: TRANSLATE_END, isMoving: false})
  return R.assoc("isMoving", false, state)
})
const visibilityR = R.curry((isVisible: boolean, state: IState) => {
  const completion = isVisible ? 0 : TRANSLATE_END
  return R.merge(state, {completion, isMoving: false})
})
const touchMoveR = R.curry((touchMove: TouchEvent, state: IState) => {
  const value = completion(state.width, state.startX, clientX(touchMove))
  if (value > 0) return R.assoc("completion", 0, state)
  return R.assoc("completion", value, state)
})

const overlayClicks = R.compose(
  O.map(T.preventDefault),
  O.filter((x: Event) => x.target.matches(".overlay"))
)


export function main (root: ReactiveHTMLElement) {
  const shadowRoot = root.shadowRoot as HTMLElement
  const listeners = listen(root)
  const touchStart$ = root.select('container.touchStart')
  const touchMove$ = root.select('container.touchMove')
  const touchEnd$ = root.select('container.touchEnd')
  const isVisible$ = root.select('@@root/isVisible')

  const reducer$ = O.merge([
    O.map(touchStartR(root), touchStart$),
    O.map(touchEndR, touchEnd$),
    O.map(touchMoveR, O.rafThrottle(touchMove$)),
    O.map(visibilityR, isVisible$),
    just(R.identity)
  ])
  const model$ = O.scan((memory: IState, curr: Reducer) => curr(memory), null, reducer$)
  O.forEach(x => console.log(x), model$)
  const view$ = O.map(view(listeners), model$)
  return O.merge([
    O.map(T.dom(shadowRoot), view$)
  ])
}
