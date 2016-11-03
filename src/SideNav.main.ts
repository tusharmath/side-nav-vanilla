/**
 * Created by tushar.mathur on 03/11/16.
 */


import * as O from 'observable-air'
import * as T from './Tasks'
import {view} from './SideNav.view'
import {IAction, ITask} from '../rwc/Types'

const just = <T> (value: T) => O.fromArray([value])

export function main (root: HTMLElement, action$: O.IObservable<IAction<any>>): O.IObservable<ITask<any>> {
  const shadowRoot = root.shadowRoot as HTMLElement
  O.forEach(x => console.log(x), action$)
  return O.merge([
    just(T.dom(shadowRoot, view)),
    O.map(T.noop, action$)
  ])
}
