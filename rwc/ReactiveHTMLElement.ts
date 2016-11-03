/**
 * Created by tushar.mathur on 03/11/16.
 */

import * as O from 'observable-air'
import {IAction, ITask, IMain, IDispatcher} from './Types'
import {Action} from './Action'

export abstract class ReactiveHTMLElement extends HTMLElement implements IDispatcher<any> {
  private subscription: O.ISubscription
  private observer: O.IObserver<IAction<any>>
  private action$: O.IObservable<IAction<any>>

  constructor (private main: IMain<any>) {
    super()
  }

  connectedCallback () {
    this.action$ = O.multicast(new O.Observable<IAction<any>>((observer) => {
      this.observer = observer
    }))
    const runTasks = (task: ITask<any>) => task.run(this)
    this.subscription = O.forEach(runTasks, this.main(this, this.action$))
  }

  dispatch <T> (type: string, params: T = null) {
    this.observer.next(Action.of(type, params))
  }

  select<T> (type: string) {
    return O.map(
      x => x.params,
      O.filter((x: IAction<T>) => x.type === type, this.action$)
    )
  }

  disconnectedCallback () {
    this.subscription.unsubscribe()
  }
}
