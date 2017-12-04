const expect = require('chai').expect;
const typeOf = require('../../src/utils/stamp-type-of');

describe('utils/stamp-type-of', function() {
  it('should be a function', function(done) {
    expect(typeOf).to.be.a('function');
    done();
  });
  it('should return the type with objects containing the `stampType` property', function(done) {
    const cases = [
      { obj: { stampType: 'foo' }, value: 'foo' },
      { obj: { stampType: null }, value: null },
      { obj: { stampType: undefined }, value: undefined },
    ];
    cases.forEach(c => expect(typeOf(c.obj)).to.equal(c.value));
    done();
  });
  it('should return undefined on non-objects, or objects missing the required property', function(done) {
    const cases = [
      {}, new Date(), null, undefined, 1, '1', false, true, String('foo'), Number(1), () => undefined,
    ];
    cases.forEach(v => expect(typeOf(v)).to.equal(undefined));
    done();
  });
});
