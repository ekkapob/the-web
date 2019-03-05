const _ = require('lodash');

module.exports = (inputKey, errors) => {
  if (_.has(errors, inputKey)) return 'has-error';
};
