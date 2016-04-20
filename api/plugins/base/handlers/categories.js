var Boom = require('boom');

exports.index = (request, reply) => {
  const q = 'SELECT id, name FROM categories ORDER BY name';
  request.pg.client.query(q, (err, result) => {
    if (err) { return reply(Boom.badRequest()); }
    reply({
      categories: result.rows
    });
  });
};
