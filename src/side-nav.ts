import * as O from 'observable-air'
import * as R from 'ramda'
import template from './template'
import D from './dom-tasks'
import {ITask} from './types/ITask'
import {ISource} from './types/ISource'
import {IState} from './types/IState'

type Reducer = { (s: IState): IState }

const TRANSLATE_END = -1.05
const clientX = (ev: TouchEvent) => ev.changedTouches[0].clientX
const translateCSS = (completion: number) => `translateX(${completion * 100}%)`
const completion = (width: number, startX: number, currentX: number) => (currentX - startX) / width
const opacityCSS = R.compose(R.toString, R.inc)
const initialState = (q: { rootEL: HTMLElement, touchStart: TouchEvent }) => ({
  width: q.rootEL.getBoundingClientRect().width,
  startX: clientX(q.touchStart),
  completion: 0,
  isMoving: true
})
const touchStartR = R.curry((rootEL: HTMLElement, touchStart: TouchEvent, state: IState) => initialState({
  rootEL,
  touchStart
}))
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
const effects = (overlayEL: HTMLElement,
                 slotEL: HTMLElement,
                 containerEL: HTMLElement,
                 rootEL: HTMLElement,
                 touchStart$: O.IObservable<TouchEvent>,
                 touchMove$: O.IObservable<TouchEvent>,
                 touchEnd$: O.IObservable<TouchEvent>,
                 isVisible$: O.IObservable<boolean>) => {
  const opacity = R.compose(D.style(overlayEL, "opacity"), opacityCSS)
  const translateX = R.compose(D.style(slotEL, "transform"), translateCSS)
  const model$ = model(rootEL, touchStart$, touchMove$, touchEnd$, isVisible$)
  return O.merge([
    O.map((e: IState) => D.combine(
      D.toggleClass(containerEL, "no-anime", e.isMoving),
      translateX(e.completion),
      opacity(e.completion),
      D.toggleClass(containerEL, "no-show", e.completion < -1)
    ), model$),
    overlayClicks(touchStart$)
  ])
}
export function main (source: ISource) {
  return effects(
    source.overlayEL,
    source.slotEL,
    source.containerEL,
    source.rootEL,
    source.touchStart$,
    source.touchMove$,
    source.touchEnd$,
    source.isVisible$
  )
}
export class SideNav extends HTMLElement {
  private subscription: O.ISubscription
  private observer: O.IObserver<boolean>

  constructor () {
    super()
    const root = this.attachShadow({mode: "open"})
    root.innerHTML = template
    this.style.display = "inherit"
    const slotEL = root.querySelector(".side-nav-slot") as HTMLElement
    const containerEL = root.querySelector(".side-nav-container") as HTMLElement
    const overlayEL = root.querySelector(".overlay") as HTMLElement
    const isVisible$ = new O.Observable((observer) => void (this.observer = observer))
    const containerEV = O.fromDOM(containerEL)
    this.subscription = O.forEach(this.onValue, main({
      slotEL,
      containerEL,
      overlayEL,
      rootEL: this,
      isVisible$,
      touchMove$: containerEV("touchmove"),
      touchStart$: containerEV("touchstart"),
      touchEnd$: containerEV("touchend"),
      click$: containerEV("click")
    }))
  }

  private onValue (task: ITask) {
    task.run()
  }

  disconnectedCallback () {
    this.subscription.unsubscribe()
  }

  show () {
    this.observer.next(true)
  }

  hide () {
    this.observer.next(false)
  }
}
