/**
 * Created by tushar.mathur on 03/11/16.
 */

import {ReactiveHTMLElement} from './ReactiveHTMLElement'
import * as O from 'observable-air'

export interface IAction<T> {
  type: string
  params: T
}

export interface ITask<T> {
  run(dispatch: IDispatcher<T>): void
}

export interface IDispatcher<T> {
  dispatch (type: string, params?: T): void
}

export interface IMain<T> {
  (el: ReactiveHTMLElement, $: O.IObservable<IAction<T>>): O.IObservable<ITask<T>>
}
