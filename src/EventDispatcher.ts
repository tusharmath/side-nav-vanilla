/**
 * Created by tushar.mathur on 03/11/16.
 */

import {Dispatcher} from '../rwc/Dispatcher'

export class EventDispatcher extends Dispatcher<Event> {
  private cache = new Map<string, EventListener>()

  get (name: string): EventListener {
    if (this.cache.has(name)) return this.cache.get(name)
    const listener = (ev: Event) => this.dispatch(name, ev)
    this.cache.set(name, listener)
    return listener
  }
}

export function dispatcher () {
  return new EventDispatcher()
}
