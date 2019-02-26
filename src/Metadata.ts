import { RootResolver, TypeResolver } from './types'

export class Metadata {
  static actions: Action[] = []
  static resolves: ResolveData[] = []
  static types: Map<string, string[]> = new Map()
  static queries: string[] = []
  static mutations: string[] = []
  static subscriptions: string[] = []
}

interface BaseAction {
  target: RootResolver,
  static: boolean,
  methodName: string,
  name: string,
}

type ResolveData = BaseAction & {
  target: TypeResolver
  parent: string
  dataloader?: boolean
  key?: (info: {oarent: any, args: any}) => string
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
