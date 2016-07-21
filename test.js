const Joi = require('joi');

const report = {
  full_name: '123',
  date: '12/06/1981'
};

const schema = {
  full_name: Joi.string().label('Full Name').required(),
  date: Joi.date().required()
};

// Joi.assert(report, schema);
Joi.validate({name: '', date: ''}, schema,
             { abortEarly: false },
             function(err, value){
  console.log(err)
  // console.log(value)
})
