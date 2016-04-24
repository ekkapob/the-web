var Async = require('async');
var Boom = require('boom');
var Wreck = require('wreck');
var Requests = require('../requests');
var Querystring = require('querystring');

exports.locale = (request, reply) => {
  request.yar.set('locale', { value: request.params.locale });
  reply.redirect(request.info.referrer);
};

exports.index = (request, reply) => {
  // console.log(request.i18n.getLocale());
  // console.log(request.i18n.__("Hello"));
  reply.view('index');
};

var products = [
  {
    id: 'WPA-003',
    car: 'HINO',
    img: '/water_pump_assy/WPA-001.jpg',
    name: 'KL (Long Shaft)',
    details: 'MEGA, Super Turbo, EURO2',
    partNo: '5-123-456-123',
    engineModel: 'EH700'
  },
  {
    id: 'WPA-003',
    car: 'HINO',
    img: '/water_pump_assy/WPA-001.jpg',
    name: 'KL (Long Shaft)',
    partNo: '5-123-456-123',
  }
];

exports.products = (request, reply) => {
  const { page, carBrands, categories } = request.query;
  const query = Querystring.stringify(request.query);

  Async.parallel({
    products: Requests.products({query: `?${query}`}),
    categories: Requests.categories(),
    carBrands: Requests.carBrands()
  },
  (err, results) => {
    if (err) return reply.view('products');
    const {
      products, page, limit,
      all_records, query_params
    } = results.products;
    const { categories } = results.categories;
    const { car_brands } = results.carBrands;
    reply.view('products/index', {
      products,
      page,
      pages: Math.ceil(all_records/limit),
      records: all_records,
      path: '/products',
      categories,
      carBrands: car_brands,
      query_params
    });
  });
};

exports.product = (request, reply) => {
  const { productId } = request.params;
  Wreck.get(`http://localhost:4001/api/v1/products/${productId}`, { json: true },
    (err, response, payload) => {
      if (err) return reply.view('products');
      reply.view('products/show', {
        product: payload.product 
      });
  });
};
