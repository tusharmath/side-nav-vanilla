import { ICyclePro } from "./ICyclePro"
export interface IDriver<A, B> {
  source(root: ICyclePro): A
  sink(sink: B): void
  dispose(): void
}
