const _      = require('lodash');
const I18n   = require('i18n');

module.exports = (inputKey, errors, lang) => {
  I18n.setLocale(lang);
  if (_.has(errors, inputKey)) return I18n.__(`${inputKey}_is_invalid`);
};
