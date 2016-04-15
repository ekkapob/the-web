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
  q = `SELECT COUNT(1) OVER() AS full_count,
  products.product_id,
  products.name,
  products.details,
  products.part_no,
  products.engine_model,
  car_brands.name AS car_name
  FROM products
  LEFT JOIN car_brands ON products.car_brand_id = car_brands.id
  ORDER BY products.created_at LIMIT 24`;
  // WHERE car_brands.name = 'HINO'
  request.pg.client.query(q,
    (err, result) => {
      console.log(result);
      reply.view('products', {
        products: result.rows
      });
  })
  // reply.view('products', {
  //   products: products
  // });
}
