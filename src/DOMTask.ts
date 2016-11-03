/**
 * Created by tushar.mathur on 03/11/16.
 */

import {render, VNode} from 'preact'
import {IViewFunction} from './types/IViewFunction'
import {IDispatcher, ITask} from '../rwc/Types'
export {h} from 'preact'

export class EventDispatcherFactory {
  constructor (private dispatcher: IDispatcher<Event>) {
  }

  of (name: string) {
    return (ev: Event) => this.dispatcher.dispatch(name, ev)
  }
}

export class DOMTask implements ITask<Event> {
  constructor (private element: HTMLElement, private view: IViewFunction) {
  }

  run (dispatch: IDispatcher<Event>): void {
    render(this.view(new EventDispatcherFactory(dispatch)), this.element)
  }
}
