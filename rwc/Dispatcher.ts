/**
 * Created by tushar.mathur on 04/11/16.
 */
import * as O from 'observable-air'
import {Action} from './Action'


export class Dispatcher<A> {
  constructor (private fac: <T>(v: T) => Action<T>,
               private subject = O.subject<Action<A>>()) {
  }

  listen = (value: A) => {
    this.subject.next(this.fac(value))
  }

  get event$ () {
    return this.subject as O.IObservable<Action<A>>
  }

  of<T> (type: string) {
    return new Dispatcher(
      (value: T) => this.fac(new Action(type, value)),
      this.subject
    )
  }

  select (type: string) {
    return Dispatcher.select(type, this.event$)
  }

  static of <T> (type: string) {
    return new Dispatcher((v: T) => new Action(type, v))
  }

  static select <T> (type: string, source: O.IObservable<Action<T>>) {
    return O.map(x => x.params, O.filter(x => x.type === type, source))
  }
}

