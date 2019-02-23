import { Metadata, ActionType } from '../Metadata'

export function Query({name, type, args = {}}: QueryDecoratorOptions = {}) {
  return (target: any, methodName: string) => {
    Metadata.actions.push({
      type: ActionType.Query,
      target,
      methodName,
      name: name || methodName,
      static: !!target.prototype,
    })
    if (type) {
      let query = `${name || methodName}`
      let keys = Object.keys(args)
      if (keys.length) {
        keys = keys.map((key) => `${key}: ${args[key]}`)
        query = `${query}(\n\t\t${keys.join('\n\t\t')}\n\t)`
      }
      query = `${query}: ${type}`
      Metadata.queries.push(query)
    }
  }
}

interface QueryDecoratorOptions {
  name?: string
  type?: string
  args?: {
    [name: string]: string
  }
}