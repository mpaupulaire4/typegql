// import { PubSub } from 'graphql-subscriptions';
import {
  Prop,
  Type,
  Query,
  Subscription,
  Mutation,
} from '../../'
import {
  GenerateTypes
} from '../'

@Type()
export class User {
  @Prop('Int') id: number;
  @Prop() name: string;
  @Prop('Int') number: number;
}

export class UserContoller {
  @Query({
    type: '[User!]!'
  })
  query(){}

  @Mutation({
    type: 'String',
  })
  mutation(){}

  @Subscription({
    type: 'String'
  })
  subscription(){}
}

describe('Type Generator', () => {
  it('should generate type strings from decorators', () => {
    expect(GenerateTypes()).toMatchSnapshot()
  })

  it('extend: true  should extend Query, Mutation, Subscription', () => {
    expect(GenerateTypes({
      extend: true
    })).toMatchSnapshot()
  })

  it('should extend Query and User', () => {
    expect(GenerateTypes({
      extend: {
        Query: true,
        User: true
      }
    })).toMatchSnapshot()
  })

  it('should exclude Query', () => {
    expect(GenerateTypes({
      generateQueries: false
    })).toMatchSnapshot()
  })

  it('should exclude Mutations', () => {
    expect(GenerateTypes({
      generateMutations: false
    })).toMatchSnapshot()
  })

  it('should exclude Subscriptions', () => {
    expect(GenerateTypes({
      generateSubscriptions: false
    })).toMatchSnapshot()
  })

  it('should only include root types', () => {
    expect(GenerateTypes({
      generateTypes: false
    })).toMatchSnapshot()
  })

  it('should include schema files', () => {
    expect(GenerateTypes({
      schemas: [
        '**/*.type-generator.gql'
      ]
    })).toMatchSnapshot()
  })

})

