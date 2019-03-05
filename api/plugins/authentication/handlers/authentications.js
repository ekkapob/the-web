const Bcrypt       = require('bcrypt');
const Boom         = require('boom');
const _            = require('lodash');
const S            = require('squel');
const Joi          = require('joi');
const Validation   = require('../utils/validation');

const Squel = S.useFlavour('postgres');

exports.signin = (request, reply) => {
  const { username, password } = request.payload;
  let q = Squel.select()
            .from('users')
            .where('username = ?', username)
            .toParam();

  request.pg.client.query(q.text, q.values, (err, result) => {
    const invalidResponse = 'invalid password or username';
    if (err) return reply(Boom.badRequest());
    if (_.isEmpty(result.rows)) return reply(Boom.unauthorized(invalidResponse));

    let user = result.rows[0];
    if(!isAuthenticated(password, user.hash_password)) {
      return reply(Boom.unauthorized(invalidResponse));
    }

    delete user.hash_password;
    const { username, name, email, phone, address,
      country, city, zip, role } = user;
    reply({
      success: true,
      user_id: user.id,
      username, name, email, phone, address, country, city, zip, role
    });
  });
}

exports.signup = (request, reply) => {

  const errors = Validation.validate(request.payload, {
    username: Joi.string().required(),
    password: Joi.string().required(),
    confirm_password: Joi.string().required(),
    name: Joi.string().required(),
    email: Joi.string().regex(Validation.emailRegex()).required(),
    phone: Joi.string().required(),
    address: Joi.string().required(),
    country: Joi.string().required(),
    city: Joi.string().required(),
    zip: Joi.string().required(),
    remarks: Joi.any().optional()
  });

  if (!_.isEmpty(errors)) {
    return reply({
      errors,
    }).code(400);
  }

  const {
    username,
    password, confirm_password,
    name, email, phone, address, country, city, zip, remarks
  } = request.payload;

  if (password != confirm_password) {
    return reply({
      errors: {
        password: [
          "password and password confirmation must be the same"
        ]
      }
    }).code(400); 
  }

  let q = Squel.select()
            .from('users')
            .where('username = ?', username)
            .toParam();

  request.pg.client.query(q.text, q.values, (err, result) => {
    if (err) return reply(Boom.badRequest());
    if (!_.isEmpty(result.rows)) {
      return reply({
        errors: {
          username: [
            "This username is not available. Please enter new username."
          ]
        }
      }).code(403);
    }
    // Store user in database
    q = Squel.insert()
          .into('users')
          .set('username', username)
          .set('hash_password', getHashPassword(password))
          .set('name', name)
          .set('email', email)
          .set('phone', phone)
          .set('address', address)
          .set('country', country)
          .set('city', city)
          .set('zip', zip)
          .returning('id')
          .toParam();
    request.pg.client.query(q.text, q.values, (err, result) => {
      if (err) return reply(Boom.badRequest());
      reply({
        user_id: result.rows[0].id,
        username, name, email, phone, address, country, city, zip
      }).code(201);
    });

  });
}

function getHashPassword(password) {
  return Bcrypt.hashSync(password, 10);
}

function isAuthenticated(password, hashPassword) {
  return Bcrypt.compareSync(password, hashPassword);
}
