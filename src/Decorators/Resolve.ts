
export const ResolvesMetadataKey = Symbol("resolves")

type ResolveDecoratorOptions = {
  name: string
  dataloader?: boolean
  key?: (info: {oarent: any, args: any}) => string
}

export function Resolve(options?: ResolveDecoratorOptions) {
  return (target: any, methodName: string) => {
    const isStatic = !!target.prototype
    let constructor = isStatic ? target : target.constructor
    const resolves: Map<string, any> = Reflect.getMetadata(ResolvesMetadataKey, constructor) || new Map()
    const name = options ? options.name : methodName

    Reflect.defineMetadata(
      ResolvesMetadataKey,
      resolves.set(name, {
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


