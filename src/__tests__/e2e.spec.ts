// import { PubSub } from 'graphql-subscriptions';
import {
  Prop,
  Type,
  Resolve,
  Query,
  Subscription,
  Mutation,
  makeExecutableSchema
} from '../'
import { graphql } from 'graphql'
import { Container } from 'typedi'
import { PubSub } from 'graphql-subscriptions';

@Type()
export class User {
  @Prop('Int') id: number;
  @Prop() name: string;
  @Prop('Int') number: number;
  constructor(
    ID: number,
    name: string,
    number: number,
  ) {
    this.id = ID
    this.name = name
    this.number = number
  }
}

let user1: User = new User(1, 'bob', 123);
let user2: User = new User(2, 'john', 456);
let user3: User = new User(2, 'jane', 789);

@Type('User')
export class UserResolver {
  @Resolve({
    type: '[User!]!',
  })
  friends(): User[] {
    return [user1, user2]
  }

  @Resolve({
    type: 'User',
  })
  bestFriend(): User {
    return user3
  }
}

export class Test3 {
  @Query({
    type: '[User!]!'
  })
  users(){
    return [user1, user2, user3]
  }

  @Mutation({
    type: 'String',
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

describe('Server Setup:', () => {
  let runQuery: (query: string) => Promise<any> = () => Promise.resolve(false)

  it('should build', async () => {
    const schema = makeExecutableSchema({
      resolverBuilderOptions: {
        PubSub: new PubSub()
      }
    })
    runQuery = (query) => graphql({
      schema,
      source: query,
      contextValue: {
        container: Container
      }
    })
  })

  it('users query should return "bob", "john", and "jane"', async () => {
    const res = await runQuery('{ users { id name bestFriend { name } friends { name } } }')
    expect(res).toMatchSnapshot()
  })

})

