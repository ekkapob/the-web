const Mailer = require('./handlers/mailer');

module.exports = [
  {
    method: 'POST',
    path: '/api/v1/mail/order_accepted',
    handler: Mailer.orderAccepted
  }
];
