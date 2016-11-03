/**
 * Created by tushar.mathur on 03/11/16.
 */

import {IViewFunction} from './types/IViewFunction'
import {DOMTask} from './DOMTask'
import {NoopTask} from './NoopTask'

export function dom (root: HTMLElement, view: IViewFunction) {
  return new DOMTask(root, view)
}
export function noop () {
  return new NoopTask()
}
