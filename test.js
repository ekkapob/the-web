const Joi = require('joi');

const report = {
  name: '123',
  date: '12/06/1981'
};

const schema = {
  name: Joi.string().max(100).required(),
  date: Joi.date().required()
};

Joi.assert(report, schema);
