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

const HorizontalNav = (d: EventDispatcher) => h('div', {className: 'horizontal-nav'},
  h('i', {className: 'material-icons', onClick: d.get('show')}, 'menu')
)
export const view = (d: EventDispatcher, state: SideNavState, menuItems: JSX.Element, horizontalNav: JSX.Element) =>
  h('div', null,
    horizontalNav,
    SideNav.view(d, state, menuItems)
  )

export function main () {
  const d = dispatcher()
  const reducer$ = SideNav.reducer(d)
  const state$ = O.scan((f, v) => f(v), {}, reducer$)
  const menuItemsView = MenuItems.view(d)
  const horizontalNavView = HorizontalNav(d)

  return O.merge([
    O.map(model => t.dom(view(d, model, menuItemsView, horizontalNavView)), state$)
  ])
}
