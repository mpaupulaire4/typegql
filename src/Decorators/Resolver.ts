import { Metadata } from '../Metadata'
const TypesMetadataKey = Symbol("types")

type ResolverDecoratorOptions = string | {
  name: string
}

type ResolveDecoratorOptions = string | {
  name: string
}

interface MethodInfo {
  target: any,
  methodName: string,
  name: string,
  static: boolean,
}

export function Resolver(options: ResolverDecoratorOptions) {
  return (target: any) => {
    const types: Map<string, MethodInfo> = Reflect.getMetadata(TypesMetadataKey, target)
    if (!types) return
    for (let data of types.values()) {
      Metadata.resolves.push({
        parent: typeof options == 'string' ? options : options.name,
        ...data,
      })
    }
    Reflect.deleteMetadata(TypesMetadataKey, target)
  }
}

export function Resolve(options?: ResolveDecoratorOptions) {
  return (target: any, methodName: string) => {
    const isStatic = !!target.prototype
    let constructor = isStatic ? target : target.constructor
    const types: Map<string, MethodInfo> = Reflect.getMetadata(TypesMetadataKey, constructor) || new Map()

    const name = options ? typeof options === 'string' ? options : options.name : methodName
    Reflect.defineMetadata(
      TypesMetadataKey,
      types.set(name, {
        target,
        methodName,
        name,
        static: isStatic,
      }),
      constructor
    )
  }
}


