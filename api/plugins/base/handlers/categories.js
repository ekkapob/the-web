const Boom     = require('boom');
const S        = require('squel');
const _        = require('lodash');
const Squel = S.useFlavour('postgres');

exports.index = (request, reply) => {
  const q = 'SELECT id, name, name_th FROM categories ORDER BY name';
  request.pg.client.query(q, (err, result) => {
    if (err) { return reply(Boom.badRequest()); }
    reply({
      categories: result.rows
    });
  });
};

exports.create = (request, reply) => {
  const { name, name_th } = request.payload;
  if (_.isEmpty(name) || _.isEmpty(name_th)) return reply().code(200);

  let q = Squel.insert()
            .into('categories')
            .set('name', name)
            .set('name_th', name_th)
            .toParam();
  request.pg.client.query(q.text, q.values, (err, result) => {
    if (err) { return reply(Boom.badRequest()); }
    reply().code(201);
  });
};

exports.update = (request, reply) => {
  const { name, name_th } = request.payload;
  const id = request.params.id;
  const q = Squel.update()
            .table('categories')
            .set('name', name)
            .set('name_th', name_th)
            .where('id = ?', id).toParam();
  request.pg.client.query(q.text, q.values, (err, result) => {
    if (err) return reply(Boom.badRequest());
    reply().code(200);
  });
};

exports.deleteAndConvert = (request, reply) => {
  const { id, new_id } = request.params;
  let q = Squel.update()
            .table('products')
            .set('category_id', new_id)
            .where('category_id = ?', id).toParam();
  request.pg.client.query(q.text, q.values, (err, result) => {
    if (err) return reply(Boom.badRequest());
    q = Squel.delete()
            .from('categories')
            .where('id = ?', id)
            .toParam();
    request.pg.client.query(q.text, q.values, (err, result) => {
      if (err) return reply(Boom.badRequest());
      reply().code(200);
    });
  });
};
