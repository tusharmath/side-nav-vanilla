export interface ITask<T> {
  run(params: T): void
}
