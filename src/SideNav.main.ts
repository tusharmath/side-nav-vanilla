/**
 * Created by tushar.mathur on 03/11/16.
 */


import * as O from 'observable-air'
import * as T from './Tasks'
import {view} from './SideNav.view'
import {IAction} from '../rwc/Types'
import {ReactiveHTMLElement} from '../rwc/ReactiveHTMLElement'
import {listen} from '../rwc/ListenerFactory'

const just = <T> (value: T) => O.fromArray([value])


export function main (root: ReactiveHTMLElement, action$: O.IObservable<IAction<any>>) {
  const shadowRoot = root.shadowRoot as HTMLElement
  const listeners = listen(root)

  O.forEach(x => console.log(x), action$)

  return O.merge([
    just(T.dom(shadowRoot, view(listeners))),
    O.map(T.noop, action$)
  ])
}
