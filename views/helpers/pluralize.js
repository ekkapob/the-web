const I18n       = require('i18n');
const Handlebars = require('handlebars');

module.exports = (number, single, plural, lang) => {
  if (isNaN(parseInt(number))) return;
  if (lang == 'th') {
    I18n.setLocale(lang);
    return I18n.__(single);
  }

  if (number > 1) return plural;
  return single;
};
