/**
 * Created by tushar.mathur on 04/11/16.
 */

import {dispatcher, EventDispatcher} from '../EventDispatcher'
import {h} from 'preact'
import * as O from 'observable-air'
import t from '../Tasks'
import SideNav from './SideNav'
import MenuItems from './MenuItems'
import {SideNavState} from '../types/SideNavState'

export const view = (ev: EventDispatcher, state: SideNavState) =>
  h('div', null,
    h('div', {className: 'horizontal-nav'},
      h('i', {className: 'material-icons', onClick: ev.get('show')}, 'menu')
    ),
    SideNav.view(ev, state, MenuItems.view(ev))
  )

export function main () {
  const d = dispatcher()
  const reducer$ = SideNav.reducer(d)
  const state$ = O.scan((f, v) => f(v), {}, reducer$)

  return O.merge([
    O.map(model => t.dom(view(d, model)), state$)
  ])
}
