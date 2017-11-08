import Pages      from './handlers/pages';
import Order      from './handlers/order';
import Cart       from './handlers/cart';

module.exports = [
  {
    method: 'GET',
    path: '/assets/{param*}',
    handler: {
      directory: {
        path: 'assets'
      }
    }
  },
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
  },
  {
    method: 'GET',
    path: '/notify_payment',
    handler: Order.notifyPaymentIndex
  },
  {
    method: 'POST',
    path: '/notify_payment',
    handler: Order.notifyPayment,
    config: {
      payload: {
        maxBytes: (5 * 1024) * 1024,
        output: 'stream',
        parse: true
      }
    }
  },
  // {
  //   method: 'GET',
  //   path: '/signin',
  //   handler: Authen.signin_screen
  // },
  // {
  //   method: 'POST',
  //   path: '/signin',
  //   handler: Authen.signin
  // },
  // {
  //   method: 'GET',
  //   path: '/dashboard',
  //   handler: Dashboard.index
  // }
  // {
  //   method: 'GET',
  //   path: '/myaccount',
  //   handler: (request, reply) => {
  //     if (!request.yar.get('user_id')) return reply.redirect('/login');
  //     reply('hello, ');
  //   }
  // }
];
