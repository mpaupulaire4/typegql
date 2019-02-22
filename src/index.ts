import 'reflect-metadata'
import { Prop, Type } from './Decorators'
import { BuildResolvers } from './ResolverBuilder'
import { Metadata } from './Metadata';
import { PubSub } from 'graphql-subscriptions';


@Type('Test')
export class Test {
  @Prop() name: string;
  @Prop() number: number;
  @Prop('Test2') classType: Test2;
}

@Type('Test2')
export class Test2 {
  @Prop() name: string;
  @Prop() number: number;
  @Prop() classType: Test;
}

console.log(Metadata.types.join('\n'))

Metadata.pubsub = new PubSub()
BuildResolvers()
