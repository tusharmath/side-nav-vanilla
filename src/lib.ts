export function clientX(event: TouchEvent | MouseEvent) {
  if (event instanceof MouseEvent) {
    return event.clientX
  }
  return event.changedTouches[0].clientX
}
export function bcrWidth(element: HTMLElement) {
  return element.getBoundingClientRect().width
}