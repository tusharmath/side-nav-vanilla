/**
 * Created by tushar.mathur on 03/11/16.
 */

import {IDispatcher} from './Types'

export class EventListenerCache {
  private cache = new Map<string, EventListener>()

  constructor (private dispatcher: IDispatcher<Event>) {
  }

  of (name: string): EventListener {
    if (this.cache.has(name)) return this.cache.get(name)
    const listener = (ev: Event) => this.dispatcher.dispatch(name, ev)
    this.cache.set(name, listener)
    return listener
  }
}

export function listen (dispatcher: IDispatcher<Event>) {
  return new EventListenerCache(dispatcher)
}
