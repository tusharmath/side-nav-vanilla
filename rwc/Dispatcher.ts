/**
 * Created by tushar.mathur on 04/11/16.
 */

import * as O from 'observable-air'
import {Action} from './Action'


const params = <T> (x: Action<T>) => x.params
export class Dispatcher<T> {
  private subject: O.IObservable<Action<T>> & O.IObserver<Action<T>> = O.subject()


  dispatch (type: string, params: T = null) {
    this.subject.next(new Action(type, params))
  }

  select<T> (type: string) {
    return O.map(
      params,
      O.filter((x: Action<T>) => x.type === type, this.subject)
    )
  }
}
