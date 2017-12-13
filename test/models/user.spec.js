const expect = require('chai').expect;
const User = require('../../src/models/user');
const Namespace = require('../../src/models/entity/namespace');
const { APP_NAME } = require('../../src/constants');

const testInstance = (ent) => {
  expect(ent).to.be.a('object');
  expect(ent).to.respondTo('getStamp');
  expect(ent.getStamp()).to.equal(User);
};

const testStaticMethod = (method) => {
  expect(User[method]).to.be.a('function');
};

describe('models/user', function() {
  it('should return a factory function', function(done) {
    expect(User).to.be.a('function');
    done();
  });
  describe('#anon', function() {
    it('should not be settable', function(done) {
      const user = User();
      expect(user.anon).to.be.false;
      user.anon = true;
      expect(user.anon).to.be.false;
      done();
    });
  });
  describe('#()', function() {
    it('it should be a User instance', function(done) {
      testInstance(User());
      done();
    });
  });
  describe('#createAnon()', function() {
    it('should be a static function', function(done) {
      testStaticMethod('createAnon');
      done();
    });
    it('should return a User object instance', function(done) {
      const user = User.createAnon();
      testInstance(user);
      done();
    });
    it('should be anonymous and contain an id', function(done) {
      const user = User.createAnon();
      expect(user.isAnonymous()).to.be.true;
      expect(user.anon).to.be.true;
      expect(user.id).to.be.a('string');
      expect(user.id.length).to.be.greaterThan(0);
      done();
    });
  });
  describe('#getAnonNamespace()', function() {
    it('should be a static function', function(done) {
      testStaticMethod('getAnonNamespace');
      done();
    });
    it('should return a Namespace object instance', function(done) {
      const ns = User.getAnonNamespace();
      expect(ns.getStamp()).to.equal(Namespace);
      done();
    });
    it('should contain the proper anonymous values', function(done) {
      const ns = User.getAnonNamespace();
      expect(ns.z).to.equal(APP_NAME.toLowerCase());
      expect(ns.b).to.equal('anon');
      expect(ns.n).to.equal('user');
      done();
    });
  });
  describe('#isAnonymous()', function() {
    it('should return true for an anonymous user', function(done) {
      const user1 = User.createAnon();
      const user2 = User({ id: '1234', ns: { z: APP_NAME.toLowerCase(), b: 'anon', n: 'user' } });
      expect(user1.isAnonymous()).to.be.true;
      expect(user2.isAnonymous()).to.be.true;
      expect(user1.anon).to.be.true;
      expect(user2.anon).to.be.true;
      done();
    });
    it('should return false for a non-anonymous user', function(done) {
      const user1 = User();
      const user2 = User({ id: '1234', ns: { z: 'something-else', b: 'anon', n: 'user' } });
      expect(user1.isAnonymous()).to.be.false;
      expect(user2.isAnonymous()).to.be.false;
      expect(user1.anon).to.be.false;
      expect(user2.anon).to.be.false;
      done();
    });
  });
});
