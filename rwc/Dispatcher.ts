/**
 * Created by tushar.mathur on 04/11/16.
 */

import * as O from 'observable-air'
import {Action} from './Action'


export class Dispatcher<T> {
  private observer: O.IObserver<Action<any>>
  private action$: O.IObservable<Action<any>> = new O.Observable(this.setObserver)

  private setObserver = (observer: O.IObserver<Action<any>>) => {
    this.observer = observer
  }


  dispatch <T> (type: string, params: T = null) {
    this.observer.next(new Action(type, params))
  }

  select<T> (type: string) {
    return O.map(
      x => x.params,
      O.filter((x: Action<T>) => x.type === type, this.action$)
    )
  }
}
