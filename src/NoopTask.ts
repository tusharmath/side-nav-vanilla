/**
 * Created by tushar.mathur on 03/11/16.
 */

import {ITask, IDispatcher} from '../rwc/Types'

export class NoopTask implements ITask<void> {
  run (dispatch: IDispatcher<void>): void {
  }
}
