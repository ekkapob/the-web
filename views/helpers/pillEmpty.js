import Handlebars from 'handlebars';
import _          from 'lodash';

module.exports = (text, list) => {
  if (!text) return '';
  if (!_.isEmpty(list)) return '';
  return new Handlebars.SafeString(`<span class="pill">${text}</span>`);
}
