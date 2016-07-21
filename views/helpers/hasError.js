import _ from 'lodash';

module.exports = (inputKey, errors) => {
  if (_.has(errors, inputKey)) return 'has-error';
};
