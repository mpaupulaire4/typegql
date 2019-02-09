import 'reflect-metadata'
import { Controller, Query, Mutation, Subscription } from './Decorators'
import { BuildResolvers } from './ResolverBuilder'
import { Metadata } from './Metadata';
import { PubSub } from 'graphql-subscriptions';

@Controller()
export class Test {

  @Query()
  query() {
    console.log('Test')
  }

  @Mutation()
  mutation() {
    console.log('Test')
  }

  @Subscription()
  subscription() {
    console.log('Test')
  }

  @Query()
  static queryStatic() {
    console.log('Test')
  }

  @Mutation()
  static mutationStatic() {
    console.log('Test')
  }

  @Subscription()
  static subscriptionStatic() {
    console.log('Test')
  }
}
Metadata.pubsub = new PubSub()
BuildResolvers()
