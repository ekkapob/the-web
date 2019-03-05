const Async      = require('async');
const Boom       = require('boom');
const Sendgrid   = require('../libs/sendgrid');
const ImgSrc     = require('../helpers/imgSrc');
const Fs         = require('fs');
const Handlebars = require('handlebars');
const Request    = require('superagent');

function sendgridData(params) {
  let personalization = {
    to: [ { email: params.to } ],
    bcc: [ { email: 'hello@traautoparts.com' } ],
    subject: params.subject
  };

  if (params.to.toLowerCase() == 'hello@traautoparts.com') {
    delete personalization.bcc;
  }

  return {
    personalizations: [
      personalization
    ],
    from: {
      name: 'TRA Autoparts',
      email: 'hello@traautoparts.com' },
    content: [ {
        type: 'text/html',
        value: params.content
    } ]
  };
}

exports.setEmailHeader = sendgridData;

function fetchProduct(productId) {
  var apiUrl = 'http://localhost:4001/api/v1';
  return (cb) => {
    Request.get(`${apiUrl}/products/${productId}`)
      .end((err, res) => {
        if (err) return cb(true);
        cb(null, res.body.product[0]);
      });
  };
}

exports.orderAccepted = (request, reply) => {
  const { ref_id } = request.payload.order;
  const { customer } = request.payload;
  const { cart } = request.payload;
  const data = {
    ref_id,
    customer,
    order: []
  };
  let fetchProducts = [];
  for (var key in cart) {
    fetchProducts.push(fetchProduct(key));
  }
  Async.parallel(fetchProducts, (err, results) => {
    if (err) return reply(Boom.badRequest());
    injectProductInfo(cart, results);
    const data = {
      ref_id,
      customer,
      products: results
    };

    Sendgrid.mail(sendgridData({
      subject: `We've got your order ${ref_id}`,
      to: customer.email,
      content: orderAcceptedContent(data)
    }), (err, res) => {
      console.log(err);
      if (err) return reply(Boom.badRequest());
      reply({ref_id});
    });

  });

};

function injectProductInfo(cart, products) {
  products.forEach((product) => {
    const {
      product_id,
      primary_image,
      category,
      subcategory } = product;
    product.quantity = cart[product_id];
    product.img_src = ImgSrc(primary_image, product_id, category, subcategory);
  });
}

function orderAcceptedContent(data) {
  const source = Fs.readFileSync(`${__dirname}/../templates/order_accepted.hbs`,
                                 'utf8');
  const template = Handlebars.compile(source);
  const result = template(data);
  return template(data);
}
