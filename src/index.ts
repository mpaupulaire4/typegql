/// <reference types="reflect-metadata"/>
import { IExecutableSchemaDefinition, makeExecutableSchema as make, ITypeDefinitions } from 'graphql-tools'
import { GenerateTypes, TypeGenerationOptions } from './TypeGenerator';
import { ResolverBuilderOptions, BuildResolvers } from './ResolverBuilder';

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

interface IMakeExecutableSchemaOptions extends Omit<IExecutableSchemaDefinition, "typeDefs"> {
  typeDefs?: ITypeDefinitions
  typeGeneratorOptions?: TypeGenerationOptions
  resolverBuilderOptions?: ResolverBuilderOptions
}

export function makeExecutableSchema({
  typeDefs = [],
  resolvers = [],
  typeGeneratorOptions,
  resolverBuilderOptions,
  ...options
}: IMakeExecutableSchemaOptions) {
  if (!Array.isArray(typeDefs)) {
    typeDefs = [typeDefs]
  }
  if (!Array.isArray(resolvers)) {
    resolvers = [resolvers]
  }
  return make({
    typeDefs: typeDefs.concat(GenerateTypes(typeGeneratorOptions)),
    resolvers: resolvers.concat(BuildResolvers(resolverBuilderOptions)),
    ...options
  })
}

export * from './TypeGenerator';
export * from './ResolverBuilder';
export * from './Decorators';
