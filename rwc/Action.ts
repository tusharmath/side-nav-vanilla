/**
 * Created by tushar.mathur on 03/11/16.
 */


export class Action<T> {
  constructor (public type: string, public params: T) {
  }
}
