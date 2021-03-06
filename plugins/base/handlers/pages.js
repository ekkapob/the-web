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
  Async.parallel({
    coolantPumpAssy:
      Requests.randomCoolantPumpAssy({ query: '?subcategoryId=1' })
  },
  (err, results) => {
    return reply.redirect('/');
  });
};

exports.index = (request, reply) => {
  const paymentStatus = request.yar.get('paymentConfirm');
  request.yar.clear('paymentConfirm');
  const query = '?subcategoryId=1&limit=10'
  Async.parallel({
    coolantPumpAssy:
      Requests.randomCoolantPumpAssy({ query })
  },
  (err, results) => {
    reply.view('index', {
      coolantPumpAssyProducts: results.coolantPumpAssy.products,
      paymenConfirm: paymentStatus
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

exports.productSearch = (request, reply) => {
  const query = Querystring.stringify(request.query);
  Async.parallel({
    search: Requests.productSearch({ query: `?${query}` }),
    recommended: Requests.recommended({ productId: 'random' })
  }, (err, result) => {
    if (err) return reply.view('products');
    const { all_records, page, limit, query_params, products } = result.search;
    reply.view('products/search_results', {
      all_records,
      not_found: (all_records == 0),
      products: products,
      query: request.query.query,
      path: '/products/search',
      page,
      pages: Math.ceil(all_records/limit),
      query_params,
      recommended: result.recommended
    });
  });
}

exports.contactUs = (request, reply) => {
  reply.view('contact_us');
};

exports.howToOrder = (request, reply) => {
  reply.view('how_to_order');
};

exports.traHistory = (request, reply) => {
  reply.view('tra_history');
}
