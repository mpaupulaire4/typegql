import { Prop, PropsMetadataKey } from '../'

describe('Prop Decorator', () => {

  it('should return a function', () => {
    expect(typeof Prop()).toBe('function')
  })

  it('Metatdata should be a map of prop name to name of type constructor', () => {
    class Test {
      @Prop()
      string: string;
      @Prop()
      number: number;
      @Prop()
      bool: boolean;

      @Prop()
      static stringStatic: string;
      @Prop()
      static numberStatic: number;
      @Prop()
      static boolStatic: boolean;
    }
    expect(Reflect.getMetadata(PropsMetadataKey, Test)).toMatchSnapshot()
  })

  it('Metadata should map prop to "MyType', () => {
    class Test {
      @Prop('MyType!')
      prop: string;
    }
    expect(Reflect.getMetadata(PropsMetadataKey, Test)).toMatchSnapshot()
  })

})