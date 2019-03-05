const Handlebars = require('handlebars');
const _          = require('lodash');
const I18n       = require('i18n');

module.exports = (keyword, list, lang) => {
  if (!keyword) return '';
  if (!_.isEmpty(list)) return '';
  I18n.setLocale(lang);
  const text = I18n.__(keyword);
  return new Handlebars.SafeString(`<span class="pill th">${text}</span>`);
}
