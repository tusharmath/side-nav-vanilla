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
const initialState = (rootEL: HTMLElement, touchStart: TouchEvent) => ({
  width: rootEL.getBoundingClientRect().width,
  startX: clientX(touchStart),
  completion: 0,
  isMoving: true
})
const touchStartR = R.curry((rootEL: HTMLElement, touchStart: TouchEvent, state: IState) =>
  initialState(rootEL, touchStart)
)
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
const model = (rootEL: HTMLElement,
               touchStart$: O.IObservable<TouchEvent>,
               touchMove$: O.IObservable<TouchEvent>,
               touchEnd$: O.IObservable<TouchEvent>,
               isVisible$: O.IObservable<boolean>) => {
  const reducer$ = O.merge([
    O.map(touchStartR(rootEL), touchStart$),
    O.map(touchEndR, touchEnd$),
    O.map(touchMoveR, touchMove$),
    O.map(visibilityR, isVisible$)
  ])
  return O.scan((curr: Reducer, memory: IState) => curr(memory), null, reducer$)
}
const overlayClicks = R.compose(
  O.map(D.preventDefault),
  O.filter((x: Event) => x.target.matches(".overlay"))
)
const fromInnerHTML = R.curry((isVisible$: O.IObservable<boolean>, rootEL: HTMLElement) => {
  const queryRootEL = querySelector(rootEL)
  const slotEL = queryRootEL(".side-nav-slot")
  const containerEL = queryRootEL(".side-nav-container")
  const overlayEL = queryRootEL(".overlay")

  const containerEV = O.fromDOM(containerEL)
  const touchStart$ = containerEV("touchstart")
  const touchMove$ = containerEV("touchmove")
  const touchEnd$ = containerEV("touchend")
  const opacity = R.compose(D.style(overlayEL, "opacity"), opacityCSS)
  const translateX = R.compose(D.style(slotEL, "transform"), translateCSS)
  const model$ = model(slotEL, touchStart$, touchMove$, touchEnd$, isVisible$)
  const mainReducer = (e: IState) => D.combine(
    D.toggleClass(containerEL, "no-anime", e.isMoving),
    translateX(e.completion),
    opacity(e.completion),
    D.toggleClass(containerEL, "no-show", e.completion < -1)
  )
  return O.merge([
    O.map(mainReducer, model$),
    overlayClicks(touchStart$)
  ])
})
const querySelector = R.curry((root: HTMLElement, selector: string) => root.querySelector(selector) as HTMLElement)
export function main (rootEL: HTMLElement, isVisible$: O.IObservable<boolean>) {
  const setInnerHTML = D.innerHTML(rootEL.shadowRoot, template)
  const task$ = O.join(O.map(fromInnerHTML(isVisible$), setInnerHTML.value$))
  return O.merge([
    task$,
    O.fromArray([setInnerHTML])
  ])
}
export class SideNav extends HTMLElement {
  private subscription: O.ISubscription
  private isVisible$ = O.subject<boolean>()

  constructor () {
    super()
    this.attachShadow({mode: "open"})
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
