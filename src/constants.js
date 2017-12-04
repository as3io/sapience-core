const APP_NAME = 'Sapience';
module.exports = Object.freeze({
  APP_NAME,
  DEFAULT_TRACKER_NAME: '_default_',
  WINDOW_VAR_NAME: `${APP_NAME}Object`,
  STORAGE_PREFIX: '__sapi_',
  DB_PREFIX: 'sapi',
  CLIENT_KEY_HEADER_NAME: `X-${APP_NAME}-ClientKey`,
});
