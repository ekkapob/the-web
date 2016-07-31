import Pages  from './handlers/pages';
import Order  from './handlers/order';
import Cart   from './handlers/cart';

module.exports = [
  {
    method: 'GET',
    path: '/locale/{locale}',
    handler: Pages.locale
  },
  {
    method: 'GET',
    path: '/cart',
    handler: Cart.info
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
    path: '/tra_history',
    handler: Pages.traHistory
  },
  {
    method: 'GET',
    path: '/how_to_order',
    handler: Pages.howToOrder
  },
  {
    method: 'GET',
    path: '/contact_us',
    handler: Pages.contactUs
  },
  {
    method: 'GET',
    path: '/products/{productId}',
    handler: Pages.product
  },
  {
    method: 'GET',
    path: '/products/search',
    handler: Pages.productSearch
  },
  {
    method: 'DELETE',
    path: '/orders/{productId}',
    handler: Order.delete
  },
  {
    method: 'GET',
    path: '/orders',
    handler: Order.index
  },
  {
    method: 'POST',
    path: '/orders/{productId}',
    handler: Order.order
  },
  {
    method: 'GET',
    path: '/orders/contact',
    handler: Order.contact
  },
  {
    method: 'POST',
    path: '/orders/confirm',
    handler: Order.confirm,
  },
  {
    method: 'POST',
    path: '/orders/place_order',
    handler: Order.placeOrder
  },
  {
    method: 'GET',
    path: '/{param*}',
    handler: Pages.handle404
  }
];
