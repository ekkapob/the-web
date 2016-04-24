import Boom     from 'boom';
import _        from 'lodash';
import S        from 'squel';
const Squel = S.useFlavour('postgres');

exports.index = (request, reply) => {
  let { limit, car_brands, categories, page } = request.query;
  car_brands = prepare(car_brands);
  categories = prepare(categories);
  limit = parseInt(limit) || 18;
  page = parseInt(page);
  page = isNaN(page) ? 1 : page;
  page = (page <= 0) ? 1 : page;
  const offset = (page - 1) * limit;

  let q = Squel.select()
            .from('products')
            .field('COUNT(1) OVER() AS all_records')
            .field('products.product_id')
            .field('products.name')
            .field('products.details')
            .field('products.part_no')
            .field('products.engine_model')
            .field('car_brands.name AS car_name')
            .left_join('car_brands', null, 'products.car_brand_id = car_brands.id')
            .left_join('categories', null, 'products.category_id = categories.id');
  if (!_.isEmpty(car_brands)) q.where('car_brands.name IN ?', car_brands);
  if (!_.isEmpty(categories)) q.where('categories.name IN ?', categories);
  q.order('products.created_at')
    .limit(limit)
    .offset(offset)
  q = q.toParam();

  request.pg.client.query(q.text, q.values, (err, result) => {
    if (err) { return reply(Boom.badRequest()); }
    const all_records = result.rows[0]?
      parseInt(result.rows[0].all_records) : 0;
    const data = {
      all_records,
      page,
      limit,
      products: result.rows,
      query_params: {
        car_brands,
        categories
      }
    }
    reply(data);
  });
};

exports.show = (request, reply) => {
  const { productId } = request.params;
  let q = Squel.select()
            .from('products')
            .field('products.product_id')
            .field('products.name')
            .field('products.details')
            .field('products.part_no')
            .field('products.engine_model')
            .field('car_brands.name AS car_name')
            .field('categories.name AS category')
            .left_join('car_brands', null, 'products.car_brand_id = car_brands.id')
            .left_join('categories', null, 'products.category_id = categories.id')
            .where('products.product_id = ?', productId)
            .toParam();
  request.pg.client.query(q.text, q.values, (err, result) => {
    if (err) { return reply(Boom.badRequest()); }
    reply({
      product: result.rows
    });
  });
};

function prepare(query) {
  return [].concat(query).filter((value) => {
    return value && value.trim();
  });
}

