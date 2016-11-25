/**
 * Created by tushar.mathur on 04/11/16.
 */
import {h} from 'preact'
import * as O from 'observable-air'
import * as R from 'ramda'
import t from '../Tasks'
import SideNav from './SideNav'
import MenuItems from './MenuItems'
import {Model} from '../types/Model'
import {Dispatcher} from '../../rwc/Dispatcher'
import {Task} from '../../rwc/Task'
import * as HorizontalNav from './HorizontalNav'

export const view = (d: Dispatcher<Event>, model: Model, children: {menuItems: JSX.Element, horizontalNav: JSX.Element}) => {
  return h('div', null,
    children.horizontalNav,
    SideNav.view(
      d.of('side-nav'),
      model.sideNav,
      children.menuItems
    )
  )
}
export function main (): O.IObservable<Task> {
  const d = Dispatcher.of('@root')
  const dRoot = d.select('@root')
  const snReducer$ = SideNav.update({
    ev: Dispatcher.select('side-nav', dRoot),
    show$: Dispatcher.select('horizontal-nav', dRoot),
    hide$: Dispatcher.select('menu-items', dRoot)
  })
  const model$ = O.scan((f, v) => R.assoc('sideNav', f(v.sideNav), v), {sideNav: SideNav.init()}, snReducer$)
  const menuItems = MenuItems.view(d.of('menu-items'))
  const horizontalNav = HorizontalNav.view(d.of('horizontal-nav'))
  return O.map<Model, Task>(model =>
    t.dom(view(d, model, {menuItems, horizontalNav})), model$
  )
}
