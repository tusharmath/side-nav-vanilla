import {IAction} from './Types'
/**
 * Created by tushar.mathur on 03/11/16.
 */


export class Action<T> implements IAction<T> {
  constructor (public type: string, public params: T) {
  }

  static of<T> (type: string, params: T) {
    return new Action(type, params)
  }
}
