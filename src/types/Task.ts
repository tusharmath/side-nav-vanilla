import * as O from 'observable-air'

export interface Task {
  run(): void
}

export interface ValueTask<T> extends Task {
  readonly value$: O.IObservable<T>
}
