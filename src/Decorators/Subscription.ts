import { Metadata, ActionType } from '../Metadata'

export function Subscription(options: SubscriptionDecoratorOptions = {}) {
  return (target: any, methodName: string) => {
    Metadata.actions.push({
      type: ActionType.Subscription,
      target,
      methodName,
      name: options.name || methodName,
      static: !!target.prototype,
      filter: options.filter || (() => true),
      listen: options.listen || options.name || methodName,
    })
  }
}

interface SubscriptionDecoratorOptions {
  name?: string
  listen?: string | string[],
  filter?: (payload: any, variables: any, context: any, info: any) => boolean | Promise<boolean>
}