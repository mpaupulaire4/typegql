import { BuildActionResolvers, ActionBuilderOptions } from './BuildActionResolvers'
import { BuildResolveResolvers } from './BuildResolveResolvers'
import merge from 'lodash.merge'
import { SubscriptionResolver, TypeResolver } from '../types';

interface Resolver {
  [type: string]: TypeResolver | SubscriptionResolver
}

export interface ResolverBuilderOptions extends ActionBuilderOptions {

}

export function BuildResolvers(options: ResolverBuilderOptions = {}, baseResolvers: {} = {}): Resolver {
  return merge(
    {},
    BuildActionResolvers(options),
    BuildResolveResolvers(),
    baseResolvers,
  )
}

