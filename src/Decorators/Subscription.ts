import { Metadata, ActionType } from '../Metadata'

interface SubscriptionDecoratorOptions {
  name?: string
  listen?: string | string[],
  filter?: (payload: any, variables: any, context: any, info: any) => boolean | Promise<boolean>
  type?: string
  args?: {
    [name: string]: string
  }
}

export function Subscription({
  name,
  type,
  args = {},
  filter = () => true,
  ...options
}: SubscriptionDecoratorOptions = {}) {
  return (target: any, methodName: string) => {
    Metadata.actions.push({
      type: ActionType.Subscription,
      target,
      methodName,
      name: name || methodName,
      static: !!target.prototype,
      filter,
      listen: options.listen || name || methodName,
    })
    if (type) {
      let subscription = `${name || methodName}`
      let keys = Object.keys(args)
      if (keys.length) {
        keys = keys.map((key) => `${key}: ${args[key]}`)
        subscription = `${subscription}(\n    ${keys.join('\n    ')}\n  )`
      }
      subscription = `${subscription}: ${type}`
      Metadata.subscriptions.push(subscription)
    }
  }
}
