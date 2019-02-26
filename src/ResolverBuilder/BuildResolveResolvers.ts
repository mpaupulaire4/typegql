import Dataloader from 'dataloader'
import { Metadata } from '../Metadata'
import { TypeResolver } from '../types'

interface Resolver {
  [type: string]: TypeResolver
}

export function BuildResolveResolvers(): Resolver {
  return Metadata.resolves.reduce((resolvers, {
    parent,
    target,
    name,
    methodName,
    static: isStatoc,
    dataloader,
    key,
  }) => {
    resolvers[parent] = (resolvers[parent] || {})
    if (isStatoc) {
      resolvers[parent][name] = (...args) => target[methodName](...args)
    } else {
      resolvers[parent][name] = (data, args, context, info) => {
        const Controller = context.container.get<TypeResolver>(target.constructor)
        return Controller[methodName](data, args, context, info)
      }
    }
    if (dataloader) {
      const fn = resolvers[parent][name]
      resolvers[parent][name] = (data, args, context, info) => {
        const loaderKey = `${parent}:${name}`
        context.dataloaders = context.dataloaders || {}
        if (!context.dataloaders[loaderKey]) {
          context.dataloaders[loaderKey] = new Dataloader(async (keys) => {
            return fn(
              keys.map(({ parent }) => parent),
              keys.map(({ args }) => args),
              context,
              info
            )
          }, {
            cacheKeyFn: key || JSON.stringify,
          })
        }
        return context.dataloaders[loaderKey].load({ parent: data, args })
      }
    }
    return resolvers
  }, {} as Resolver)
}