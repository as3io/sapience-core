const expect = require('chai').expect;
const uuidUtil = require('../../src/utils/uuid');

describe('utils/uuid', function() {
  describe('#normalize', function() {
    it('should be a function', function(done) {
      expect(uuidUtil.normalize).to.be.a('function');
      done();
    });
    it('should return the properly normalized values', function(done) {
      const cases = [
        ['00000000000000000000000000000000', '00000000000000000000000000000000'],
        ['3e968636-cfd3-47a1-aaa9-578ba19ba03a', '3e968636cfd347a1aaa9578ba19ba03a'],
        ['3e968636cfd3-47a1aaa9-578ba19ba03a', '3e968636cfd347a1aaa9578ba19ba03a'],
        ['3e968636cfd347a1aaa9578ba19ba03a', '3e968636cfd347a1aaa9578ba19ba03a'],
        ['3E968636-cfd3-47a1aaa9-578bA19ba03a', '3e968636cfd347a1aaa9578ba19ba03a'],
        [' 3E968636-cfd3-47a1aaa9-578bA19ba03a   ', '3e968636cfd347a1aaa9578ba19ba03a'],
        [null, ''], [undefined, ''], [1, '1'],
      ];
      cases.forEach(v => expect(uuidUtil.normalize(v[0])).to.equal(v[1]));
      done();
    });
  });
  describe('#isValid()', function() {
    it('should be a function', function(done) {
      expect(uuidUtil.isValid).to.be.a('function');
      done();
    });
    it('should return true on UUID values', function(done) {
      const cases = [
        '00000000000000000000000000000000',
        '3e968636-cfd3-47a1-aaa9-578ba19ba03a',
        '3e968636cfd3-47a1aaa9-578ba19ba03a',
        '3e968636cfd347a1aaa9578ba19ba03a',
        '3E968636-cfd3-47a1aaa9-578bA19ba03a',
        ' 3E968636-cfd3-47a1aaa9-578bA19ba03a   ',
      ];
      cases.forEach(v => expect(uuidUtil.isValid(v)).to.equal(true));
      done();
    });
    it('should return false on non-UUID values', function(done) {
      const cases = [
        null, undefined, 1, '1', 0, [], {}, 'abc012',
        00000000000000000000000000000000,
        '3z968636-cfd3-47a1-aaa9-578ba19ba03a',
        '3z968636cfd347a1aaa9578ba19ba03a',
      ];
      cases.forEach(v => expect(uuidUtil.isValid(v)).to.equal(false));
      done();
    });
  });
});
