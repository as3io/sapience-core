const castAs = require('./cast-as');

const normalize = value => castAs.string(value).replace(/-/g, '').toLowerCase();

const isValid = (value) => {
  const v = normalize(value);
  const regex = RegExp('^[a-f0-9]{32}$');
  return regex.test(v);
};

module.exports = {
  normalize,
  isValid,
};
