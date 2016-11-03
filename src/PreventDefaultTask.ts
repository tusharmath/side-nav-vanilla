/**
 * Created by tushar.mathur on 04/11/16.
 */

import {ITask, IDispatcher} from '../rwc/Types'


export class PreventDefaultTask implements ITask<void> {
  constructor (private event: Event) {
  }

  run (dispatch: IDispatcher<void>): void {
    this.event.preventDefault()
  }
}
