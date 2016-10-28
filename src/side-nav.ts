import template from "./template"
import * as L from "./lib"

export class SideNav extends HTMLElement {
  private root: DocumentFragment
  private slotEL: HTMLElement
  private containerEL: HTMLElement
  private width: number
  private startX: number
  private __translateX = 0
  private isMoving = false

  constructor() {
    super()
    this.bind()
    this.root = this.attachShadow({ mode: "open" })
    this.root.innerHTML = template
    this.slotEL = this.root.querySelector(".side-nav-slot") as HTMLElement
    this.containerEL = this.root.querySelector(".side-nav-container") as HTMLElement
    this.style.display = "inherit"
    this.slotEL.addEventListener("touchstart", this.onStart)
    this.slotEL.addEventListener("mousedown", this.onStart)
    this.slotEL.addEventListener("touchmove", this.onMove)
    this.slotEL.addEventListener("mousemove", this.onMove)
    this.slotEL.addEventListener("touchend", this.onEnd)
    this.slotEL.addEventListener("mouseup", this.onEnd)
    this.containerEL.addEventListener("click", (ev: MouseEvent) => {
      if (!ev.target.matches(".side-nav-slot")) this.hide()
    })
  }

  private set translateX(translateX: number) {
    if (translateX > 0) return
    this.__translateX = translateX
    this.slotEL.style.transform = `translateX(${translateX * 100}%)`
  }
  private get translateX() {
    return this.__translateX
  }
  private set animate(value: boolean) {
    if (value) {
      this.slotEL.classList.remove("no-anime")
    } else {
      this.slotEL.classList.add("no-anime")
    }
  }
  private set overlay(value: boolean) {
    if (value) {
      this.containerEL.classList.remove("no-show")
    } else {
      this.containerEL.classList.add("no-show")
    }
  }

  private bind() {
    this.onStart = this.onStart.bind(this)
    this.onMove = this.onMove.bind(this)
    this.onEnd = this.onEnd.bind(this)
  }

  private onStart(event: TouchEvent | MouseEvent) {
    this.isMoving = true
    this.width = L.bcrWidth(this.slotEL)
    this.startX = L.clientX(event) / this.width
    this.animate = false
  }

  private onMove(event: TouchEvent | MouseEvent) {
    if (!this.isMoving) return
    this.translateX = L.clientX(event) / this.width - this.startX
  }

  private onEnd(event: TouchEvent | MouseEvent) {
    this.isMoving = false
    this.animate = true
    if (Math.abs(this.translateX) > 0.25) {
      this.hide()
    } else {
      this.show()
    }
  }

  hide() {
    this.translateX = -1.05
    this.overlay = false
  }

  show() {
    this.translateX = 0
    this.overlay = true
  }
}