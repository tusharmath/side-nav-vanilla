export function clientX(event: TouchEvent) {
  return event.changedTouches[0].clientX
}
export function bcrWidth(element: HTMLElement) {
  return element.getBoundingClientRect().width
}