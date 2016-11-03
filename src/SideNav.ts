import {ReactiveHTMLElement} from '../rwc/ReactiveHTMLElement'
import {main} from './SideNav.main'
import {css} from './SideNav.css'

export class SideNav extends ReactiveHTMLElement {
  constructor () {
    super(main)
    const root = this.attachShadow({mode: 'open'})
    root.innerHTML = css()
  }

  show () {
    this.dispatch({type: "@@external/show", params: null})
  }

  hide () {
    this.dispatch({type: "@@external/hide", params: null})
  }
}
