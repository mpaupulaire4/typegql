import { Metadata, ActionType } from '../Metadata'

export function Query(options: QueryDecoratorOptions = {}) {
  return (target: any, methodName: string) => {
    Metadata.actions.push({
      type: ActionType.Query,
      target,
      methodName,
      name: options.name || methodName,
      static: !!target.prototype,
    })
  }
}

interface QueryDecoratorOptions {
  name?: string
}