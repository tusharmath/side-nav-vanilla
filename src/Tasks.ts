/**
 * Created by tushar.mathur on 03/11/16.
 */

import {DOMTask} from './DOMTask'
import {NoopTask} from './NoopTask'

export function dom (root: HTMLElement, view: JSX.Element) {
  return new DOMTask(root, view)
}
export function noop () {
  return new NoopTask()
}
