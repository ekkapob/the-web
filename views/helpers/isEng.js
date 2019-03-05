const _ = require('lodash');

module.exports = (lang, options) => {
  if (lang == 'en') return options.fn(this);
  return options.inverse(this);
}
