import Boom     from 'boom';
import S        from 'squel';
import _        from 'lodash';
import path     from 'path';
import fs       from 'fs';
const Squel = S.useFlavour('postgres');

exports.index = (request, reply) => {
  const q = 'SELECT id, category_id, name, name_th FROM subcategories ORDER BY name';
  request.pg.client.query(q, (err, result) => {
    if (err) { return reply(Boom.badRequest()); }
    reply({
      subcategories: result.rows
    });
  });
};

exports.create = (request, reply) => {
  const { category_id, name, name_th } = request.payload;
  if (_.isEmpty(category_id)) return reply().code(200);
  if (_.isEmpty(name) || _.isEmpty(name_th)) return reply().code(200);

  let q = Squel.insert()
            .into('subcategories')
            .set('category_id', category_id)
            .set('name', name)
            .set('name_th', name_th)
            .toParam();
  request.pg.client.query(q.text, q.values, (err, result) => {
    if (err) { return reply(Boom.badRequest()); }
    reply().code(201);
  });
};

exports.update = (request, reply) => {
  const { category_id, name, name_th } = request.payload;
  const id = request.params.id;

  const retrieve = Squel.select('name')
                    .from('subcategories')
                    .field('name')
                    .where('id = ?', id)
                    .toParam();
  request.pg.client.query(retrieve.text, retrieve.values, (err, result) => {
    if (err) return reply(Boom.badRequest());
    const oldSubcategoryName = result.rows[0].name;

    // update subcategories
    const q = Squel.update()
              .table('subcategories')
              .set('category_id', category_id)
              .set('name', name)
              .set('name_th', name_th)
              .where('id = ?', id)
              .toParam();

    request.pg.client.query(q.text, q.values, (err, result) => {
      if (err) return reply(Boom.badRequest());
      // rename image folder
      if (oldSubcategoryName != name) {
        console.log('need change folder names');
        const oldProductImagePath = path.resolve(
          __dirname, '../../../../', 'assets/images/products',
          oldSubcategoryName.toLowerCase().replace(/\s/g, '_')
        );
        const newProductImagePath = path.resolve(
          __dirname, '../../../../', 'assets/images/products',
          name.toLowerCase().replace(/\s/g, '_')
        );
        fs.renameSync(oldProductImagePath, newProductImagePath);
      }
      reply().code(200);
    });

  });
};


exports.deleteAndConvert = (request, reply) => {
  const { id, new_id } = request.params;
  let q = Squel.update()
            .table('products')
            .set('subcategory_id', new_id)
            .where('subcategory_id = ?', id).toParam();
  request.pg.client.query(q.text, q.values, (err, result) => {
    if (err) return reply(Boom.badRequest());
    q = Squel.delete()
            .from('subcategories')
            .where('id = ?', id)
            .toParam();
    request.pg.client.query(q.text, q.values, (err, result) => {
      if (err) return reply(Boom.badRequest());
      reply().code(200);
    });
  });
};

