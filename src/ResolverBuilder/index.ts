import { BuildActionResolvers, ActionBuilderOptions } from './BuildActionResolvers'
import { BuildResolveResolvers } from './BuildResolveResolvers'
import merge from 'lodash.merge'
import { SubscriptionResolver, TypeResolver } from '../types';

export interface Resolver {
  [type: string]: TypeResolver | SubscriptionResolver
}

export function BuildResolvers(customResolvers = {}, options: ActionBuilderOptions = {}): Resolver {
  return merge(
    {},
    customResolvers,
    BuildActionResolvers(options),
    BuildResolveResolvers(),
  )
}

