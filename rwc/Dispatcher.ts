/**
 * Created by tushar.mathur on 04/11/16.
 */

import * as O from 'observable-air'
import {Action} from './Action'


const params = <T> (x: Action<T>) => x.params
export class Dispatcher<T> {
  private observer: O.IObserver<Action<any>>
  private action$: O.IObservable<Action<any>> = O.multicast(new O.Observable(
    (ob: O.IObserver<Action<any>>) => void( this.observer = ob))
  )


  dispatch <T> (type: string, params: T = null) {
    this.observer.next(new Action(type, params))
  }

  select<T> (type: string) {
    return O.map(
      params,
      O.filter((x: Action<T>) => x.type === type, this.action$)
    )
  }
}
