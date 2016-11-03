/**
 * Created by tushar.mathur on 03/11/16.
 */

import {render, VNode} from 'preact'
import {IDispatcher, ITask} from '../rwc/Types'
export {h} from 'preact'

export class DOMTask implements ITask<Event> {
  constructor (private element: HTMLElement, private view: JSX.Element) {
  }

  run (dispatch: IDispatcher<Event>): void {
    render(this.view, this.element)
  }
}
