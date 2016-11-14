/**
 * Created by tushar.mathur on 04/11/16.
 */

import {h} from 'preact'
import {Dispatcher} from '../../rwc/Dispatcher'
export const view = (ev: Dispatcher<Event>) =>
  h('div', null,
    h('div', {className: 'navbar-header'},
      h('div', null,
        h('i', {className: 'material-icons', onClick: ev.listener('hide')}, 'close')
      ),
      h('div', {className: 'nav-title'}, 'Side Nav Demo')
    ),
    h('ul', {className: 'nav'},
      h('li', null, 'Apples'),
      h('li', null, 'Bananas'),
      h('li', null, 'Grapes'),
      h('li', null, 'Camphor')
    )
  )
export default {view}
