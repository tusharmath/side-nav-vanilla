/**
 * Created by tushar.mathur on 03/11/16.
 */

import {DOMTask} from './DOMTask'
import * as R from 'ramda'
import {PreventDefaultTask} from './PreventDefaultTask'

export const dom = R.curry((root: HTMLElement, view: JSX.Element) => {
  return new DOMTask(root, view)
})
export function preventDefault (ev: Event) {
  return new PreventDefaultTask(ev)
}
