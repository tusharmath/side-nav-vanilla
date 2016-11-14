import * as O from 'observable-air'
import * as R from 'ramda'
import template from './template'
import D from './dom-tasks'
import {ITask} from './types/ITask'
import {IState} from './types/IState'

type Reducer = { (s: IState): IState }

const TRANSLATE_END = -1.05
const clientX = (ev: TouchEvent) => ev.changedTouches[0].clientX
const translateCSS = (completion: number) => `translateX(${completion * 100}%)`
const completion = (width: number, startX: number, currentX: number) => (currentX - startX) / width
const opacityCSS = R.compose(R.toString, R.inc)
const touchStartR = R.curry((rootEL: HTMLElement, touchStart: TouchEvent, state: IState) => ({
    width: rootEL.getBoundingClientRect().width,
    startX: clientX(touchStart),
    completion: 0,
    isMoving: true
  })
)
const touchEndR = R.curry((touchEnd: TouchEvent, state: IState) => {
  const value = completion(state.width, state.startX, clientX(touchEnd))
  if (value < 0 || value === 0 && touchEnd.target.matches('.overlay'))
    return R.merge(state, {completion: TRANSLATE_END, isMoving: false})
  return R.assoc('isMoving', false, state)
})
const visibilityR = R.curry((isVisible: boolean, state: IState) => {
  const completion = isVisible ? 0 : TRANSLATE_END
  return R.merge(state, {completion, isMoving: false})
})
const touchMoveR = R.curry((touchMove: TouchEvent, state: IState) => {
  const value = completion(state.width, state.startX, clientX(touchMove))
  if (value > 0) return R.assoc('completion', 0, state)
  return R.assoc('completion', value, state)
})

const overlayClicks = R.compose(
  O.map(D.preventDefault),
  O.filter((x: Event) => x.target.matches('.overlay'))
)
const elements = R.memoize((rootEL: HTMLElement) => {
  const queryRootEL = D.querySelector(rootEL)
  return {
    rootEL,
    slotEL: queryRootEL('.side-nav-slot'),
    containerEL: queryRootEL('.side-nav-container'),
    overlayEL: queryRootEL('.overlay')
  }
})
const mainReducer = R.curry((rootEL: HTMLElement, e: IState) => {
  const el = elements(rootEL)
  return D.combine(
    D.toggleClass(el.containerEL, 'no-anime', e.isMoving),
    D.style(el.slotEL, 'transform', translateCSS(e.completion)),
    D.style(el.overlayEL, 'opacity', opacityCSS(e.completion)),
    D.toggleClass(el.containerEL, 'no-show', e.completion < -1)
  )
})
const fromInnerHTML = R.curry((isVisible$: O.IObservable<boolean>, rootEL: HTMLElement) => {
  const el = elements(rootEL)
  const ev = O.fromDOM(el.containerEL)
  const reducer$ = O.merge(
    O.map(touchStartR(el.slotEL), ev('touchstart')),
    O.map(touchEndR, ev('touchend')),
    O.map(touchMoveR, ev('touchmove')),
    O.map(visibilityR, isVisible$)
  )
  const model$ = O.scan((curr: Reducer, memory: IState) => curr(memory), null, reducer$)

  return O.merge(
    O.map(mainReducer(rootEL), model$),
    overlayClicks(ev('touchstart'))
  )
})
export function main (rootEL: HTMLElement, isVisible$: O.IObservable<boolean>) {
  const setInnerHTML = D.innerHTML(rootEL.shadowRoot, template)
  return O.merge(
    O.join(O.map(fromInnerHTML(isVisible$), setInnerHTML.value$)),
    O.of(setInnerHTML)
  )
}
export class SideNav extends HTMLElement {
  private subscription: O.ISubscription
  private isVisible$ = O.subject<boolean>()

  constructor () {
    super()
    this.attachShadow({mode: 'open'})
    this.subscription = O.forEach(this.onValue, main(this, this.isVisible$))
  }

  private onValue (task: ITask) {
    task.run()
  }

  disconnectedCallback () {
    this.subscription.unsubscribe()
  }

  show () {
    this.isVisible$.next(true)
  }

  hide () {
    this.isVisible$.next(false)
  }
}
