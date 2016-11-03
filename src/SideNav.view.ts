/**
 * Created by tushar.mathur on 03/11/16.
 */

import {h} from 'preact'
import {ListenerFactory} from '../rwc/ListenerFactory'

export const view = (f: ListenerFactory) =>
  h("div", {
      className: 'side-nav-container',
      onTouchMove: f.of('container.touchMove'),
      onTouchStart: f.of('container.touchStart'),
      onTouchEnd: f.of('container.touchEnd'),
      onClick: f.of('overlay.click')
    },
    h("div", {
      className: 'overlay',
      onTouchEnd: f.of('overlay.touchEnd'),
      onClick: f.of('overlay.click')
    }),
    h("div", {className: 'side-nav-slot'},
      h("slot", null)
    )
  )

