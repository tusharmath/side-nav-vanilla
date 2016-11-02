import { IDriver } from "./types/IDriver"
import { ICyclePro } from "./types/ICyclePro"
import * as R from "ramda"

type Driver = IDriver<any, any>
type Main = <A, B> (source: A) => B
type Drivers = { [name: string]: Driver }

export class CyclePro<A, B> implements ICyclePro {
  constructor(private drivers: Drivers, private main: Main) {
    const source = R.mapObjIndexed((d: Driver) => d.source(this), drivers)
    const sink = main(source as A)
    R.mapObjIndexed((d: any, k: string) => drivers[k].sink(d), sink)
  }

  dispose() {
    R.mapObjIndexed((d: Driver) => d.dispose(), this.drivers)
  }

  static of<A, B>(drivers: Drivers, main: Main) {
    return new CyclePro(drivers, main)
  }
}
