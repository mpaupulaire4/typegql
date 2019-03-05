import { Query } from '../'
import { Metadata } from '../../Metadata'

jest.mock('../../Metadata', () => {
  return {
    __esModule: true,
    default: true,
    Metadata: {
      actions: {
        push: jest.fn()
      },
      queries: {
        push: jest.fn()
      },
    },
    ActionType: {
      Query: 'Query'
    }
  }
})

describe('Query Decorator', () => {

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should be a function that returns a function', () => {
    expect(typeof Query).toBe('function')
    expect(typeof Query()).toBe('function')
  })

  it('should push metatadata about how to excecute non static query', () => {
    class Test {
      @Query()
      query() {}

      @Query()
      static query() {}
    }
    expect(Metadata.actions.push).toHaveBeenCalledWith({
      type: 'Query',
      target: Test.prototype,
      methodName: 'query',
      name: 'query',
      static: false
    })
    expect(Metadata.actions.push).toHaveBeenCalledWith({
      type: 'Query',
      target: Test,
      methodName: 'query',
      name: 'query',
      static: true
    })
  })

  it('should allow for name overrides', () => {
    class Test {
      @Query({
        name: 'test1'
      })
      query1() {}

      @Query({
        name: 'test2'
      })
      query2() {}
    }
    expect(Metadata.actions.push).toHaveBeenCalledWith({
      type: 'Query',
      target: Test.prototype,
      methodName: 'query1',
      name: 'test1',
      static: false
    })
    expect(Metadata.actions.push).toHaveBeenCalledWith({
      type: 'Query',
      target: Test.prototype,
      methodName: 'query2',
      name: 'test2',
      static: false
    })
  })

  it('should push type string when type is specified', () => {
    class Test {
      @Query({
        type: 'Test1',
        name: 'test1'
      })
      query1() {}

      @Query({
        type: 'Test2',
        name: 'test2'
      })
      query2() {}
    }
    expect(new Test()).toBeTruthy()
    expect(Metadata.queries.push).toHaveBeenCalledWith('test1: Test1')
    expect(Metadata.queries.push).toHaveBeenCalledWith('test2: Test2')
  })

  it('should push type string with args when type and args specified', () => {
    class Test {
      @Query({
        type: 'Test1',
        name: 'test1',
        args: {
          one: 'One',
          two: 'Two',
        }
      })
      query1() {}
    }
    expect(new Test()).toBeTruthy()
    expect(Metadata.queries.push).toHaveBeenCalledWith(`test1(
    one: One
    two: Two
  ): Test1`)
  })
})