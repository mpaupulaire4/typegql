import { Mutation } from '../'
import { Metadata } from '../../Metadata'

jest.mock('../../Metadata', () => {
  return {
    __esModule: true,
    default: true,
    Metadata: {
      actions: {
        push: jest.fn()
      },
      mutations: {
        push: jest.fn()
      },
    },
    ActionType: {
      Mutation: 'Mutation'
    }
  }
})

describe('Mutation Decorator', () => {

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should be a function that returns a function', () => {
    expect(typeof Mutation).toBe('function')
    expect(typeof Mutation()).toBe('function')
  })

  it('should push metatadata about how to excecute non static mutation', () => {
    class Test {
      @Mutation()
      mutation() {}

      @Mutation()
      static mutation() {}
    }
    expect(Metadata.actions.push).toHaveBeenCalledWith({
      type: 'Mutation',
      target: Test.prototype,
      methodName: 'mutation',
      name: 'mutation',
      static: false
    })
    expect(Metadata.actions.push).toHaveBeenCalledWith({
      type: 'Mutation',
      target: Test,
      methodName: 'mutation',
      name: 'mutation',
      static: true
    })
  })

  it('should allow for name overrides', () => {
    class Test {
      @Mutation({
        name: 'test1'
      })
      mutation1() {}

      @Mutation({
        name: 'test2'
      })
      mutation2() {}
    }
    expect(Metadata.actions.push).toHaveBeenCalledWith({
      type: 'Mutation',
      target: Test.prototype,
      methodName: 'mutation1',
      name: 'test1',
      static: false
    })
    expect(Metadata.actions.push).toHaveBeenCalledWith({
      type: 'Mutation',
      target: Test.prototype,
      methodName: 'mutation2',
      name: 'test2',
      static: false
    })
  })

  it('should push type string when type is specified', () => {
    class Test {
      @Mutation({
        type: 'Test1',
        name: 'test1'
      })
      mutation1() {}

      @Mutation({
        type: 'Test2',
        name: 'test2'
      })
      mutation2() {}
    }
    expect(new Test()).toBeTruthy()
    expect(Metadata.mutations.push).toHaveBeenCalledWith('test1: Test1')
    expect(Metadata.mutations.push).toHaveBeenCalledWith('test2: Test2')
  })

  it('should push type string with args when type and args specified', () => {
    class Test {
      @Mutation({
        type: 'Test1',
        name: 'test1',
        args: {
          one: 'One',
          two: 'Two',
        }
      })
      mutation1() {}
    }
    expect(new Test()).toBeTruthy()
    expect(Metadata.mutations.push).toHaveBeenCalledWith(`test1(
    one: One
    two: Two
  ): Test1`)
  })
})