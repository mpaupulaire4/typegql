import { Metadata } from '../Metadata'
import { ResolvesMetadataKey } from './Resolve'
import { PropsMetadataKey } from './Prop'

type TypeDecoratorOptions = string

export function Type(options: TypeDecoratorOptions) {
  return (target: any) => {
    const name = options
    const types: Map<string, string> = Reflect.getMetadata(PropsMetadataKey, target)
    const propDefs = Metadata.types.get(name) || []
    if (types) {
      for (let [key, val] of types.entries()) {
        propDefs.push(`${key}: ${val}`)
      }
      Reflect.deleteMetadata(PropsMetadataKey, target)
    }
    const resolves: Map<string, any> = Reflect.getMetadata(ResolvesMetadataKey, target)
    if (resolves) {
      for (const data of resolves.values()) {
        Metadata.resolves.push({
          ...data,
          parent: name,
        })
        if (data.type) propDefs.push(data.type)
      }
      Reflect.deleteMetadata(ResolvesMetadataKey, target)
    }
    Metadata.types.set(name, propDefs)
  }
}


