import { Metadata } from '../Metadata'

const TypesMetadataKey = Symbol("types")

type ResolverDecoratorOptions = string | {
  name: string
}

type ResolveDecoratorOptions = {
  name: string
  dataloader?: boolean
  key?: (info: {oarent: any, args: any}) => string
}

export function Resolver(options: ResolverDecoratorOptions) {
  return (target: any) => {
    const types: Map<string, any> = Reflect.getMetadata(TypesMetadataKey, target)
    if (!types) return
    for (let data of types.values()) {
      Metadata.resolves.push({
        ...data,
        parent: typeof options == 'string' ? options : options.name,
      })
    }
    Reflect.deleteMetadata(TypesMetadataKey, target)
  }
}

export function Resolve(options?: ResolveDecoratorOptions) {
  return (target: any, methodName: string) => {
    const isStatic = !!target.prototype
    let constructor = isStatic ? target : target.constructor
    const types: Map<string, any> = Reflect.getMetadata(TypesMetadataKey, constructor) || new Map()
    const name = options ? options.name : methodName

    Reflect.defineMetadata(
      TypesMetadataKey,
      types.set(name, {
        target,
        methodName,
        name,
        dataloader: options && options.dataloader,
        key: options && options.dataloader && options.key ,
        static: isStatic,
      }),
      constructor
    )
  }
}


