/**
 * Created by tushar.mathur on 03/11/16.
 */

import {DOMTask} from '../DOMTask'
import {render, VNode} from 'preact'
export {h} from 'preact'

export interface IViewFunction {
  (dom: DOMTask): JSX.Element
}
