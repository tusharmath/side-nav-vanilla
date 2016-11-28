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
  shadowRoot: DocumentFragment
  attachShadow(mode: ShadowMode): DocumentFragment
}
interface DocumentFragment {
  innerHTML: string
}
interface EventTarget {
  matches(selector: string): boolean
}
