const expect = require('chai').expect;
const Entity = require('../../../src/models/entity');
const Namespace = require('../../../src/models/entity/namespace');

const testInstance = (ent) => {
  expect(ent).to.be.a('object');
  expect(ent).to.respondTo('getStamp');
  expect(ent.getStamp()).to.equal(Entity);
};

const testStaticMethod = (method) => {
  expect(Entity[method]).to.be.a('function');
};

const testGetters = (ent, exp) => {
  expect(ent.id).to.equal(exp.id);
  expect(ent.getId()).to.equal(exp.id);

  const namespaces = [ent.ns, ent.getNamespace()];
  namespaces.forEach((ns) => {
    expect(ns.z).to.equal(exp.ns.z);
    expect(ns.b).to.equal(exp.ns.b);
    expect(ns.n).to.equal(exp.ns.n);
  });
};

const testSetters = (init, exp) => {
  const ent1 = Entity();
  ent1.id = init.id;
  ent1.ns = init.ns;
  testGetters(ent1, exp);
  const ent2 = Entity();
  ent2.setId(init.id);
  ent2.setNamespace(init.ns);
  testGetters(ent2, exp);
}

const cases = [
  {
    init: { id: 1234, ns: { z: 'foo', b: 'bar', n: 'baz' } },
    args: [1234, 'foo', 'bar', 'baz'],
    stringified: '1234*foo.bar.baz',
    expected: { id: '1234', ns: { z: 'foo', b: 'bar', n: 'baz' }, isValid: true },
  },
  {
    init: { id: 1234 },
    args: [1234],
    stringified: '1234*',
    expected: { id: '1234', ns: { z: undefined, b: undefined, n: undefined }, isValid: false },
  },
  {
    init: { ns: { z: 'foo', b: 'bar', n: 'baz' } },
    args: [null, 'foo', 'bar', 'baz'],
    stringified: '*foo.bar.baz',
    expected: { id: undefined, ns: { z: 'foo', b: 'bar', n: 'baz' }, isValid: false },
  },
];

describe('models/entity', function() {
  it('should return a factory function', function(done) {
    expect(Entity).to.be.a('function');
    done();
  });
  describe('#()', function() {
    it('it should be an Entity instance', function(done) {
      testInstance(Entity());
      done();
    });
    cases.forEach((c, i) => {
      it(`should create the Entity with the expected values for case ${i}`, function(done) {
        const { init, expected } = c;
        const ent = Entity(init);
        testGetters(ent, expected);
        done();
      });
      it(`should properly set values to the Entity for case ${i}`, function(done) {
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
    it('should return an Entity object instance', function(done) {
      const ent = Entity.make();
      testInstance(ent);
      done();
    });
    cases.forEach((c, i) => {
      it(`should create the Entity with the expected values for case ${i}`, function(done) {
        const { args, expected } = c;
        const ent = Entity.make(...args);
        testGetters(ent, expected);
        done();
      });
    });
  });
  describe('#fromString()', function() {
    it('should be a static function', function(done) {
      testStaticMethod('fromString');
      done();
    });
    it('should return an Entity object instance', function(done) {
      const ent = Entity.fromString();
      testInstance(ent);
      done();
    });
    cases.forEach((c, i) => {
      it(`should create the Entity with the expected values for case ${i}`, function(done) {
        const { stringified, expected } = c;
        const ent = Entity.fromString(stringified);
        testGetters(ent, expected);
        done();
      });
    });
  });
  describe('#toString()', function() {
    cases.forEach((c, i) => {
      const { stringified, init, args } = c;
      it(`should create correct stringified value for case ${i}`, function(done) {
        [Entity(init),  Entity.fromString(stringified), Entity.make(...args)]
          .forEach(ent => expect(ent.toString()).to.equal(stringified));
        done();
      });
    });
  });
  describe('#isValid()', function() {
    cases.forEach((c, i) => {
      const { stringified, init, args, expected } = c;
      it(`should return the correct value for case ${i}`, function(done) {
        [Entity(init), Entity.fromString(stringified), Entity.make(...args)]
          .forEach(ent => expect(ent.isValid()).to.equal(expected.isValid));
        done();
      });
    });
  });
  describe('#coerceId()', function() {
    it('should be a static function', function(done) {
      testStaticMethod('coerceId');
      done();
    });
    const idCases = [
      { value: '', expected: undefined },
      { value: undefined, expected: undefined },
      { value: null, expected: undefined },
      { value: NaN, expected: undefined },
      { value: '   ', expected: undefined },
      { value: ' foo  ', expected: 'foo' },
      { value: 1, expected: '1' },
      { value: 0, expected: '0' },
      { value: -1, expected: '-1' },
      { value: 1.1, expected: '1.1' },
      { value: String('foo'), expected: 'foo' },
      { value: true, expected: 'true' },
      { value: false, expected: 'false' },
      { value: [], expected: undefined },
      { value: [1, 'a', false], expected: '1,a,false' },
    ];

    idCases.forEach((c, i) => {
      const { value, expected } = c;
      it(`should return '${expected}' for case ${i} (typeof ${typeof value})`, function(done) {
        expect(Entity.coerceId(value)).to.equal(expected);
        done();
      });
    });
  });
  describe('#createNamespace()', function() {
    it('should be a static function', function(done) {
      testStaticMethod('createNamespace');
      done();
    });
    const nsCases = [
      'foo.bar.baz',
      ['foo', 'bar', 'baz'],
      { z: 'foo', b: 'bar', n: 'baz' },
      null,
      undefined,
    ];
    nsCases.forEach((v, i) => {
      it(`should return a Namespace instance for aguments ${v} (case ${i})`, function(done) {
        const ns = Entity.createNamespace(v);
        expect(ns.getStamp()).to.equal(Namespace);
        done();
      });
      it(`should return the correct namespace values for agument type ${typeof v} (case ${i})`, function(done) {
        const ns = Entity.createNamespace(v);
        if (v) {
          expect(ns.z).to.equal('foo');
          expect(ns.b).to.equal('bar');
          expect(ns.n).to.equal('baz');
        } else {
          expect(ns.z).to.be.undefined;
          expect(ns.b).to.be.undefined;
          expect(ns.n).to.be.undefined;
        }
        done();
      });
    });
  });
});
