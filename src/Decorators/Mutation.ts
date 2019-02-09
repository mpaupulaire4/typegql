import { Metadata, ActionType } from '../Metadata'

export function Mutation(options: MutationDecoratorOptions = {}) {
  return (target: any, methodName: string) => {
    Metadata.actions.push({
      type: ActionType.Mutation,
      target,
      methodName,
      name: options.name || methodName,
      static: !!target.prototype,
    })
  }
}

interface MutationDecoratorOptions {
  name?: string
}