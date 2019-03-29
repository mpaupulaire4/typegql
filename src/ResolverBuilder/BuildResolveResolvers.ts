import Dataloader from 'dataloader'
import { Metadata } from '../Metadata'
import { TypeResolver, Context } from '../types'

export interface Resolver {
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
      class Loader extends Dataloader<{ parent: any, args: any, context: Context, info: any}, any> {
        constructor() {
          super(async (keys) => {
            return fn(
              keys.map(({ parent }) => parent),
              keys.map(({ args }) => args),
              keys[0].context,
              keys[0].info,
            )
          }, {
            cacheKeyFn: key || JSON.stringify,
          })
        }
      }
      resolvers[parent][name] = (data, args, context, info) => {
        return context.container.get(Loader).load({ parent: data, args, context, info })
      }
    }
    return resolvers
  }, {} as Resolver)
}