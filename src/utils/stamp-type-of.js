const isObject = require('./is-object');

module.exports = (value) => {
  if (!isObject(value)) return undefined;
  return value.stampType;
};
