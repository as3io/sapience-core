module.exports = (value) => {
  if (!value || typeof value !== 'object') return false;
  return true;
};
