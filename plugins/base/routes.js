const Pages = require('./handlers/pages');

module.exports = [
  {
    method: 'GET',
    path: '/locale/{locale}',
    handler: Pages.locale
  },
  {
    method: 'GET',
    path: '/',
    handler: Pages.index
  },
  {
    method: 'GET',
    path: '/products',
    handler: Pages.products
  },
  {
    method: 'GET',
    path: '/products/{productId}',
    handler: Pages.product
  },
  {
    method: 'GET',
    path: '/{param*}',
    handler: (request, reply) => {
      reply.view('404');
  }
}];
