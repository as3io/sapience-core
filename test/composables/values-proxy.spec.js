const expect = require('chai').expect;
const compose = require('stampit');
const ValuesProxy = require('../../src/composables/values-proxy');

describe('composables/values-proxy', function() {
  it('should return a factory function', function(done) {
    expect(ValuesProxy).to.be.a('function');
    done();
  });
  it('should create unique instances', function(done) {
    const proxy1 = ValuesProxy();
    proxy1.setValue('foo', 'bar', false);

    const proxy2 = ValuesProxy();
    proxy2.setValue('foo', 'baz', false);

    expect(proxy1.getValue('foo')).to.equal('bar');
    expect(proxy2.getValue('foo')).to.equal('baz');
    done();
  });
  describe('#getValue()', function() {
    it('should respond', function(done) {
      const instance = ValuesProxy();
      expect(instance).to.respondsTo('getValue');
      done();
    });
  });
  describe('#setValue()', function() {
    it('should respond', function(done) {
      const instance = ValuesProxy();
      expect(instance).to.respondsTo('setValue');
      done();
    });
    it('should prevent setting unknown properties when in strict mode', function(done) {
      const instance = ValuesProxy();
      instance.setValue('foo', 'bar');
      expect(instance.getValue('foo')).to.be.undefined;
      done();
    });
    it('should allow setting unknown properties when not in strict mode', function(done) {
      const instance = ValuesProxy();
      instance.setValue('foo', 'bar', false);
      expect(instance.getValue('foo')).to.equal('bar');
      done();
    });
    it('should allow setting known properties when in strict mode', function(done) {
      const Factory = compose({
        propertyDescriptors: {
          foo: { writeable: true },
        },
      }, ValuesProxy);
      const instance = Factory();
      instance.setValue('foo', 'bar');
      expect(instance.getValue('foo')).to.equal('bar');
      done();
    });
  });
});
