var Boom = require('boom');
var Wreck = require('wreck');

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
  const page = request.query.page;
  const query = (page) ? `?page=${page}` : '';

  Wreck.get(`http://localhost:4001/api/v1/products${query}`, { json: true },
      (err, response, payload) => {
        // TODO: show no products message
        if (err) { return reply.view('products'); }

        const { data, page, limit, all_records } = payload;
        reply.view('products', {
          products: data,
          page: page,
          pages: Math.ceil(all_records/limit),
          path: '/products'
        });
  });
}
