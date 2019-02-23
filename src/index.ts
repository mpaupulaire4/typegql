import 'reflect-metadata'
import { Prop, Type, Resolve, Query, Mutation, Subscription } from './Decorators'
import { GenerateTypes } from './TypeGenerator'
import { BuildResolvers } from './ResolverBuilder';
import { Metadata } from './Metadata';
import { PubSub } from 'graphql-subscriptions';

@Type('Test')
export class Test1 {
  @Prop() name: string;
  @Prop() number: number;
  @Prop('Test2') classType: Test2;
}

@Type('Test')
export class Test2 {

  @Resolve({
    name: 'data',
    type: 'Data',
    args: {
      input: 'DataInput',
      input2: 'DataInput'
    }
  })
  query() {
    return ''
  }

  @Resolve({
    name: 'sub',
    type: 'Data',
    args: {
      input: 'DataInput',
      input2: 'DataInput'
    }
  })
  sub() {
    return ''
  }
}

export class Test3 {
  @Query({
    type: 'String'
  })
  query(){
    return ''
  }

  @Mutation({
    type: 'String',
    args: {
      input: 'MutationInput!'
    }
  })
  mutation(){
    return ''
  }

  @Subscription({
    type: 'String'
  })
  subscription(){
    return ''
  }
}

Metadata.pubsub = new PubSub()
console.log(GenerateTypes({ queries: false, mutations: false }))
console.log(BuildResolvers())

