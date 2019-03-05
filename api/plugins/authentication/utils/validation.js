const _      = require('lodash');
const Joi    = require('joi');

exports.emailRegex = () => {
  return /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
};

exports.validate = (data, schema) => {
  const result = Joi.validate(data, schema, { abortEarly: false });
  return errorDetails(result.error);
};

// format errors to => key: [array of error messages]
function errorDetails(error) {
  if (_.isEmpty(error)) return null;
  let { details } = error;
  let result = {};
  details.forEach((error) => {
    if (!result[error.path]) return result[error.path] = [error.message];
    result[error.path].push(error.message);
  });
  return result;
}
