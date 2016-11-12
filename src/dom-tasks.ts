import * as R from 'ramda'
import * as O from 'observable-air'
import {ITask, IValueTask} from './types/ITask'

export class SetStyleTask implements ITask {
  constructor (private element: HTMLElement,
               private property: string,
               private value: string) {
  }

  run () {
    const style = this.element.style
    if (style.getPropertyValue(this.property) !== this.value)
      style.setProperty(this.property, this.value)
  }
}
export class PreventDefaultTask implements ITask {
  constructor (private event: Event) {
  }

  run () {
    if (this.event.defaultPrevented == false)
      this.event.preventDefault()
  }
}
export class TaskList implements ITask {
  constructor (private tasks: Array<ITask> = []) {
  }

  run () {
    for (var i = 0; i < this.tasks.length; ++i)
      this.tasks[i].run()
  }
}
export class ToggleClassTask implements ITask {
  constructor (private element: HTMLElement,
               private className: string,
               private show: boolean) {
  }

  run () {
    if (this.show) {
      this.element.classList.add(this.className)
    } else {
      this.element.classList.remove(this.className)
    }
  }
}
export class SetInnerHTMLTask implements IValueTask<HTMLElement> {
  value$ = O.subject<HTMLElement>()

  constructor (private el: HTMLElement, private html: string) {
  }

  run () {
    this.el.innerHTML = this.html
    this.value$.next(this.el)
  }
}
export default {
  querySelector: R.curry((root: HTMLElement, selector: string) => root.querySelector(selector) as HTMLElement),
  innerHTML: (el: HTMLElement, value: string) => new SetInnerHTMLTask(el, value),
  style: R.curry((element: HTMLElement, property: string, value: string) => new SetStyleTask(element, property, value)),
  preventDefault: (event: Event) => new PreventDefaultTask(event),
  combine: (...tasks: Array<ITask>) => new TaskList(tasks),
  toggleClass: R.curry((element: HTMLElement, className: string, show: boolean) => new ToggleClassTask(element, className, show))
}
