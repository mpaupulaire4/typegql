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
import { Controller } from '../Decorators';

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
let user3: User = new User(3, 'jane', 789);

const bestFriendsMap =  {
  [user1.id]: user2,
  [user2.id]: user3,
  [user3.id]: user1,
}

const friendsMap =  {
  [user1.id]: [user2, user3],
  [user2.id]: [user3, user1],
  [user3.id]: [user1, user2],
}

@Type('User')
export class UserResolver {
  @Resolve({
    type: '[User!]!',
  })
  friends(user: User) {
    return friendsMap[user.id]
  }

  @Resolve({
    type: 'User',
    dataloader: true,
    key: ({ parent }) => parent.id,
  })
  bestFriend(users: User[]) {
    return users.map(user => bestFriendsMap[user.id])
  }

  @Resolve({
    type: 'User',
    dataloader: true,
    key: ({ parent }) => parent.id,
  })
  expensiveBestFriend(users: User[]) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(users.map(user => bestFriendsMap[user.id]))
      }, 1000);
    })
  }
}

@Controller()
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
    const res = await runQuery(`{
      users {
        id
        name
        expensiveBestFriend {
          id
          name
          expensiveBestFriend {
            expensiveBestFriend {
              id
              name
            }
          }
        }
        bestFriend {
          id
          name
        }
        friends {
          id
          name
        }
      }
    }`)
    expect(res).toMatchSnapshot()
  })

})

