import 'reflect-metadata'
import { Resolve, Resolver } from './Decorators'
import { BuildResolvers } from './ResolverBuilder'
import { Metadata } from './Metadata';
import { PubSub } from 'graphql-subscriptions';

@Resolver('Test')
export class Test {
  @Resolve()
  query() {
    console.log('Test')
  }

  @Resolve()
  static queryStatic() {
    console.log('Test')
  }
}
Metadata.pubsub = new PubSub()
BuildResolvers()
