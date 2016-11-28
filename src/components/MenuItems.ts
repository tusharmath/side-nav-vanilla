/**
 * Created by tushar.mathur on 04/11/16.
 */

import {h} from '../Tasks'
import {Dispatcher} from '../../rwc/Dispatcher'
export const view = (d: Dispatcher<Event>) =>
  h('div', [
    h('div.navbar-header', [
      h('div', [
        h('i.material-icons', {on: {click: d.of('hide').listen}}, ['close'])
      ]),
      h('div.nav-title', ['Side Nav Demo'])
    ]),
    h('ul.nav', [
      h('li', ['Apples']),
      h('li', ['Bananas']),
      h('li', ['Grapes']),
      h('li', ['Camphor'])
    ])
  ])
export default {view}
