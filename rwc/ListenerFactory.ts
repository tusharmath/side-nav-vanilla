/**
 * Created by tushar.mathur on 03/11/16.
 */

import {Dispatcher} from './Dispatcher'

export class EventListenerCache extends Dispatcher<Event> {
  private cache = new Map<string, EventListener>()

  of (name: string): EventListener {
    if (this.cache.has(name)) return this.cache.get(name)
    const listener = (ev: Event) => this.dispatch(name, ev)
    this.cache.set(name, listener)
    return listener
  }
}

export function listen () {
  return new EventListenerCache()
}
