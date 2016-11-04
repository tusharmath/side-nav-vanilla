/**
 * Created by tushar.mathur on 03/11/16.
 */

import * as R from 'ramda'
import {ITask, IDispatcher} from '../rwc/Types'
import {render, VNode} from 'preact'
export {h} from 'preact'

let result: Element
const element = document.querySelector('#app')

export class RequestRootTask implements ITask<Element> {
  private element: Element

  constructor (private selector: string) {
  }

  run (dispatcher: IDispatcher<Element>): void {
    this.element = document.querySelector(this.selector)
    dispatcher.dispatch('@@dom/select-root', this.element)
  }
}
export class DOMTask implements ITask<void> {
  constructor (private view: JSX.Element) {
  }

  run (): void {
    result = render(this.view, element, result)
  }
}
export class PreventDefaultTask implements ITask<void> {
  constructor (private event: Event) {
  }

  run (dispatch: IDispatcher<void>): void {
    this.event.preventDefault()
  }
}

export default {
  dom: (view: JSX.Element) => new DOMTask(view),
  preventDefault: (ev: Event) => new PreventDefaultTask(ev),
  querySelector: (selector: string) => new RequestRootTask(selector)
}
