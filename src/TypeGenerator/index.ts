import { Metadata } from '../Metadata'
import fs from 'fs'
import { sync } from 'glob'

export type TypeGenerationOptions = {
  generateQueries?: boolean
  generateMutations?: boolean
  generateSubscriptions?: boolean
  generateTypes?: boolean
  extend?: true | { [type: string]: boolean }
  schemas?: string[]
}

export function GenerateTypes({
  generateQueries = true,
  generateMutations = true,
  generateSubscriptions = true,
  generateTypes = true,
  extend = {},
  schemas = [],
}: TypeGenerationOptions = {}) {
  if (extend && typeof extend == 'boolean') {
    extend = { Query: true, Mutation: true, Subscription: true }
  }

  let gql = []

  if (generateTypes) {
    for (let [type, props] of Metadata.types.entries()) {
      gql.push(`${extend[type] ? 'extend ' : ''}type ${type} {\n  ${props.join('\n  ')}\n}`)
    }
  }

  if (generateQueries && Metadata.queries.length) {
    gql.push(`${extend.Query ? 'extend ' : ''}type Query {\n  ${Metadata.queries.join('\n  ')}\n}`)
  }

  if (generateMutations && Metadata.mutations.length) {
    gql.push(`${extend.Mutation ? 'extend ' : ''}type Mutation {\n  ${Metadata.mutations.join('\n  ')}\n}`)
  }

  if (generateSubscriptions && Metadata.subscriptions.length) {
    gql.push(`${extend.Subscription ? 'extend ' : ''}type Subscription {\n  ${Metadata.subscriptions.join('\n  ')}\n}`)
  }

  for (let pattern of schemas) {
    const matches = sync(pattern)
    for (let match of matches) {
      gql.push(fs.readFileSync(match).toString())
    }
  }
  return gql.join('\n')
}