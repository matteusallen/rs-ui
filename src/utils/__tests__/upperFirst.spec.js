import toUpper from '../upperFirst';

describe('toUpper', function() {
  it('should convert first alpha char in string to upper case', function() {
    // Assert
    expect(toUpper('some sentence')).toStrictEqual('Some sentence');
    expect(toUpper('abc')).toStrictEqual('Abc');
    expect(toUpper('--Foo-Bar')).toStrictEqual('--Foo-Bar');
    expect(toUpper('fooBar')).toStrictEqual('FooBar');
    expect(toUpper('__FOO_BAR__')).toStrictEqual('__FOO_BAR__');
  });
});
