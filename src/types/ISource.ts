import { IObservable } from "observable-air/.dist/src/types/core/IObservable"

export interface ISource {
  click$: IObservable<MouseEvent>,
  containerEL: HTMLElement,
  isVisible$: IObservable<boolean>,
  overlayEL: HTMLElement,
  rootEL: HTMLElement,
  slotEL: HTMLElement,
  touchEnd$: IObservable<TouchEvent>,
  touchMove$: IObservable<TouchEvent>,
  touchStart$: IObservable<TouchEvent>
}