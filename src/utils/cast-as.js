const noCase = require('no-case');

/**
 * Casts a value as a string.
 *
 * @param {*} v
 * @returns {string}
 */
const string = (v) => {
  if (v === undefined || v === null || Number.isNaN(v)) return '';
  return String(v).trim();
};

/**
 * Casts a value as a dasherized string.
 *
 * @param {*} v
 * @returns {string}
 */
const dasherized = (v) => {
  const cast = string(v);
  return cast.length ? noCase(cast, null, '-') : cast;
};

module.exports = {
  string,
  dasherized,
};
