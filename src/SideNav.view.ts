/**
 * Created by tushar.mathur on 03/11/16.
 */

import {h} from 'preact'
import {IViewFunction} from './types/IViewFunction'
import {DOMTask} from './DOMTask'


export const view: IViewFunction = (d: DOMTask) =>
  h("div", {
      className: 'side-nav-container',
      ontouchmove: d.dispatch('container.touchMove'),
      ontouchstart: d.dispatch('container.touchStart'),
      ontouchend: d.dispatch('container.touchEnd'),
      onclick: d.dispatch('overlay.click')
    },
    h("div", {
      className: 'overlay',
      ontouchend: d.dispatch('overlay.touchEnd'),
      onclick: d.dispatch('overlay.click')
    }),
    h("div", {className: 'side-nav-slot'},
      h("slot", null)
    )
  )

