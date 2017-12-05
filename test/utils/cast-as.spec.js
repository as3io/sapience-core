const expect = require('chai').expect;
const { string, dasherized } = require('../../src/utils/cast-as');

describe('utils/cast-as', function() {
  describe('#string()', function() {
    const date = new Date();
    const cases = [
      { value: '   ', expected: '' },
      { value: ' foo  ', expected: 'foo' },
      { value: undefined, expected: '' },
      { value: null, expected: '' },
      { value: NaN, expected: '' },
      { value: 1, expected: '1' },
      { value: 0, expected: '0' },
      { value: -1, expected: '-1' },
      { value: 1.1, expected: '1.1' },
      { value: date, expected: date.toString() },
      { value: String('foo'), expected: 'foo' },
      { value: {}, expected: '[object Object]' },
      { value: true, expected: 'true' },
      { value: false, expected: 'false' },
      { value: [], expected: '' },
      { value: [1, 'a', false], expected: '1,a,false' },
    ];

    cases.forEach((c, i) => {
      const { value, expected } = c;
      it(`should return '${expected}' for case ${i} (typeof ${typeof value})`, function(done) {
        expect(string(value)).to.equal(expected);
        done();
      });
    });


  });
  describe('#dasherized()', function() {
    const cases = [
      { value: '', expected: '' },
      { value: '  ', expected: ''},
      { value: 'www.domain.com', expected: 'www-domain-com' },
      { value: 'SomeType', expected: 'some-type' },
      { value: 'some-type', expected: 'some-type' },
      { value: 'some_type', expected: 'some-type' },
      { value: 'someType', expected: 'some-type' },
      { value: 'Some_type', expected: 'some-type' },
      { value: 'some_type', expected: 'some-type' },
      { value: 'Some*Type', expected: 'some-type' },
      { value: 'some.Type', expected: 'some-type' },
      { value: 'some_longerType', expected: 'some-longer-type' },
      { value: '-Lots_of.delims*AreCrazy-man!', expected: 'lots-of-delims-are-crazy-man' },
    ];
    cases.forEach(c => {
      const { value, expected } = c;
      it(`should return '${expected}' for value '${value}'`, function(done) {
        expect(dasherized(value)).to.equal(expected);
        done();
      });
    });
  });
});
