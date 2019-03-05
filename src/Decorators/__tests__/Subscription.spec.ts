import { Subscription } from '../'
import { Metadata } from '../../Metadata'


jest.mock('../../Metadata', () => {
  const actions: any[] = []
  return {
    __esModule: true,
    default: true,
    Metadata: {
      actions: {
        push: jest.fn((data) => actions.concat(data))
      },
      subscriptions: {
        push: jest.fn()
      },
    },
    ActionType: {
      Subscription: 'Subscription'
    }
  }
})

describe('Subscription Decorator', () => {

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should be a function that returns a function', () => {
    expect(typeof Subscription).toBe('function')
    expect(typeof Subscription()).toBe('function')
  })

  it('default filter should return true', () => {
    class Test {
      @Subscription()
      subscription() {}
    }
    expect(new Test()).toBeTruthy()
    // @ts-ignore
    expect(Metadata.actions.push.mock.calls[0][0].filter()).toBe(true)
    // expect(Metadata.actions.push()[0].filter()).toBeTruthy()
  })

  it('should push metatadata about how to excecute subscription', () => {
    const filter = () => true
    class Test {
      @Subscription({
        filter,
        listen: ['sub_one', 'sub_two']
      })
      subscription() {}

      @Subscription({
        filter,
      })
      static subscription() {}
    }
    expect(Metadata.actions.push).toHaveBeenCalledWith({
      type: 'Subscription',
      listen: ['sub_one', 'sub_two'],
      filter,
      target: Test.prototype,
      methodName: 'subscription',
      name: 'subscription',
      static: false
    })
    expect(Metadata.actions.push).toHaveBeenCalledWith({
      type: 'Subscription',
      listen: 'subscription',
      filter,
      methodName: 'subscription',
      name: 'subscription',
      target: Test,
      static: true
    })
  })

  it('should allow for name overrides', () => {
    const filter = () => true
    class Test {
      @Subscription({
        name: 'test1',
        filter
      })
      subscription1() {}
    }
    expect(Metadata.actions.push).toHaveBeenCalledWith({
      type: 'Subscription',
      target: Test.prototype,
      methodName: 'subscription1',
      filter,
      listen: 'test1',
      name: 'test1',
      static: false
    })
  })

  it('should push type string when type is specified', () => {
    class Test {
      @Subscription({
        type: 'Test1',
        name: 'test1'
      })
      subscription1() {}

      @Subscription({
        type: 'Test2',
        name: 'test2'
      })
      subscription2() {}
    }
    expect(new Test()).toBeTruthy()
    expect(Metadata.subscriptions.push).toHaveBeenCalledWith('test1: Test1')
    expect(Metadata.subscriptions.push).toHaveBeenCalledWith('test2: Test2')
  })

  it('should push type string with args when type and args specified', () => {
    class Test {
      @Subscription({
        type: 'Test1',
        name: 'test1',
        args: {
          one: 'One',
          two: 'Two',
        }
      })
      subscription1() {}
    }
    expect(new Test()).toBeTruthy()
    expect(Metadata.subscriptions.push).toHaveBeenCalledWith(`test1(
    one: One
    two: Two
  ): Test1`)
  })
})