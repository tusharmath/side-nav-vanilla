import * as O from "observable-air"
import * as R from "ramda"
import template from "./template"
import D from "./dom-tasks"
import { ITask } from "./types/ITask"
import { ISource } from "./types/ISource"
import { IState } from "./types/IState"

type Reducer = { (s: IState): IState }

const TRANSLATE_END = -1.05
const clientX = (ev: TouchEvent) => ev.changedTouches[0].clientX
const translateCSS = (completion: number) => `translateX(${completion * 100}%)`
const completion = R.curry((width: number, startX: number, currentX: number) => (currentX - startX) / width)
const opacityCSS = R.compose(R.toString, R.inc)
const domEvents = (containerEL: HTMLElement) => {
  const containerEV = O.fromDOM(containerEL)
  return {
    touchMove$: containerEV("touchmove"),
    touchStart$: containerEV("touchstart"),
    touchEnd$: containerEV("touchend"),
    click$: containerEV("click")
  }
}
const initialState = (q: { rootEL: HTMLElement, touchStart: TouchEvent }) => ({
  width: q.rootEL.getBoundingClientRect().width,
  startX: clientX(q.touchStart),
  completion: 0,
  isMoving: true
})
const touchStartR = R.curry((rootEL: HTMLElement, touchStart: TouchEvent, state: IState) => initialState({ rootEL, touchStart }))
const touchEndR = R.curry((touchEnd: TouchEvent, state: IState) => {
  const value = completion(state.width, state.startX, clientX(touchEnd))
  if (value < 0 || value === 0 && touchEnd.target.matches(".overlay"))
    return R.merge(state, { completion: TRANSLATE_END, isMoving: false })
  return R.assoc("isMoving", false, state)
})
const visibilityR = R.curry((isVisible: boolean, state: IState) => {
  const completion = isVisible ? 0 : TRANSLATE_END
  return R.assoc("completion", completion, state)
})
const touchMoveR = R.curry((touchMove: TouchEvent, state: IState) => {
  const value = completion(state.width, state.startX, clientX(touchMove))
  if (value > 0) return R.assoc("completion", 0, state)
  return R.assoc("completion", value, state)
})
export function Runner(source: ISource) {
  const opacity = R.compose(D.style(source.overlayEL, "opacity"), opacityCSS)
  const transform = R.compose(D.style(source.slotEL, "transform"), translateCSS)
  const reducer$ = O.merge([
    O.map(touchStartR(source.rootEL), source.touchStart$),
    O.map(touchEndR, source.touchEnd$),
    O.map(touchMoveR, O.rafThrottle(source.touchMove$)),
    O.map(visibilityR, source.isVisible$)
  ])
  const model$ = O.scan((memory: IState, curr: Reducer) => curr(memory), null, reducer$)
  return O.merge([
    O.map((e: IState) => D.combine(
      D.toggleClass(source.containerEL, "no-anime", e.isMoving),
      transform(e.completion),
      opacity(e.completion),
      D.toggleClass(source.containerEL, "no-show", e.completion < -1)
    ), model$),
    O.map(D.preventDefault, source.touchStart$)
  ])
}
export class SideNav extends HTMLElement {
  private subscription: O.ISubscription
  private observer: O.IObserver<boolean>

  constructor() {
    super()
    const root = this.attachShadow({ mode: "open" })
    root.innerHTML = template
    this.style.display = "inherit"
    const slotEL = root.querySelector(".side-nav-slot") as HTMLElement
    const containerEL = root.querySelector(".side-nav-container") as HTMLElement
    const overlayEL = root.querySelector(".overlay") as HTMLElement
    const isVisible$ = new O.Observable((observer) => void (this.observer = observer))
    const source = R.merge(domEvents(containerEL), { slotEL, containerEL, overlayEL, rootEL: this, isVisible$ })
    this.subscription = O.forEach(this.onValue, Runner(source))
  }

  private onValue(task: ITask) {
    task.run()
  }

  disconnectedCallback() {
    this.subscription.unsubscribe()
  }

  show() {
    this.observer.next(true)
  }

  hide() {
    this.observer.next(false)
  }
}
