/**
 * Created by tushar.mathur on 03/11/16.
 */

import {EventDispatcherFactory} from '../DOMTask'
import {render, VNode} from 'preact'
export {h} from 'preact'

export interface IViewFunction {
  (d: EventDispatcherFactory): JSX.Element
}
