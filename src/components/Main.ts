/**
 * Created by tushar.mathur on 04/11/16.
 */

import {EventListenerCache} from '../../rwc/ListenerFactory'
import {h} from 'preact'
import {IDispatcher, ITask} from '../../rwc/Types'
import * as O from 'observable-air'
import t from '../Tasks'
import SideNav from './SideNav'
import MenuItems from './MenuItems'

const just = O.Observable.of
export const view = (vNode: JSX.Element) =>
  h('div', null,
    h('div', {className: 'horizontal-nav'},
      h('i', {className: 'material-icons'}, 'menu')
    ),
    vNode
  )

export function main (dispatcher: IDispatcher<Event>) {
  const listener = new EventListenerCache(dispatcher)
  return O.merge([
    just<ITask<void>>(t.dom(view(SideNav.view(listener, {}, MenuItems.view()))))
  ])
}
