import Async    from 'async';
import Boom     from 'boom';
import _        from 'lodash';
import S        from 'squel';
const Squel = S.useFlavour('postgres');

exports.index = (request, reply) => {
  let {
    limit, car_brands, categories, subcategories, page
  } = request.query;

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
            .field('products.name_th')
            .field('products.details')
            .field('products.part_no')
            .field('products.engine_model')
            .field('products.primary_image')
            .field('products.images')
            .field('products.created_at')
            .field('products.last_modified_at')
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

exports.create = (request, reply) => {
  const { product_id, part_no, substitute_part_no,
    name, name_th, category, subcategory,
    carBrand, engine_model, details, details_th, remark, remark_th, images
  } = request.payload;

  if (_.isEmpty(product_id) || _.isEmpty(name)) return reply(Boom.badRequest());

  Async.waterfall([
    fetchProduct(request, product_id)
  ], (err, result) => {
    if (err) return reply(Boom.badRequest());
    if (result[0]) return reply(Boom.badRequest());

    let q = Squel.insert()
              .into('products')
              .set('product_id', product_id)
              .set('substitute_part_no', substitute_part_no)
              .set('engine_model', engine_model)
              .set('part_no', part_no)
              .set('name', name)
              .set('name_th', name_th)
              .set('details', details)
              .set('details_th', details_th)
              .set('remark', remark)
              .set('remark_th', remark_th);

    if (!_.isEmpty(images)) {
      q.set('images', `{${images.join(',')}}`);
      q.set('primary_image', images[0]);
    }
    if (category && !isNaN(parseInt(category))) {
      q.set('category_id', parseInt(category));
    }
    if (subcategory && !isNaN(parseInt(subcategory))) {
      q.set('subcategory_id', parseInt(subcategory));
    }
    if (carBrand && !isNaN(parseInt(carBrand))) {
      q.set('car_brand_id', parseInt(carBrand));
    }
    q = q.toParam();
    request.pg.client.query(q.text, q.values, (err, result) => {
      if (err) { return reply(Boom.badRequest()); }
      reply().code(201);
    });

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

exports.updatePrimaryImage = (request, reply) => {
  const { productId } = request.params;
  const { image_name } = request.payload;
  Async.waterfall([
    fetchProduct(request, productId)
  ], (err, result) => {
    if (err) return reply(Boom.badRequest());
    if (_.isEmpty(result[0])) return reply(Boom.badRequest());
    let q = Squel.update()
              .table('products')
              .set('primary_image', image_name)
              .where('product_id = ?', productId)
              .toParam();
    request.pg.client.query(q.text, q.values, (err, result) => {
      if (err) return reply(Boom.badRequest());
      reply().code(200);
    });
  });
}

exports.delete = (request, reply) => {
  const { productId } = request.params;
  let q = Squel.delete()
            .from('products')
            .where('product_id = ?', productId)
            .toParam();
  request.pg.client.query(q.text, q.values, (err, result) => {
    if (err) return reply(Boom.badRequest());
    reply().code(200);
  });
};

exports.removeImage = (request, reply) => {
  const { productId } = request.params;
  const { image_name } = request.payload;

  Async.parallel([
    fetchProduct(request, productId)
  ], (err, result) => {
    var productResult = result[0];
    var product = productResult[0];
    var subcategory = product.subcategory
    let q = Squel.update()
              .table('products')
              .set("images = array_remove(images, '" + image_name + "')");
    if (product.primary_image == image_name) {
      q = q.set('primary_image', null);
    }
    q = q.where('product_id = ?', productId).toParam();

    request.pg.client.query(q.text, q.values, (err, result) => {
      if (err) return reply(Boom.badRequest());
      reply({
        deleted_image_name: image_name,
        subcategory
      });
    });
  });

};

exports.update = (request, reply) => {
  const { product_id, part_no, substitute_part_no,
    name, name_th, category, subcategory,
    carBrand, engine_model, details, details_th, remark, remark_th, images
  } = request.payload;
  let q = Squel.update()
            .table('products')
            .set('product_id', product_id)
            .set('part_no', part_no)
            .set('substitute_part_no', substitute_part_no)
            .set('name', name)
            .set('name_th', name_th)
            .set('category_id', category)
            .set('subcategory_id', subcategory)
            .set('car_brand_id', carBrand)
            .set('engine_model', engine_model)
            .set('details', details)
            .set('details_th', details_th)
            .set('remark', remark)
            .set('remark_th', remark_th);

  if (!_.isEmpty(images)) {
    q = q.set("images = array_cat(images, '{" + images.join(',') + "}')")
  }
  q = q.where('product_id = ?', product_id).toParam();

  request.pg.client.query(q.text, q.values, (err, result) => {
    if (err) return reply(Boom.badRequest());
    reply().code(200);
  });
};

function fetchProduct(request, productId) {
  return (cb) => {
    let q = Squel.select()
              .from('products')
              .field('products.product_id')
              .field('products.substitute_part_no')
              .field('products.name')
              .field('products.name_th')
              .field('products.details')
              .field('products.details_th')
              .field('products.part_no')
              .field('products.engine_model')
              .field('products.remark')
              .field('products.remark_th')
              .field('products.primary_image')
              .field('products.images')
              .field('car_brands.name AS car_brand')
              .field('categories.name AS category')
              .field('subcategories.name AS subcategory')
              .left_join('car_brands', null, 'products.car_brand_id = car_brands.id')
              .left_join('categories', null, 'products.category_id = categories.id')
              .left_join('subcategories', null, 'products.subcategory_id = subcategories.id');

    if (productId == 'random') {
      q = q.order('RANDOM()').limit(1).toParam();
    } else {
      q = q.where('products.product_id = ?', productId).toParam();
    }

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
            .field('products.part_no AS part_no')
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

function fieldExpr(where, field, query) {
  where.or(`regexp_replace(${field}, E'[\\-\\s]','','g') ~* ?`, `.*${query}.*`);
}

exports.search = (request, reply) => {
  let { query, page, limit } = request.query;
  const queries = query.replace(/-/g, '').split(' ');

  limit = parseInt(limit) || 21;
  page = parseInt(page);
  page = isNaN(page) ? 1 : page;
  page = (page <= 0) ? 1 : page;
  const offset = (page - 1) * limit;

  let whereClause = Squel.expr();
  queries.forEach((query) => {
    let fieldsWhere = Squel.expr();
    ['products.product_id', 'products.part_no', 'products.name',
      'products.name_th', 'products.details', 'products.details_th',
      'products.engine_model', 'car_brands.name', 'categories.name',
      'subcategories.name', 'categories.name_th', 'subcategories.name_th' ]
      .forEach((field) => {
        fieldExpr(fieldsWhere, field, query)
      });
    whereClause.and(
      fieldsWhere
    );
  });

  let q = Squel.select()
            .from('products')
            .field('COUNT(1) OVER() AS all_records')
            .field('products.product_id')
            .field('products.name')
            .field('products.name_th')
            .field('products.details')
            .field('products.details_th')
            .field('products.part_no')
            .field('products.engine_model')
            .field('products.primary_image')
            .field('car_brands.name AS car_name')
            .field('categories.name AS category')
            .field('subcategories.name AS subcategory')
            .left_join('car_brands', null, 'products.car_brand_id = car_brands.id')
            .left_join('categories', null, 'products.category_id = categories.id')
            .left_join('subcategories', null, 'products.subcategory_id = subcategories.id')
            .where(whereClause)
            .limit(limit)
            .offset(offset)
            .order('products.product_id')
            .toParam();

  request.pg.client.query(q.text, q.values, (err, result) => {
    if (err) return reply(Boom.badRequest());
    const all_records = result.rows[0]?
      parseInt(result.rows[0].all_records) : 0;

    reply({
      all_records,
      products: result.rows,
      page,
      limit,
      query_params: {
        query
      }
    });
  })
};

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

