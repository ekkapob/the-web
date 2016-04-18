var Boom = require('boom');

exports.index = (request, reply) => {
  q = 'SELECT id, name FROM car_brands ORDER BY name'
  request.pg.client.query(q, (err, result) => {
    if (err) { return reply(Boom.badRequest()); }
    reply(result.rows);
  });
};
