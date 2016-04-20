import Boom     from 'boom';
import _        from 'lodash';
import PgEscape from 'pg-escape';
import S        from 'squel';

exports.index = (request, reply) => {
  // const carBrandsList = queryStringList(request.query,'car_brands');
  // const carBrandsQuery = _.isEmpty(carBrandsList)?
  //   '' : `car_brands.name IN ${carBrandsList}`
  // const categoriesList = queryStringList(request.query,'categories');
  // const categoriesQuery = _.isEmpty(categoriesList)?
  //   '' : `categories.name IN ${categoriesList}`

  // const where = (carBrandsQuery || categoriesQuery)?
  //   `WHERE {carBrandsQuery}
  //
  let { limit, car_brands, categories, page } = request.query;
  car_brands = prepare(car_brands);
  categories = prepare(categories);
  limit = parseInt(limit) || 18;
  page = parseInt(page);
  page = isNaN(page) ? 1 : page;
  page = (page <= 0) ? 1 : page;
  const offset = (page - 1) * limit;

  const Squel = S.useFlavour('postgres');
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

  // let q = `SELECT COUNT(1) OVER() AS all_records,
  //     products.id,
  //     products.product_id,
  //     products.name,
  //     products.details,
  //     products.part_no,
  //     products.engine_model,
  //     car_brands.name AS car_name
  //   FROM products
  //   LEFT JOIN car_brands ON products.car_brand_id = car_brands.id
  //   LEFT JOIN categories ON products.category_id = categories.id
  //   ORDER BY products.created_at
  //   LIMIT $1
  //   OFFSET $2`;

  // let { limit, car_brands, page } = request.query;
  // limit = parseInt(limit) || 18;
  // page = parseInt(page);
  // page = isNaN(page) ? 1 : page;
  // page = (page <= 0) ? 1 : page;
  // const offset = (page - 1) * limit;

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

function prepare(query) {
  return [].concat(query).filter((value) => {
    return value && value.trim();
  });
}

// function listQueryValues(query, attr) {
//   let values = query[attr];
//   if (!values || _.isEmpty(values)) return;
//   values = [].concat(values);
//   values = values.filter((value) => {
//     return value && value.trim();
//   });
//   return values;
// }
//
// function commaSeparatedString(queryList) {
//   return _.isEmpty(queryList)? '' : PgEscape.literal(queryList);
// }
//
// function queryStringList(query, attr) {
//   const values = listQueryValues(query, attr);
//   if (_.isEmpty(values)) return '';
//   return commaSeparatedString(values);
// }

