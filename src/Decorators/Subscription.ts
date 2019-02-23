import { Metadata, ActionType } from '../Metadata'

export function Subscription({
  name,
  type,
  args = {},
  ...options
}: SubscriptionDecoratorOptions = {}) {
  return (target: any, methodName: string) => {
    Metadata.actions.push({
      type: ActionType.Subscription,
      target,
      methodName,
      name: name || methodName,
      static: !!target.prototype,
      filter: options.filter || (() => true),
      listen: options.listen || name || methodName,
    })
    if (type) {
      let subscription = `${name || methodName}`
      let keys = Object.keys(args)
      if (keys.length) {
        keys = keys.map((key) => `${key}: ${args[key]}`)
        subscription = `${subscription}(\n\t\t${keys.join('\n\t\t')}\n\t)`
      }
      subscription = `${subscription}: ${type}`
      Metadata.subscriptions.push(subscription)
    }
  }
}

interface SubscriptionDecoratorOptions {
  name?: string
  listen?: string | string[],
  filter?: (payload: any, variables: any, context: any, info: any) => boolean | Promise<boolean>
  type?: string
  args?: {
    [name: string]: string
  }
}