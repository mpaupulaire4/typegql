import { Prop, PropsMetadataKey } from '../'

describe('Prop Decorator', () => {

  it('should return a function', () => {
    expect(typeof Prop()).toBe('function')
  })

  it('should set metatdata to name of type constructor', () => {
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

  it('should override allow for specifying a type', () => {
    class Test {
      @Prop('MyType!')
      string: string;
    }
    expect(Reflect.getMetadata(PropsMetadataKey, Test)).toMatchSnapshot()
  })

})