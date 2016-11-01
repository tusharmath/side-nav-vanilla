import * as R from "ramda"
import * as O from "observable-air"
import { IObservable } from "observable-air/.dist/src/types/core/IObservable"

export function clientX(event: TouchEvent | MouseEvent) {
  if (event instanceof MouseEvent) {
    return event.clientX
  }
  return event.changedTouches[0].clientX
}
export function bcrWidth(element: HTMLElement) {
  return element.getBoundingClientRect().width
}
export function translateCSS(completion: number) {
  return `translateX(${completion * 100}%)`
}
export const completion = R.curry((width: number, startX: number, currentX: number) => {
  return (currentX - startX) / width
})
export function mapTo<T>(value: T) {
  return O.map(R.always(value))
}
export function pluck<T>(prop: string, source$: IObservable<T>) {
  return O.map(R.pluck(prop))
}
export function opacityCSS(completion: number) {
  return (completion + 1).toString()
}