/**
 * Created by tushar.mathur on 03/11/16.
 */


import {render, VNode} from 'preact'
import {Task} from '../rwc/Task'
export {h} from 'preact'

let result: Element
const element = document.querySelector('#app')

export class RequestRootTask implements Task {
  private element: Element

  constructor (private selector: string) {
  }

  run () {
    this.element = document.querySelector(this.selector)
  }
}
export class DOMTask implements Task {
  constructor (private view: JSX.Element) {
  }

  run () {
    result = render(this.view, element, result)
  }
}
export class PreventDefaultTask implements Task {
  constructor (private event: Event) {
  }

  run () {
    this.event.preventDefault()
  }
}

export default {
  dom: (view: JSX.Element) => new DOMTask(view),
  preventDefault: (ev: Event) => new PreventDefaultTask(ev),
  querySelector: (selector: string) => new RequestRootTask(selector)
}
