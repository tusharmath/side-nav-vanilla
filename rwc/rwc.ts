import { IReactiveWebComponent } from "./IReactiveWebComponent"
import { IAction } from "./IAction"
import { IEffect } from "./IEffect"
import { IEffectFunction } from "./IEffectFunction"

export const RWC = {
  INIT: "@@rwc/init"
}

export class ReactiveWebComponent extends HTMLElement implements IReactiveWebComponent {
  constructor(private runner: IEffectFunction) {
    super()
    this.dispatch = this.dispatch.bind(this)
    runner(RWC.INIT).run(this)
  }

  dispatch(action: IAction) {
    this.runner(action).run(this)
  }
}
