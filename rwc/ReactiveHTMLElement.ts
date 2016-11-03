/**
 * Created by tushar.mathur on 03/11/16.
 */

import * as O from 'observable-air'

export interface IAction<T> {
  type: string
  params: T
}

export interface ITask<T> {
  run(dispatch: IDispatcher<T>): void
}

export interface IDispatcher<T> {
  (action: IAction<T>): void
}

export interface IMain<T> {
  (el: ReactiveHTMLElement, $: O.IObservable<IAction<T>>): O.IObservable<ITask<T>>
}

export abstract class ReactiveHTMLElement extends HTMLElement {
  private subscription: O.ISubscription
  protected observer: O.IObserver<IAction<any>>
  protected dispatch: IDispatcher<any>

  constructor (private main: IMain<any>) {
    super()

  }

  connectedCallback () {
    const intent$ = new O.Observable<IAction<any>>((observer) => void (this.observer = observer))
    this.dispatch = (action: IAction<any>) => this.observer.next(action)
    const runTasks = (task: ITask<any>) => task.run(this.dispatch)
    this.subscription = O.forEach(runTasks, this.main(this, intent$))
  }

  disconnectedCallback () {
    this.subscription.unsubscribe()
  }
}
