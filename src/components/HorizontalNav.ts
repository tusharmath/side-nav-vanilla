/**
 * Created by tushar.mathur on 15/11/16.
 */

import {Dispatcher} from '../../rwc/Dispatcher'
import {h} from 'preact'

export const view = (d: Dispatcher<Event>) => h('div', {className: 'horizontal-nav'},
  h('i', {className: 'material-icons', onClick: d.of('show').listen}, 'menu')
)
