/**
 * Created by tushar.mathur on 03/11/16.
 */


import {Task} from '../rwc/Task'
import {VNode} from 'snabbdom'
import {IVNode} from './types/IVNode'
declare function require (path: string): any
const snabbdom = require('snabbdom')

const patch = snabbdom.init([
  require('snabbdom/modules/class'),
  require('snabbdom/modules/props'),
  require('snabbdom/modules/style'),
  require('snabbdom/modules/eventlisteners')
])

export interface Props {
  style?: {[name: string]: string},
  on?: any
  'class'?: {[name: string]: boolean}
}

export interface Hyperscript {
  (type: string, props: Props, children: Array<VNode|string>): VNode
  (type: string, children: Array<VNode|string>): VNode
  (type: string, props: Props): VNode
  (type: string): VNode
}

export const h = require('snabbdom/h') as Hyperscript
let element = document.querySelector('#app')

export class DOMTask implements Task {
  constructor (private view: VNode) {
  }

  run () {
    element = patch(element, this.view)
  }
}
export class PreventDefaultTask implements Task {
  constructor (private event: Event) {
  }

  run () {
    this.event.preventDefault()
  }
}

export default {
  dom: (view: IVNode) => new DOMTask(view),
  preventDefault: (ev: Event) => new PreventDefaultTask(ev)
}
