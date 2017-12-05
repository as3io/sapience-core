const expect = require('chai').expect;
const compose = require('stampit');
const ValuesProxy = require('../../src/composables/values-proxy');

describe('composables/values-proxy', function() {
  it('should return a factory function', function(done) {
    expect(ValuesProxy).to.be.a('function');
    done();
  });
  describe('#set()', function() {
    it('should respond', function(done) {
      const instance = ValuesProxy();
      expect(instance).to.respondsTo('set');
      done();
    });
    it('should prevent setting unknown properties when in strict mode', function(done) {
      const instance = ValuesProxy();
      instance.set('foo', 'bar');
      expect(instance.get('foo')).to.be.undefined;
      done();
    });
    it('should allow setting unknown properties when not in strict mode', function(done) {
      const instance = ValuesProxy();
      instance.set('foo', 'bar', false);
      expect(instance.get('foo')).to.equal('bar');
      done();
    });
    it('should allow setting known properties when in strict mode', function(done) {
      const Factory = compose({
        propertyDescriptors: {
          foo: { writeable: true },
        },
      }, ValuesProxy);
      const instance = Factory();
      instance.set('foo', 'bar');
      expect(instance.get('foo')).to.equal('bar');
      done();
    });
  });
});
