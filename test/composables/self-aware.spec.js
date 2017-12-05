const expect = require('chai').expect;
const SelfAware = require('../../src/composables/self-aware');

describe('composables/self-aware', function() {
  it('should return a factory function', function(done) {
    expect(SelfAware).to.be.a('function');
    done();
  });
  describe('#getStamp()', function() {
    const instance = SelfAware();
    it('should respond', function(done) {
      expect(instance).to.respondsTo('getStamp');
      done();
    });
    it('should return the same factory', function(done) {
      expect(instance.getStamp()).to.equal(SelfAware);
      done();
    });
  });
});
