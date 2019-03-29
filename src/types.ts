import { ContainerInstance } from 'typedi'
import { ResolverFn } from 'graphql-subscriptions'

export interface RootResolver {
  [key: string]: RootResolverFn
}

export interface TypeResolver {
  [key: string]: TypeResolverFn
}

export interface SubscriptionResolver {
  [key: string]: SubscriptionResolve
}

export interface SubscriptionResolve {
  resolve: TypeResolverFn
  subscribe: ResolverFn
}

export type RootResolverFn = (args: any, context: Context, info: any) => any

export type TypeResolverFn = (parent: any, args: any, context: Context, info: any) => any

export interface Context {
  container: ContainerInstance
}