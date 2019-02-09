import { Metadata } from '../Metadata'

export function Controller() {
  return (target: Function) => {
    Metadata.controllers.push(target)
  }
}