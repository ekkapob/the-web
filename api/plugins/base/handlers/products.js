import Async    from 'async';
import Boom     from 'boom';
import _        from 'lodash';
import S        from 'squel';
const Squel = S.useFlavour('postgres');

exports.index = (request, reply) => {
  let { limit, car_brands, categories, subcategories, page } = request.query;
  car_brands = prepare(car_brands);
  categories = prepare(categories);
  subcategories = prepare(subcategories);

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
            .field('products.primary_image')
            .field('products.images')
            .field('car_brands.name AS car_name')
            .field('categories.name AS category')
            .field('subcategories.name AS subcategory')
            .left_join('car_brands', null, 'products.car_brand_id = car_brands.id')
            .left_join('categories', null, 'products.category_id = categories.id')
            .left_join('subcategories', null, 'products.subcategory_id = subcategories.id');
  if (!_.isEmpty(car_brands)) q.where('car_brands.name IN ?', car_brands);
  if (!_.isEmpty(categories)) q.where('categories.name IN ?', categories);
  if (!_.isEmpty(subcategories)) q.where('subcategories.name IN ?', subcategories);
  q.order('products.created_at')
    .limit(limit)
    .offset(offset);
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
        categories,
        subcategories
      }
    }
    reply(data);
  });
};

exports.show = (request, reply) => {
  const { productId } = request.params;
  Async.waterfall([
    fetchProduct(request, productId)
  ], (err, result) => {
    if (err) return reply(Boom.badRequest());
    reply({
      product: result
    });
  });
};

function fetchProduct(request, productId) {
  return (cb) => {
    let q = Squel.select()
              .from('products')
              .field('products.product_id')
              .field('products.substitute_part_no')
              .field('products.name')
              .field('products.details')
              .field('products.part_no')
              .field('products.engine_model')
              .field('products.remark')
              .field('products.primary_image')
              .field('products.images')
              .field('car_brands.name AS car_brand')
              .field('categories.name AS category')
              .field('subcategories.name AS subcategory')
              .left_join('car_brands', null, 'products.car_brand_id = car_brands.id')
              .left_join('categories', null, 'products.category_id = categories.id')
              .left_join('subcategories', null, 'products.subcategory_id = subcategories.id')
              .where('products.product_id = ?', productId)
              .toParam();
    request.pg.client.query(q.text, q.values, (err, result) => {
      if (err) return cb(true);
      cb(null, result.rows);
    });
  };
}

function randomBy(request, randomType, randomName, limit = 10) {
  return (cb) => {
    let whereClause;
    if (['categories', 'subcategories', 'car_brands'].indexOf(randomType) != -1) {
      whereClause = Squel.expr()
                     .and(`${randomType}.name = ?`, randomName);
    }
    let q = Squel.select()
              .from('products')
              .field('products.product_id AS id')
              .field('products.name AS name')
              .field('categories.name AS category')
              .field('subcategories.name AS subcategory')
              .field('car_brands.name AS car_brand')
              .left_join('car_brands', null, 'products.car_brand_id = car_brands.id')
              .left_join('categories', null, 'products.category_id = categories.id')
              .left_join('subcategories', null, 'products.subcategory_id = subcategories.id')
              .where(whereClause)
              .order('RANDOM()')
              .limit(limit)
              .toParam();
    request.pg.client.query(q.text, q.values, (err, result) => {
      if (err) return cb(true);
      cb(null, result.rows);
    });
  };
}

function recommended(request, productId, categoryName, subcategoryName, carBrand) {
  return (cb) => {
    let whereClause = Squel.expr()
                        .and('products.product_id <> ?', productId);
    if (!_.isEmpty(categoryName)) whereClause.and('categories.name = ?', categoryName);
    if (!_.isEmpty(subcategoryName)) whereClause.and('subcategories.name = ?', subcategoryName);
    if (!_.isEmpty(carBrand)) whereClause.and('car_brands.name = ?', carBrand);
    let q = Squel.select()
              .from('products')
              .field('products.product_id AS id')
              .field('products.name AS name')
              .field('products.primary_image AS image')
              .field('categories.name AS category')
              .field('subcategories.name AS subcategory')
              .field('car_brands.name AS car_brand')
              .left_join('car_brands', null, 'products.car_brand_id = car_brands.id')
              .left_join('categories', null, 'products.category_id = categories.id')
              .left_join('subcategories', null, 'products.subcategory_id = subcategories.id')
              .where(whereClause)
              .order('RANDOM()')
              .limit(6)
              .toParam();
    request.pg.client.query(q.text, q.values, (err, result) => {
      if (err) return cb(true);
      cb(null, result.rows);
    });
  };
};

exports.recommended = (request, reply) => {
  const { productId } = request.params;
  Async.series({
    product: fetchProduct(request, productId),
  }, (err, result) => {
    if(err) return reply(Boom.badRequest());

    const { product_id, category, subcategory, car_brand } = result.product[0];
    Async.parallel({
      recommended: recommended(request, product_id, category, subcategory, car_brand),
      randomBySubcategory: randomBy(request, 'subcategories', subcategory),
      randomByCategory: randomBy(request, 'categories', category),
      randomByCarBrand: randomBy(request, 'car_brands', car_brand)
    }, (err, result) => {
      if(err) return reply(Boom.badRequest());

      let {
        recommended,
        randomBySubcategory,
        randomByCategory,
        randomByCarBrand } = result;
      randomBySubcategory = randomBySubcategory.filter(excludeProductId(product_id));
      randomByCategory = randomByCategory.filter(excludeProductId(product_id));
      randomByCarBrand = randomByCarBrand.filter(excludeProductId(product_id));

      recommended = _.concat(recommended,
                             randomByCarBrand,
                             randomBySubcategory,
                             randomByCategory);
      reply({
        recommended: _.take(recommended, 6)
      });
    });
  });
};

exports.random = (request, reply) => {
  const { subcategoryId, limit } = request.query;
  let productLimit = limit || 3;

  let q = Squel.select()
            .from('products')
            .field('products.product_id AS id')
            .field('products.primary_image')
            .field('products.name')
            .field('car_brands.name AS car_brand')
            .field('categories.name AS category')
            .field('subcategories.name AS subcategory')
            .field('products.details')
            .left_join('car_brands', null, 'products.car_brand_id = car_brands.id')
            .left_join('categories', null, 'products.category_id = categories.id')
            .left_join('subcategories', null, 'products.subcategory_id = subcategories.id')
            .where(
              Squel.expr()
                .and('products.primary_image IS NOT NULL')
                .and("products.details <> ''")
                .and('subcategories.id = ?', subcategoryId)
            )
            .order('RANDOM()')
            .limit(productLimit)
            .toParam();
  request.pg.client.query(q.text, q.values, (err, result) => {
    if (err) { return reply(Boom.badRequest()); }
    reply({
      products: result.rows
    });
  });
}

function excludeProductId(productId) {
  return (value) => {
    return value.id != productId;
  };
}

function prepare(query) {
  return [].concat(query).filter((value) => {
    return value && value.trim();
  });
}

