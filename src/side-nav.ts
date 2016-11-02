import * as O from "observable-air"
import * as R from "ramda"
import { ISubscription } from "observable-air/.dist/src/types/core/ISubscription"
import { IObservable } from "observable-air/.dist/src/types/core/IObservable"
import { IObserver } from "observable-air/.dist/src/types/core/IObserver"
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
  click$: IObservable<MouseEvent>,
  containerEL: HTMLElement,
  isVisible: IObservable<boolean>,
  overlayEL: HTMLElement,
  rootEL: HTMLElement,
  slotEL: HTMLElement,
  touchEnd$: IObservable<TouchEvent>,
  touchMove$: IObservable<TouchEvent>,
  touchStart$: IObservable<TouchEvent>
}

type Reducer = { (s: State): State }

function DomEvents(containerEL: HTMLElement) {
  const containerEV = O.fromDOM(containerEL)
  return {
    touchMove$: containerEV("touchmove"),
    touchStart$: containerEV("touchstart"),
    touchEnd$: containerEV("touchend"),
    click$: containerEV("click")
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
  if (completion < 0 || completion === 0 && touchEnd.target.matches(".overlay"))
    return R.merge(state, { completion: -1.0, isMoving: false })
  return R.assoc("isMoving", false, state)
})
const touchMoveR = R.curry(function (touchMove: TouchEvent, state: State) {
  const completion = (L.completion(state.width, state.startX, L.clientX(touchMove)))
  if (completion > 0) return R.assoc("completion", 0, state)
  return R.assoc("completion", L.completion(state.width, state.startX, L.clientX(touchMove)), state)
})
function Runner(ss: ISource) {
  const noAnime = D.classIf(ss.containerEL, "no-anime")
  const noShow = D.classIf(ss.containerEL, "no-show")
  const opacity = R.compose(D.style(ss.overlayEL, "opacity"), L.opacityCSS)
  const transform = R.compose(D.style(ss.slotEL, "transform"), L.translateCSS)
  const show = D.combine(
    transform(0),
    opacity(0)
  )
  const hide = D.combine(
    transform(-1),
    opacity(-1)
  )

  const reducer$ = O.merge([
    O.map(touchStartR(ss.rootEL), ss.touchStart$),
    O.map(touchEndR, ss.touchEnd$),
    O.map(touchMoveR, O.rafThrottle(ss.touchMove$))
  ])

  const model$ = O.scan((memory: State, curr: Reducer) => curr(memory), null, reducer$)
  return O.merge([
    O.map((e: State) => {
      return D.combine(
        noAnime(e.isMoving),
        transform(e.completion),
        opacity(e.completion),
        noShow(e.completion <= -1)
      )
    }, model$),
    // O.map(D.preventDefault, ss.touchStart$),
    O.map(e => e ? show : hide, ss.isVisible)
  ])
}

export class SideNav extends HTMLElement {
  private subscription: ISubscription
  private observer: IObserver<boolean>

  constructor() {
    super()
    const root = this.attachShadow({ mode: "open" })
    root.innerHTML = template
    this.style.display = "inherit"
    const slotEL = root.querySelector(".side-nav-slot") as HTMLElement
    const containerEL = root.querySelector(".side-nav-container") as HTMLElement
    const overlayEL = root.querySelector(".overlay") as HTMLElement
    const isVisible = new O.Observable((observer) => {
      this.observer = observer
    })
    const source = R.merge(DomEvents(containerEL), { slotEL, containerEL, overlayEL, rootEL: this, isVisible })
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
