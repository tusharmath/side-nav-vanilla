/**
 * Created by tushar.mathur on 15/11/16.
 */

import {Dispatcher} from '../../rwc/Dispatcher'
import {h} from '../Tasks'

export const view = (d: Dispatcher<Event>) => h('div.horizontal-nav', [
  h('i.material-icons', {on: {click: d.of('show').listen}}, ['menu'])
])
