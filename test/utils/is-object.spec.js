const expect = require('chai').expect;
const isObject = require('../../src/utils/is-object');

describe('utils/is-object', function() {
  it('should be a function', function(done) {
    expect(isObject).to.be.a('function');
    done();
  });
  it('should return true on object values', function(done) {
    const cases = [
      {}, Object(null), [], new Date(),
    ];
    cases.forEach(v => expect(isObject(v)).to.equal(true));
    done();
  });
  it('should return false on non-object values', function(done) {
    const cases = [
      null, undefined, 1, '1', false, true, String('foo'), Number(1), () => undefined,
    ];
    cases.forEach(v => expect(isObject(v)).to.equal(false));
    done();
  });
});
