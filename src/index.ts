import 'reflect-metadata'
import { Resolve, Resolver, Query, Mutation, Subscription } from './Decorators'
import { BuildResolvers } from './ResolverBuilder'
import { Metadata } from './Metadata';
import { PubSub } from 'graphql-subscriptions';

export class Test {
  @Query()
  query() {
    console.log('Test')
  }
  @Query()
  static queryStatic() {
    console.log('Test Static')
  }
  @Mutation()
  mute() {
    console.log('Test')
  }
  @Mutation()
  static muteStatic() {
    console.log('Test Static')
  }
  @Subscription()
  sub() {
    console.log('Test')
  }
  @Subscription()
  static subStatic() {
    console.log('Test Static')
  }
}

@Resolver('Test')
export class Test2 {
  @Resolve()
  query() {
    console.log('Test')
  }

  @Resolve()
  static queryStatic() {
    console.log('Test Static')
  }
}

Metadata.pubsub = new PubSub()
console.log(BuildResolvers())
