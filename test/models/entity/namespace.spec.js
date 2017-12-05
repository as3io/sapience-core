const expect = require('chai').expect;
const Namespace = require('../../../src/models/entity/namespace');

const testInstance = (ns) => {
  expect(ns).to.be.a('object');
  expect(ns).to.respondTo('getStamp');
  expect(ns.getStamp()).to.equal(Namespace);
};

const testStaticMethod = (method) => {
  expect(Namespace[method]).to.be.a('function');
};

const testGetters = (ns, exp) => {
  expect(ns.n).to.equal(exp.n);
  expect(ns.z).to.equal(exp.z);
  expect(ns.b).to.equal(exp.b);

  expect(ns.get('n')).to.equal(exp.n);
  expect(ns.get('z')).to.equal(exp.z);
  expect(ns.get('b')).to.equal(exp.b);

  expect(ns.getName()).to.equal(exp.n);
  expect(ns.getZone()).to.equal(exp.z);
  expect(ns.getBase()).to.equal(exp.b);
};

const testSetters = (init, exp) => {
  const ns1 = Namespace();
  ns1.n = init.n;
  ns1.z = init.z;
  ns1.b = init.b;
  testGetters(ns1, exp);
  const ns2 = Namespace();
  ns2.set('n', init.n);
  ns2.set('z', init.z);
  ns2.set('b', init.b);
  testGetters(ns2, exp);
  const ns3 = Namespace();
  ns3.setName(init.n);
  ns3.setZone(init.z);
  ns3.setBase(init.b);
  testGetters(ns3, exp);
}

/**
 * Given { z, b, n }
 * Combinations:
 * z
 * b
 * n
 * z b
 * z n
 * b n
 * z b n
 */
const cases = [
  {
    init: { z: 'foo', b: 'bar', n: 'baz' },
    args: ['foo', 'bar', 'baz'],
    stringified: 'foo.bar.baz',
    expected: { z: 'foo', b: 'bar', n: 'baz', isEmpty: false, isValid: true },
  },
  {
    init: { b: 'bar', z: null, n: undefined },
    args: [null, 'bar', null],
    stringified: '.bar.',
    expected: { z: undefined, b: 'bar', n: undefined, isEmpty: false, isValid: false },
  },
  {
    init: { z: 'foo', b: '' },
    args: ['foo', '', null],
    stringified: 'foo..',
    expected: { z: 'foo', b: undefined, n: undefined, isEmpty: false, isValid: false },
  },
  {
    init: { z: 'foo', n: 'bar' },
    args: ['foo', undefined, 'bar'],
    stringified: 'foo..bar',
    expected: { z: 'foo', b: undefined, n: 'bar', isEmpty: false, isValid: true },
  },
  {
    init: { z: 'foo', b: 'bar' },
    args: ['foo', 'bar', ''],
    stringified: 'foo.bar.',
    expected: { z: 'foo', b: 'bar', n: undefined, isEmpty: false, isValid: false },
  },
  {
    init: { n: 'bar' },
    args: ['bar'],
    stringified: '..bar',
    expected: { z: undefined, b: undefined, n: 'bar', isEmpty: false, isValid: true },
  },
  {
    init: { b: 'bar', n: 'baz' },
    args: ['bar', 'baz'],
    stringified: '.bar.baz',
    expected: { z: undefined, b: 'bar', n: 'baz', isEmpty: false, isValid: true },
  },
  {
    init: {},
    args: [null, undefined, '', 'foo'],
    stringified: '',
    expected: { z: undefined, b: undefined, n: undefined, isEmpty: true, isValid: false },
  },
];

describe('models/entity/namespace', function() {
  it('should return a factory function', function(done) {
    expect(Namespace).to.be.a('function');
    done();
  });
  describe('#()', function() {
    it('it should be a Namespace instance', function(done) {
      testInstance(Namespace());
      done();
    });
    cases.forEach((c, i) => {
      it(`should create the Namespace with the expected values for case ${i}`, function(done) {
        const { init, expected } = c;
        const ns = Namespace(init);
        testGetters(ns, expected);
        done();
      });
      it(`should properly set values to the Namespace for case ${i}`, function(done) {
        const { init, expected } = c;
        testSetters(init, expected);
        done();
      });
    });
  });
  describe('#make()', function() {
    it('should be a static function', function(done) {
      testStaticMethod('make');
      done();
    });
    it('should return a Namespace object instance', function(done) {
      const ns = Namespace.make();
      testInstance(ns);
      done();
    });
    cases.forEach((c, i) => {
      it(`should create the Namespace with the expected values for case ${i}`, function(done) {
        const { args, expected } = c;
        const ns = Namespace.make(...args);
        testGetters(ns, expected);
        done();
      });
    });
  });
  describe('#fromString()', function() {
    it('should be a static function', function(done) {
      testStaticMethod('fromString');
      done();
    });
    it('should return a Namespace object instance', function(done) {
      const ns = Namespace.fromString();
      testInstance(ns);
      done();
    });
    it('should create the Namespace with the expected edge-case values', function(done) {
      testGetters(Namespace.fromString('bar'), { z: undefined, b: undefined, n: 'bar' });
      testGetters(Namespace.fromString('foo.bar'), { z: undefined, b: 'foo', n: 'bar' });
      done();
    });
    cases.forEach((c, i) => {
      it(`should create the Namespace with the expected values for case ${i}`, function(done) {
        const { stringified, expected } = c;
        const ns = Namespace.fromString(stringified);
        testGetters(ns, expected);
        done();
      });
    });
  });
  describe('#toString()', function() {
    cases.forEach((c, i) => {
      const { stringified, init, args } = c;
      it(`should create correct stringified value for case ${i}`, function(done) {
        [Namespace(init),  Namespace.fromString(stringified), Namespace.make(...args)]
          .forEach(ns => expect(ns.toString()).to.equal(stringified));
        done();
      });
    });
  });
  describe('#isValid()', function() {
    cases.forEach((c, i) => {
      const { stringified, init, args, expected } = c;
      it(`should return the correct value for case ${i}`, function(done) {
        [Namespace(init), Namespace.fromString(stringified), Namespace.make(...args)]
          .forEach(ns => expect(ns.isValid()).to.equal(expected.isValid));
        done();
      });
    });
  });
  describe('#isEmpty()', function() {
    cases.forEach((c, i) => {
      const { stringified, init, args, expected } = c;
      it(`should return the correct value for case ${i}`, function(done) {
        [Namespace(init), Namespace.fromString(stringified), Namespace.make(...args)]
          .forEach(ns=> expect(ns.isEmpty()).to.equal(expected.isEmpty));
        done();
      });
    });
  });
});
