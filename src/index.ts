import 'reflect-metadata'
import { Prop, Type, Mutation, Subscription } from './Decorators'
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

  @Mutation({
    name: 'getData',
    type: 'Data',
    args: {
      input: 'DataInput',
      input2: 'DataInput'
    }
  })
  mutation() {
    return ''
  }
  @Subscription({
    name: 'sub',
    type: 'Data',
    args: {
      input: 'DataInput',
      input2: 'DataInput'
    }
  })
  query() {
    return ''
  }
}

console.log(Metadata.queries.join('\n'))

Metadata.pubsub = new PubSub()
BuildResolvers()
