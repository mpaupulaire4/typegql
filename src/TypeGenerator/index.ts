import { Metadata } from '../Metadata'

type GenerationOptions = {
  queries?: boolean
  mutations?: boolean
  subscriptions?: boolean
  types?: boolean
}

export function GenerateTypes({
  queries = true,
  mutations = true,
  subscriptions = true,
  types = true,
}: GenerationOptions = {}) {
  let gql = []
  if (types) {
    for (let [type, props] of Metadata.types.entries()) {
      gql.push(`type ${type} {\n\t${props.join('\n\t')}\n}`)
    }
  }
  if (queries && Metadata.queries.length) {
      gql.push(`type Query {\n\t${Metadata.queries.join('\n\t')}\n}`)
  }
  if (mutations && Metadata.mutations.length) {
      gql.push(`type Mutation {\n\t${Metadata.mutations.join('\n\t')}\n}`)
  }
  if (subscriptions && Metadata.subscriptions.length) {
      gql.push(`type Subscription {\n\t${Metadata.subscriptions.join('\n\t')}\n}`)
  }
  return gql.join('\n')
}