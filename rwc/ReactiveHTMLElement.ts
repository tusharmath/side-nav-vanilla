/**
 * Created by tushar.mathur on 03/11/16.
 */

import * as O from 'observable-air'
import {IAction, ITask, IMain, IDispatcher} from './Types'
import {Action} from './Action'

export abstract class ReactiveHTMLElement extends HTMLElement implements IDispatcher<any> {
  private subscription: O.ISubscription
  private observer: O.IObserver<IAction<any>>

  constructor (private main: IMain<any>) {
    super()
  }

  connectedCallback () {
    const action$ = new O.Observable<IAction<any>>((observer) => {
      this.observer = observer
    })
    const runTasks = (task: ITask<any>) => task.run(this)
    this.subscription = O.forEach(runTasks, this.main(this, O.multicast(action$)))
  }

  dispatch <T> (type: string, params: T = null) {
    this.observer.next(Action.of(type, params))
  }

  disconnectedCallback () {
    this.subscription.unsubscribe()
  }
}
