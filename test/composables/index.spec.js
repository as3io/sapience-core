const expect = require('chai').expect;
const index = require('../../src/composables');

describe('composables/index', function() {
  it('should return an object', function(done) {
    expect(index).to.be.an('object');
    done();
  });
  const props = ['SelfAware', 'ValuesProxy'];
  props.forEach((prop) => {
    it(`should have the '${prop}' property`, function(done) {
      expect(index).to.have.property(prop);
      done();
    });
  });
});
