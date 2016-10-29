import { IAction } from "./IAction"

export interface IReactiveWebComponent {
  dispatch(action: IAction): void
}