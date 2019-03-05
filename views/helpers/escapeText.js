const Handlebars = require('handlebars');

module.exports = (text1, text2) => {
  let text = text1 || text2;
  return new Handlebars.SafeString(text);
};
