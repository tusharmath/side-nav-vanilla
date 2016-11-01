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
const initialState = (q: { nav: SideNav, touchStart: TouchEvent }) => ({
  width: L.bcrWidth(q.nav),
  startX: L.clientX(q.touchStart),
  completion: 0,
  isMoving: true
})
const touchStartR = R.curry(function (nav: SideNav, touchStart: TouchEvent, state: State) {
  return initialState({ nav, touchStart })
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
function Runner(nav: SideNav) {
  const noAnime = D.addClass(nav.containerEL, "no-anime")
  const anime = D.removeClass(nav.containerEL, "no-anime")
  const opacity = R.compose(D.style(nav.overlayEL, "opacity"), L.opacityCSS)
  const transform = R.compose(D.style(nav.slotEL, "transform"), L.translateCSS)

  const EV = DomEvents(nav)


  const reducer$ = O.merge([
    O.map(touchStartR(nav), EV.touchStart$),
    O.map(touchEndR, EV.touchEnd$),
    O.map(touchMoveR, EV.touchMove$)
  ])

  const model$ = O.scan((memory: State, curr: Reducer) => curr(memory), null, reducer$)
  return O.merge([
    O.map((e: State) => e.isMoving ? noAnime : anime, model$),
    O.map((e: State) => transform(e.completion), model$),
    O.map((e: State) => opacity(e.completion), model$),
    O.map(D.preventDefault, EV.touchStart$)
  ])
}

export class SideNav extends HTMLElement {
  private root: DocumentFragment
  public slotEL: HTMLElement
  public containerEL: HTMLElement
  public overlayEL: HTMLElement
  private width: number
  private startX: number
  private subscription: ISubscription
  private __completion = 0

  constructor() {
    super()
    this.root = this.attachShadow({ mode: "open" })
    this.root.innerHTML = template
    this.slotEL = this.root.querySelector(".side-nav-slot") as HTMLElement
    this.containerEL = this.root.querySelector(".side-nav-container") as HTMLElement
    this.overlayEL = this.root.querySelector(".overlay") as HTMLElement
    this.style.display = "inherit"
    const observer = O.Observer.of<ITask<SideNav>>(this.onValue)
    this.subscription = O.subscribe(Runner(this), observer)
  }

  private onValue(task: ITask<SideNav>) {
    task.run(this)
  }

  disconnectedCallback() {
    this.subscription.unsubscribe()
  }
}