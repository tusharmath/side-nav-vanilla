import * as R from "ramda"
import { ITask } from "./types/ITask"

export class AddClassTask implements ITask {
  constructor(private element: HTMLElement, private className: string) { }
  run() {
    this.element.classList.add(this.className)
  }
}
export class RemoveClassTask implements ITask {
  constructor(private element: HTMLElement, private className: string) { }
  run() {
    this.element.classList.remove(this.className)
  }
}
export class SetStyleTask implements ITask {
  constructor(private element: HTMLElement, private property: string, private value: string) { }
  run() {
    this.element.style.setProperty(this.property, this.value)
  }
}
export class PreventDefaultTask implements ITask {
  constructor(private event: Event) { }
  run() {
    this.event.preventDefault()
  }
}
export class TaskList implements ITask {
  constructor(private tasks: Array<ITask> = []) { }
  run() {
    this.tasks.forEach(t => t.run())
  }
}
export class Noop implements ITask {
  run() { }
}
export class ToggleClassTask implements ITask {
  constructor(private element: HTMLElement, private className: string, private show: boolean) { }
  run() {
    if (this.show) {
      this.element.classList.add(this.className)
    } else {
      this.element.classList.remove(this.className)
    }
  }
}
export default {
  addClass: (element: HTMLElement, className: string) => new AddClassTask(element, className),
  removeClass: (element: HTMLElement, className: string) => new RemoveClassTask(element, className),
  style: R.curry((element: HTMLElement, property: string, value: string) => new SetStyleTask(element, property, value)),
  preventDefault: (event: Event) => new PreventDefaultTask(event),
  combine: (...tasks: Array<ITask>) => new TaskList(tasks),
  noop: () => new Noop(),
  toggleClass: R.curry((element: HTMLElement, className: string, show: boolean) => new ToggleClassTask(element, className, show))
}