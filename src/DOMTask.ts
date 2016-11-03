/**
 * Created by tushar.mathur on 03/11/16.
 */

import {ITask, IDispatcher} from '../rwc/ReactiveHTMLElement'
import {render, VNode} from 'preact'
import {IViewFunction} from './types/IViewFunction'
export {h} from 'preact'


export class DOMTask implements ITask<void> {
  constructor (private element: HTMLElement, private view: IViewFunction) {
  }

  dispatch (name: string) {

  }

  run (dispatch: IDispatcher<void>): void {
    render(this.view(this), this.element)
  }
}

export function dom (root: HTMLElement, view: IViewFunction) {
  return new DOMTask(root, view)
}
