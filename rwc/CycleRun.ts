/**
 * Created by tushar.mathur on 04/11/16.
 */

import * as O from 'observable-air'
import {Action} from './Action'
import {IAction, ITask, IMainFunction, IDispatcher} from './Types'

export class CycleRun implements IDispatcher<any> {
  private observer: O.IObserver<IAction<any>>
  private action$: O.IObservable<IAction<any>>
  private subscription: O.ISubscription

  constructor (private main: IMainFunction<any>) {
  }

  private setObserver = (observer: O.IObserver<IAction<any>>) => {
    this.observer = observer
  }

  run () {
    this.action$ = new O.Observable(this.setObserver)
    const task$ = this.main(this) as O.IObservable<ITask<any>>
    this.subscription = O.forEach(x => x.run(this), task$)
  }

  dispatch <T> (type: string, params: T = null) {
    this.observer.next(Action.of(type, params))
  }

  dispose () {
    this.subscription.unsubscribe()
  }

  select<T> (type: string) {
    return O.map(
      x => x.params,
      O.filter((x: IAction<T>) => x.type === type, this.action$)
    )
  }
}

export function runner (main: IMainFunction<any>) {
  return new CycleRun(main)
}
