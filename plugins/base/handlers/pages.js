var Async = require('async');
var Boom = require('boom');
var Requests = require('../requests');
var Querystring = require('querystring');
var _ = require('lodash');

exports.locale = (request, reply) => {
  // request.yar.set('locale', { value: request.params.locale });
  // console.log(request.info.referrer);
  reply.redirect(request.info.referrer);
};

exports.handle404 = (request, reply) => {
  const query = '?subcategoryId=1&limit=3'
  Async.parallel({
    coolantPumpAssy:
      Requests.randomCoolantPumpAssy({ query: '?subcategoryId=1' })
  },
  (err, results) => {
    reply.view('404', {
      coolantPumpAssyProducts: results.coolantPumpAssy.products
    });
  });
};

exports.index = (request, reply) => {
  // console.log(request.i18n.getLocale());
  // console.log(request.i18n.__("Hello"));
  const query = '?subcategoryId=1&limit=3'
  Async.parallel({
    coolantPumpAssy:
      Requests.randomCoolantPumpAssy({ query: '?subcategoryId=1' })
  },
  (err, results) => {
    reply.view('index', {
      coolantPumpAssyProducts: results.coolantPumpAssy.products
    });
  });
};

exports.products = (request, reply) => {
  const { page, carBrands, categories } = request.query;
  const query = Querystring.stringify(request.query);

  Async.parallel({
    products: Requests.products({query: `?${query}`}),
    categories: Requests.categories(),
    subcategories: Requests.subcategories(),
    carBrands: Requests.carBrands()
  },
  (err, results) => {
    // TODO: redirect to 404 or any proper page
    if (err) return reply.view('products');
    const {
      products, page, limit,
      all_records, query_params
    } = results.products;
    const { categories } = results.categories;
    const { subcategories } = results.subcategories;
    const { car_brands } = results.carBrands;

    reply.view('products/index', {
      products,
      page,
      pages: Math.ceil(all_records/limit),
      records: all_records,
      path: '/products',
      categories,
      subcategories,
      carBrands: car_brands,
      query_params
    });
  });
};

exports.product = (request, reply) => {
  Async.parallel({
    product: Requests.product(request.params),
    recommended: Requests.recommended(request.params)
  }, (err, result) => {
    if (err) return reply.view('products');
    if (_.isEmpty(result.product)) return reply.redirect('/product_not_found');

    let inCart = 0;
    if (_.has(request.yar.get('cart'), result.product.product_id)){
      inCart = request.yar.get('cart')[result.product.product_id];
    }
    reply.view('products/show', {
      product: result.product,
      inCart,
      recommended: result.recommended
    });
  });
};

exports.contactUs = (request, reply) => {
  reply.view('contact_us');
};

exports.howToOrder = (request, reply) => {
  reply.view('how_to_order');
};

exports.traHistory = (request, reply) => {
  reply.view('tra_history');
}
