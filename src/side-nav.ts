import template from "./template"

export class SideNav extends HTMLElement {
  private root: DocumentFragment
  constructor() {
    super()
    this.root = this.attachShadow({ mode: "open" })
    this.root.innerHTML = template
    this.style.display = "inherit"
  }
}