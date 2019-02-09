import { BuildActionResolvers } from './BuildActionResolvers'

export function BuildResolvers() {
  const resolvers =  BuildActionResolvers()
  console.log(resolvers)
  return resolvers
}