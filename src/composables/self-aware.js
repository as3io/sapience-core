const compose = require('stampit');

module.exports = compose.composers(({ stamp }) => {
  /* eslint-disable no-param-reassign */
  stamp.compose.methods = stamp.compose.methods || {};
  stamp.compose.methods.getStamp = () => stamp;
  /* eslint-enabled no-param-reassign */
});
