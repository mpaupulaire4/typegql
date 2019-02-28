/// <reference types="reflect-metadata"/>
import { IExecutableSchemaDefinition, makeExecutableSchema as make, ITypeDefinitions } from 'graphql-tools'
import { GenerateTypes, TypeGenerationOptions } from './TypeGenerator';
import { ResolverBuilderOptions, BuildResolvers } from './ResolverBuilder';

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

interface IMakeExecutableSchemaOptions extends Omit<IExecutableSchemaDefinition, "typeDefs">, TypeGenerationOptions, ResolverBuilderOptions {
  typeDefs?: ITypeDefinitions
  schemas?: string[]
}

export function makeExecutableSchema({
  schemas,
  typeDefs = [],
  resolvers = [],
  PubSub,
  ...options
}: IMakeExecutableSchemaOptions) {
  if (!Array.isArray(typeDefs)) {
    typeDefs = [typeDefs]
  }
  if (!Array.isArray(resolvers)) {
    resolvers = [resolvers]
  }
  return make({
    typeDefs: typeDefs.concat(GenerateTypes(options)),
    resolvers: resolvers.concat(BuildResolvers({ PubSub })),
    ...options
  })
}

export * from './TypeGenerator';
export * from './ResolverBuilder';
export * from './Decorators';
