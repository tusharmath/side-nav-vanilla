import { IObservable } from "observable-air/.dist/src/types/core/IObservable"

export interface ISource {
  click$: IObservable<MouseEvent>,
  isVisible$: IObservable<boolean>
}
