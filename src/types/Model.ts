/**
 * Created by tushar.mathur on 04/11/16.
 */

export interface SideNavModel {
  completion: number
  isMoving: boolean
  startX: number
  width: number
}

export interface Model {
  sideNav: SideNavModel
}
