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
  // const key = request.yar.get('locale');
  // reply(key);
  reply.view('products', {
    products: products
  });
}
