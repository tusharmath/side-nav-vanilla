/**
 * Created by tushar.mathur on 03/11/16.
 */


import {IAction, ITask} from '../rwc/ReactiveHTMLElement'
import * as O from 'observable-air'
import {dom} from './DOMTask'
import {view} from './SideNav.view'

export function main (root: HTMLElement, intent$: O.IObservable<IAction<any>>): O.IObservable<ITask<any>> {
  return O.fromArray([
    dom(root.shadowRoot as HTMLElement, view)
  ])
}
