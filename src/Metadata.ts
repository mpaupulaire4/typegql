import { RootResolver, TypeResolver } from './types'
import { PubSubEngine } from 'graphql-subscriptions'

export class Metadata {
  static controllers: Function[] = []
  static actions: Action[] = []
  static pubsub: PubSubEngine
}

interface BaseAction {
  target: RootResolver,
  static: boolean,
  methodName: string,
  name: string,
}

type QueryAction = BaseAction & {
  type: ActionType.Query
}

type MutationAction = BaseAction & {
  type: ActionType.Mutation
}

type SubscriptionAction = BaseAction & {
  target: TypeResolver
  type: ActionType.Subscription,
  listen: string | string[],
  filter: (payload: any, variables: any, context: any, info: any) => boolean | Promise<boolean>,
}

type Action = QueryAction | MutationAction | SubscriptionAction

export enum ActionType {
  Query = 'Query',
  Mutation = 'Mutation',
  Subscription = 'Subscription',
}
