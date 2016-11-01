import * as O from "observable-air"
import * as R from "ramda"
import { ISubscription } from "observable-air/.dist/src/types/core/ISubscription"
import { IObservable } from "observable-air/.dist/src/types/core/IObservable"
import template from "./template"
import * as L from "./lib"
import D from "./dom-tasks"
import { ITask } from "./types/ITask"

interface State {
  completion: number
  startX: number
  isMoving: boolean
  width: number
}
interface ISource {
  touchStart$: IObservable<TouchEvent>,
  touchMove$: IObservable<TouchEvent>,
  touchEnd$: IObservable<TouchEvent>,
  click$: IObservable<MouseEvent>,
  containerEL: HTMLElement,
  overlayEL: HTMLElement,
  slotEL: HTMLElement,
  rootEL: HTMLElement
}

type Reducer = { (s: State): State }

function DomEvents(nav: SideNav) {
  const containerEL = O.fromDOM(nav.containerEL)
  return {
    touchMove$: containerEL("touchmove"),
    touchStart$: containerEL("touchstart"),
    touchEnd$: containerEL("touchend"),
    click$: containerEL("click")
  }
}
const translateX = R.compose(
  O.map(L.translateCSS),
  O.filter(x => x < 0),
  O.switchLatest
)

const setIsMoving = L.mapTo(R.assoc("isMoving", true))
const unsetIsMoving = L.mapTo(R.assoc("isMoving", false))
const initialState = (q: { rootEL: HTMLElement, touchStart: TouchEvent }) => ({
  width: L.bcrWidth(q.rootEL),
  startX: L.clientX(q.touchStart),
  completion: 0,
  isMoving: true
})
const touchStartR = R.curry(function (rootEL: HTMLElement, touchStart: TouchEvent, state: State) {
  return initialState({ rootEL, touchStart })
})
const touchEndR = R.curry(function (touchEnd: TouchEvent, state: State) {
  const completion = L.completion(state.width, state.startX, L.clientX(touchEnd))
  if (completion < 0) return R.merge(state, { completion: -1.0, isMoving: false })
  return R.assoc("isMoving", false, state)
})
const touchMoveR = R.curry(function (touchMove: TouchEvent, state: State) {
  const completion = (L.completion(state.width, state.startX, L.clientX(touchMove)))
  if (completion > 0) return R.assoc("completion", 0, state)
  return R.assoc("completion", L.completion(state.width, state.startX, L.clientX(touchMove)), state)
})
function Runner(ss: ISource) {
  const noAnime = D.addClass(ss.containerEL, "no-anime")
  const anime = D.removeClass(ss.containerEL, "no-anime")
  const opacity = R.compose(D.style(ss.overlayEL, "opacity"), L.opacityCSS)
  const transform = R.compose(D.style(ss.slotEL, "transform"), L.translateCSS)

  O.forEach((x: any) => console.log(x.target), ss.touchEnd$)
  const reducer$ = O.merge([
    O.map(touchStartR(ss.rootEL), ss.touchStart$),
    O.map(touchEndR, ss.touchEnd$),
    O.map(touchMoveR, ss.touchMove$)
  ])

  const model$ = O.scan((memory: State, curr: Reducer) => curr(memory), null, reducer$)
  return O.merge([
    O.map((e: State) => D.combine(
      e.isMoving ? noAnime : anime,
      transform(e.completion),
      opacity(e.completion)
    ), model$),
    O.map(D.preventDefault, ss.touchStart$)
  ])
}

export class SideNav extends HTMLElement {
  public slotEL: HTMLElement
  public containerEL: HTMLElement
  public overlayEL: HTMLElement
  private subscription: ISubscription

  constructor() {
    super()
    const root = this.attachShadow({ mode: "open" })
    root.innerHTML = template
    const slotEL = root.querySelector(".side-nav-slot") as HTMLElement
    const containerEL = root.querySelector(".side-nav-container") as HTMLElement
    const overlayEL = root.querySelector(".overlay") as HTMLElement
    this.style.display = "inherit"
    const source = R.merge(DomEvents(this), { slotEL, containerEL, overlayEL }) as ISource
    this.subscription = O.forEach(this.onValue, Runner(source))
  }

  private onValue(task: ITask) {
    task.run()
  }

  disconnectedCallback() {
    this.subscription.unsubscribe()
  }
}