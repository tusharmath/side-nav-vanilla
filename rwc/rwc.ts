import { IReactiveWebComponent } from "./IReactiveWebComponent"
import { IAction } from "./IAction"
import { IEffect } from "./IEffect"
import { IEffectFunction } from "./IEffectFunction"

export class ReactiveWebComponent extends HTMLElement implements IReactiveWebComponent {
  constructor(private runner: IEffectFunction) {
    super()
    this.dispatch = this.dispatch.bind(this)
    runner("@@rwc/init")
  }

  dispatch(action: IAction) {
    this.runner(action).run(this)
  }
}
