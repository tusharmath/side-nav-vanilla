/**
 * Created by tushar.mathur on 04/11/16.
 */

import {h} from 'preact'
import * as O from 'observable-air'
import t from '../Tasks'
import SideNav from './SideNav'
import MenuItems from './MenuItems'
import {Model} from '../types/Model'
import {Dispatcher, dispatcher} from '../../rwc/Dispatcher'

const HorizontalNav = (d: Dispatcher<Event>) => h('div', {className: 'horizontal-nav'},
  h('i', {className: 'material-icons', onClick: d.listener('show')}, 'menu')
)
export const view = (d: Dispatcher<Event>, state: Model, menuItems: JSX.Element, horizontalNav: JSX.Element) =>
  h('div', null,
    horizontalNav,
    SideNav.view(d, state, menuItems)
  )

export function main () {
  const snDispatcher = dispatcher()
  const snReducer$ = SideNav.update(snDispatcher)
  const state$ = O.scan((f, v) => f(v), SideNav.init(), snReducer$)
  const menuItemsView = MenuItems.view(snDispatcher)
  const horizontalNavView = HorizontalNav(snDispatcher)

  return O.map(model => t.dom(view(snDispatcher, model, menuItemsView, horizontalNavView)), state$)
}
