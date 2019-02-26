import { BuildActionResolvers, ActionBuilderOptions } from './BuildActionResolvers'
import { BuildResolveResolvers } from './BuildResolveResolvers'
import merge from 'lodash.merge'

export function BuildResolvers(customResolvers = {}, options: ActionBuilderOptions = {}) {
  return merge(
    {},
    customResolvers,
    BuildActionResolvers(options),
    BuildResolveResolvers(),
  )
}

