import template from './template'
import * as L from './lib'

export class SideNav extends HTMLElement {
  private __completion = 0
  private canSet = true
  private containerEL: HTMLElement
  private overlayEL: HTMLElement
  private root: DocumentFragment
  private slotEL: HTMLElement
  private startX: number
  private width: number

  constructor () {
    super()
    this.root = this.attachShadow({mode: "open"})
    this.root.innerHTML = template
    this.slotEL = this.root.querySelector(".side-nav-slot") as HTMLElement
    this.containerEL = this.root.querySelector(".side-nav-container") as HTMLElement
    this.overlayEL = this.root.querySelector(".overlay") as HTMLElement
    this.style.display = "inherit"
    this.containerEL.addEventListener("touchstart", this.onStart)
    this.containerEL.addEventListener("touchmove", this.onMove)
    this.containerEL.addEventListener("touchend", this.onEnd)
    this.containerEL.addEventListener("click", this.onEnd)
  }

  private set completion (completion: number) {
    if (completion > 0) completion = 0
    this.__completion = completion
    this.slotEL.style.transform = `translateX(${completion * 100}%)`
    this.overlayEL.style.opacity = (completion + 1).toString()
  }

  private get completion () {
    return this.__completion
  }

  private set animate (value: boolean) {
    if (value) {
      this.containerEL.classList.remove("no-anime")
    } else {
      this.containerEL.classList.add("no-anime")
    }
  }

  private set overlay (value: boolean) {
    if (value) {
      this.containerEL.classList.remove("no-show")
    } else {
      this.containerEL.classList.add("no-show")
    }
  }

  private onStart = (event: TouchEvent) => {
    event.preventDefault()
    this.width = L.bcrWidth(this.slotEL)
    this.startX = L.clientX(event) / this.width
    this.animate = false
  }

  private onMove = (event: TouchEvent) => {
    if (this.canSet) {
      this.completion = L.clientX(event) / this.width - this.startX
      this.canSet = false
      requestAnimationFrame(() => this.canSet = true)
    }
  }

  private onEnd = (event: TouchEvent | MouseEvent) => {
    this.animate = true
    if (Math.abs(this.completion) > 0 || event.target.matches(".side-nav-container")) {
      this.hide()
    } else {
      this.show()
    }
  }

  hide () {
    this.completion = -1.05
    this.overlay = false
  }

  show () {
    this.completion = 0
    this.overlay = true
  }
}
