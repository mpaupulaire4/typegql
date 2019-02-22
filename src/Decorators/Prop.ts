
export const PropsMetadataKey = Symbol("types")

type PropDecoratorOptions = string

export function Prop(options?: PropDecoratorOptions) {
  return (target: any, methodName: string) => {

    const isStatic = !!target.prototype
    let constructor = isStatic ? target : target.constructor
    const types: Map<string, string> = Reflect.getMetadata(PropsMetadataKey, constructor) || new Map()
    const type = options || Reflect.getMetadata("design:type", target, methodName).name || 'NotSet'

    Reflect.defineMetadata(
      PropsMetadataKey,
      types.set(methodName, type),
      constructor
    )
  }
}


