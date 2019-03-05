const fs         = require('fs');
const Async      = require('async');
const Boom       = require('boom');
const Cart       = require('../utils/cart');
const Validation = require('../utils/validation');
const Requests   = require('../requests');
const Joi        = require('joi');
const _          = require('lodash');
const Uuid       = require('uuid/v1');
const Mailer     = require('../../../api/plugins/mailer/handlers/mailer');
const Sendgrid   = require('../../../api/plugins/mailer/libs/sendgrid');
const Handlebars = require('handlebars');


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
  const user = request.yar.get('authenticated');
  let store = (!user)? request.yar.get('contact'): user;
  reply.view('order/confirm-contact', {
    signedIn: user != undefined,
    store
  });
};

exports.confirm = (request, reply) => {
  let { name, email, address, phone, country, city, zip, remarks } = request.payload;
  let contact = { name, email, phone, address, country, city, zip, remarks };

  // Contact form validation
  const errors = Validation.validate(request.payload, {
    name: Joi.string().required(),
    email: Joi.string().regex(Validation.emailRegex()).required(),
    phone: Joi.string().required(),
    address: Joi.string().required(),
    country: Joi.string().required(),
    city: Joi.string().required(),
    zip: Joi.string().required(),
    remarks: Joi.any().optional()
  });

  if(!_.isEmpty(errors)) {
    return reply.view('order/confirm-contact', {
      errors,
      store: contact
    })
  }

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
      signedIn: request.yar.get('authenticated') != undefined,
      summary: true
    });
  });
};

exports.placeOrder = (request, reply) => {
  let user = request.yar.get('authenticated');
  let contact = (!user) ? request.yar.get('contact') : user;
  const signedInUser = (!user) ? false : true;
  let cart = request.yar.get('cart');
  if (!contact || !cart) return reply.redirect('/orders');

  let requests = [];
  if (!signedInUser) { 
    requests.push(
      Requests.createCustomer(contact),
      Requests.createOrder()
    );
  } else {
    requests.push(Requests.createOrder({user_id: user.user_id}));
  }

  requests.push(
    Requests.createOrderDetail(cart),
    Requests.emailOrderAccepted({
      customer: contact,
      cart,
    })
  );

  Async.waterfall(requests, (err, result) => {
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

exports.notifyPaymentIndex = (request, reply) => {
  reply.view('order/notify-payment');
};

exports.notifyPayment = (request, reply) => {
  const { order_id, name, email, phone, slip_image, remarks } = request.payload;
  saveImage(slip_image, (img) => {
    const data = { order_id, img, name, phone, email, remarks };
    const emailData = Mailer.setEmailHeader({
      subject: `Payment Notification for Order: ${order_id}`,
      to: 'hello@traautoparts.com',
      content: setEmailContent(data)
    });
    Sendgrid.mail(emailData, (err, res) => {
      request.yar.set('paymentConfirm', 'done');
      reply.redirect('/');
    });
  });
};

function setEmailContent(data) {
  const source = fs.readFileSync(
    `${__dirname}/../../../views/mailer/templates/payment_notification.hbs`,
    'utf8'
  );
  const template = Handlebars.compile(source);
  const result = template(data);
  return template(data);
}

function saveImage(image, successFn) {
  if (!image.hapi.filename) return;
  const folderName = `${__dirname}/../../../assets/images/slips`;
  let name = image.hapi.filename;
  const namePaths = name.split('.');
  const extension = (namePaths.length > 1)? namePaths[namePaths.length - 1] : '';
  name = Uuid();
  if (extension.length > 0) {
    name += `.${extension}`;
  }
  let imgPath = `${folderName}/${name}`;
  const file = fs.createWriteStream(imgPath);
  image.pipe(file);
  image.on('end', (err) => {
    if (!err) return successFn(name);
  });
}
