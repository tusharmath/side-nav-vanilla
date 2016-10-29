import { IAction } from "./IAction"
import { IEffect } from "./IEffect"

export interface IEffectFunction {
  (action: IAction): IEffect
}