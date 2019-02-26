import { withFilter, PubSubEngine } from 'graphql-subscriptions'
import { Metadata, ActionType } from '../Metadata'
import { TypeResolver, RootResolver, SubscriptionResolver } from '../types'
import Container from 'typedi';

interface Resolver {
  [ActionType.Query]: TypeResolver
  [ActionType.Mutation]: TypeResolver
  [ActionType.Subscription]: SubscriptionResolver
}

export type ActionBuilderOptions = {
  PubSub?: PubSubEngine
}

export function BuildActionResolvers({ PubSub }: ActionBuilderOptions = {}): Resolver {
  return Metadata.actions.reduce((resolver, action) => {
    resolver[action.type] = resolver[action.type] || {}
    switch(action.type) {
      case ActionType.Query:
      case ActionType.Mutation: {
        if (action.static) {
          resolver[action.type][action.name] = (_, args, context, info) => action.target[action.methodName](args, context, info)
        } else {
          resolver[action.type][action.name] = (_, args, context, info) => {
            context.container = context.container || Container
            const Controller = context.container.get<RootResolver>(action.target.constructor)
            return Controller[action.methodName](args, context, info)
          }
        }
        return resolver
      }
      case ActionType.Subscription: {
        if (!PubSub) throw Error('You must specify a PubSub Instance to use Subscriptions')
        const subscribe = withFilter(
          () => PubSub.asyncIterator(action.listen),
          action.filter
        )
        if (action.static) {
          resolver[action.type][action.name] = {
            subscribe,
            resolve: (...args) => action.target[action.methodName](...args)
          }
        } else {
          resolver[action.type][action.name] = {
            subscribe,
            resolve: (payload, args, context, info) => {
              context.container = context.container || Container
              const Controller = context.container.get<TypeResolver>(action.target.constructor)
              return Controller[action.methodName](payload, args, context, info)
            }
          }
        }
        return resolver
      }
      default:
        return resolver
    }
  }, {} as Resolver)
}