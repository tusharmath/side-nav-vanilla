/**
 * Created by tushar.mathur on 04/11/16.
 */

import {h} from 'preact'
import * as O from 'observable-air'
import t from '../Tasks'
import SideNav from './SideNav'
import MenuItems from './MenuItems'
import {SideNavState} from '../types/SideNavState'
import {Dispatcher, dispatcher} from '../../rwc/Dispatcher'

const HorizontalNav = (d: Dispatcher<Event>) => h('div', {className: 'horizontal-nav'},
  h('i', {className: 'material-icons', onClick: d.listener('show')}, 'menu')
)
export const view = (d: Dispatcher<Event>, state: SideNavState, menuItems: JSX.Element, horizontalNav: JSX.Element) =>
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

  return O.map(model => t.dom(view(d, model, menuItemsView, horizontalNavView)), state$)
}
