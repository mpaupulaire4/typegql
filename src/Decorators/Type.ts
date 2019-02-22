import { Metadata } from '../Metadata'
import { ResolvesMetadataKey } from './Resolve'
import { PropsMetadataKey } from './Prop'

type TypeDecoratorOptions = string

export function Type(options: TypeDecoratorOptions) {
  return (target: any) => {
    const name = options
    const types: Map<string, string> = Reflect.getMetadata(PropsMetadataKey, target)
    if (types) {
      let typeDef = `type ${name} {`
      for (let [key, val] of types.entries()) {
        typeDef = `${typeDef}\n\t${key}: ${val}`
      }
      typeDef = `${typeDef}\n}`
      Metadata.types.push(typeDef)
      Reflect.deleteMetadata(PropsMetadataKey, target)
    }
    const resolves: Map<string, any> = Reflect.getMetadata(ResolvesMetadataKey, target)
    if (resolves) {
      for (let data of resolves.values()) {
        Metadata.resolves.push({
          ...data,
          parent: name,
        })
      }
      Reflect.deleteMetadata(ResolvesMetadataKey, target)
    }
  }
}


