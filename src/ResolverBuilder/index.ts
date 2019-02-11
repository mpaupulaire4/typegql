import { BuildActionResolvers } from './BuildActionResolvers'
import { BuildResolveResolvers } from './BuildResolveResolvers'

export function BuildResolvers() {
  return BuildActionResolvers(BuildResolveResolvers())
}