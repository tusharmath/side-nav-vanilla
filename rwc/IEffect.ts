import { IReactiveWebComponent } from "./IReactiveWebComponent"

export interface IEffect {
  run(component: IReactiveWebComponent): void
}