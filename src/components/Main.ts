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
import {Dispatcher, dispatcher} from '../../rwc/Dispatcher'
import {Task} from '../../rwc/Task'
import * as HorizontalNav from './HorizontalNav'

export const view = (d: Dispatcher<Event>, model: Model, menuItems: JSX.Element, horizontalNav: JSX.Element) => {
  return h('div', null,
    horizontalNav,
    SideNav.view(d, model.sideNav, menuItems)
  )
}
export function main (): O.IObservable<Task> {
  const snDispatcher = dispatcher()
  const snReducer$ = SideNav.update(snDispatcher)
  const model$ = O.scan((f, v) => R.assoc('sideNav', f(v.sideNav), v), {sideNav: SideNav.init()}, snReducer$)
  const menuItemsView = MenuItems.view(snDispatcher)
  const horizontalNavView = HorizontalNav.view(snDispatcher)

  return O.map<Model, Task>(model => t.dom(view(snDispatcher, model, menuItemsView, horizontalNavView)), model$)
}
