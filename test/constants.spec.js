const expect = require('chai').expect;
const constants = require('../src/constants');

describe('constants', function() {
  it('should return a frozen object', function(done) {
    expect(constants).to.be.frozen;
    done();
  });
  it('should return the appropriate values', function(done) {
    const cases = [
      { name: 'APP_NAME', value: 'Sapience' },
      { name: 'DEFAULT_TRACKER_NAME', value: '_default_' },
      { name: 'WINDOW_VAR_NAME', value: 'SapienceObject' },
      { name: 'STORAGE_PREFIX', value: '__sapi_' },
      { name: 'DB_PREFIX', value: 'sapi' },
      { name: 'CLIENT_KEY_HEADER_NAME', value: 'X-Sapience-ClientKey' },
    ];
    cases.forEach(c => {
      const { name, value } = c;
      expect(constants[name]).to.equal(value);
    })
    done();
  });
});
