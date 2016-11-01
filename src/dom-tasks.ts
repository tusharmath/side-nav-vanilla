import * as R from "ramda"
import { ITask } from "./types/ITask"

export class AddClassTask implements ITask<void> {
  constructor(private element: HTMLElement, private className: string) { }
  run() {
    this.element.classList.add(this.className)
  }
}
export class RemoveClassTask implements ITask<void> {
  constructor(private element: HTMLElement, private className: string) { }
  run() {
    this.element.classList.remove(this.className)
  }
}
export class SetStyleTask implements ITask<void> {
  constructor(private element: HTMLElement, private property: string, private value: string) { }
  run() {
    this.element.style.setProperty(this.property, this.value)
  }
}
export class PreventDefaultTask implements ITask<void> {
  constructor(private event: Event) { }
  run() {
    this.event.preventDefault()
  }
}

export default {
  addClass: (element: HTMLElement, className: string) => new AddClassTask(element, className),
  removeClass: (element: HTMLElement, className: string) => new RemoveClassTask(element, className),
  style: R.curry((element: HTMLElement, property: string, value: string) => new SetStyleTask(element, property, value)),
  preventDefault: (event: Event) => new PreventDefaultTask(event)
}