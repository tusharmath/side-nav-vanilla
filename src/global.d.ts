/// <reference path="../typings/index.d.ts" />

interface CustomElementRegistry {
  define(name: string, element: Function): void
}
interface Window {
  customElements: CustomElementRegistry
}
interface ShadowMode {
  mode: string
}
interface HTMLElement {
  attachShadow(mode: ShadowMode): DocumentFragment
  shadowRoot: HTMLElement
}
interface DocumentFragment {
  innerHTML: string
}
interface EventTarget {
  matches(selector: string): boolean
}
