import * as O from 'observable-air'

export interface ITask {
  run(): void
}

export interface IValueTask<T> extends ITask {
  readonly value$: O.IObservable<T>
}
