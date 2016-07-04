import Async    from 'async';
import Boom     from 'boom'; 
import Cart     from '../utils/cart';
import Requests from '../requests';
import _        from 'lodash';

exports.index = (request, reply) => {
  let cart = request.yar.get('cart');
  let orders = [];
  if (_.isEmpty(cart)) return reply.view('order/confirm-order', {
    total: 0, orders });
  let requests = [];
  for (var key in cart) {
    requests.push(Requests.product({ productId: key }));
  }

  Async.parallel(requests, (err, results) => {
    // TODO: redirect to 404 or any proper page
    if (err) return reply.view('products');
    results.forEach((product) => {
      product.order = cart[product.product_id]
    });

    reply.view('order/confirm-order', {
      total: Cart.total(cart),
      orders: results
    });
  });
};

exports.order = (request, reply) => {
  let amount = request.payload.amount;
  if (!amount) return reply(amountMissing());
  if (isNaN(amount)) return reply(amountMissing());
  amount = parseInt(amount);

  let productId = request.params.productId;
  let cart = request.yar.get('cart');
  if (amount <= 0) {
    delete cart[productId];
  } else {
    cart = _.assign(cart, { [productId]: amount });
  }
  request.yar.set('cart', cart);
  reply('success');
};

var amountMissing = () => {
  return Boom.badRequest('Order amount is missing.');
}

exports.contact = (request, reply) => {
  reply.view('order/confirm-contact', {
    store: request.yar.get('contact')
  });
};

exports.confirm = (request, reply) => {
  let { name, email, address, phone, country, city, zip, remarks } = request.payload;
  let contact = { name, email, phone, address, country, city, zip, remarks };
  request.yar.set('contact', contact);
  let cart = request.yar.get('cart');
  let orders = [];
  if (_.isEmpty(cart)) return reply.view('order/confirm-order', {
    total: 0, orders });
  let requests = [];
  for (var key in cart) {
    requests.push(Requests.product({ productId: key }));
  }

  Async.parallel(requests, (err, results) => {
    // TODO: redirect to 404 or any proper page
    if (err) return reply.view('products');
    results.forEach((product) => {
      product.order = cart[product.product_id]
    });

    reply.view('order/summary', {
      total: Cart.total(cart),
      orders: results,
      contact,
      summary: true
    });
  });
};

exports.placeOrder = (request, reply) => {
  let contact = request.yar.get('contact');
  let cart = request.yar.get('cart');
  if (!contact || !cart) return reply.redirect('/orders');
  Async.waterfall([
    Requests.createCustomer(contact),
    Requests.createOrder(),
    Requests.createOrderDetail(cart),
    Requests.emailOrderAccepted({
      customer: contact,
      cart,
    })
  ], (err, result) => {
    if (err) return reply(Boom.badRequest());
    reply.view('order/success', {
      refId: result.ref_id,
      email: contact.email,
    });
    request.yar.clear('cart');
    // request.yar.reset();
  });
};

exports.delete = (request, reply) => {
  var cart = request.yar.get('cart');
  var productId = request.params.productId;
  if (_.isEmpty(cart)) return reply(Boom.badRequest('Cart is empty.'));
  if (!_.has(cart, productId)) return reply(Boom.badRequest('No product in cart'));
  delete cart[productId];
  request.yar.set('cart', cart);
  reply('success');
};
