
export const ResolvesMetadataKey = Symbol("resolves")

interface ResolveDecoratorOptions {
  name?: string
  dataloader?: boolean
  key?: (info: {parent: any, args: any}) => string
  type?: string
  args?: {
    [name: string]: string
  }
}

export function Resolve({ type, args = {}, ...options }: ResolveDecoratorOptions = {}) {
  return (target: any, methodName: string) => {
    const isStatic = !!target.prototype
    let constructor = isStatic ? target : target.constructor
    const resolves: Map<string, any> = Reflect.getMetadata(ResolvesMetadataKey, constructor) || new Map()
    const name = options.name || methodName
    let prop;
    if (type) {
      prop = `${name}`
      let keys = Object.keys(args)
      if (keys.length) {
        keys = keys.map((key) => `${key}: ${args[key]}`)
        prop = `${prop}(\n\t\t${keys.join('\n\t\t')}\n\t)`
      }
      prop = `${prop}: ${type}`
    }

    Reflect.defineMetadata(
      ResolvesMetadataKey,
      resolves.set(name, {
        target,
        methodName,
        name,
        dataloader: options && options.dataloader,
        key: options && options.dataloader && options.key,
        static: isStatic,
        type: prop,
      }),
      constructor
    )
  }
}


