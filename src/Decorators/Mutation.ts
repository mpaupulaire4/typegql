import { Metadata, ActionType } from '../Metadata'

interface MutationDecoratorOptions {
  name?: string
  type?: string
  args?: {
    [name: string]: string
  }
}

export function Mutation({name, type, args = {}}: MutationDecoratorOptions = {}) {
  return (target: any, methodName: string) => {
    Metadata.actions.push({
      type: ActionType.Mutation,
      target,
      methodName,
      name: name || methodName,
      static: !!target.prototype,
    })
    if (type) {
      let mutation = `${name || methodName}`
      let keys = Object.keys(args)
      if (keys.length) {
        keys = keys.map((key) => `${key}: ${args[key]}`)
        mutation = `${mutation}(\n\t\t${keys.join('\n\t\t')}\n\t)`
      }
      mutation = `${mutation}: ${type}`
      Metadata.mutations.push(mutation)
    }
  }
}

