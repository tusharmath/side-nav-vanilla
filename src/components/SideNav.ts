/**
 * Created by tushar.mathur on 04/11/16.
 */

import {EventListenerCache} from '../../rwc/ListenerFactory'
import {h} from 'preact'
import * as R from 'ramda'

interface ISideNavState {

}

export const view = R.curry((f: EventListenerCache, state: ISideNavState, children: JSX.Element) =>
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
      children
    )
  )
)

export default {view}
