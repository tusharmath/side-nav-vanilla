/**
 * Created by tushar.mathur on 04/11/16.
 */

import {listen} from '../../rwc/ListenerFactory'
import {h} from 'preact'
import * as O from 'observable-air'
import t from '../Tasks'
import SideNav from './SideNav'
import MenuItems from './MenuItems'
import {Task} from '../../rwc/Task'

const just = O.Observable.of
export const view = (vNode: JSX.Element) =>
  h('div', null,
    h('div', {className: 'horizontal-nav'},
      h('i', {className: 'material-icons'}, 'menu')
    ),
    vNode
  )

export function main () {
  const listener = listen()
  return O.merge([
    just<Task>(t.dom(view(SideNav.view(listener, {}, MenuItems.view()))))
  ])
}
