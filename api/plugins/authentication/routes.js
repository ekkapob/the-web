const Authentications = require('./handlers/authentications');

module.exports = [
  {
    method: 'POST',
    path: '/api/v1/signin',
    handler: Authentications.signin
  },
  {
    method: 'POST',
    path: '/api/v1/signup',
    handler: Authentications.signup
  }
];
