import Boom     from 'boom';
import Sendgrid from '../libs/sendgrid'
import Fs       from 'fs';

function sendgridData(params) {
  return {
    personalizations: [
      {
        to: [ { email: 'ekkapob@gmail.com' } ],
        bcc: [ { email: 'hello@traautoparts.com' } ],
        subject: params.subject
      }
    ],
    from: { email: 'hello@traautoparts.com' },
    content: [ {
        type: 'text/html',
        value: params.content
    } ]
  };
}

exports.orderAccepted = (request, reply) => {
  const { ref_id } = request.payload.order;
  const { email } = request.payload.customer;
  const { cart } = request.payload;
  Sendgrid.mail(sendgridData({
    subject: `Order ...got accepted`,
    content: orderAcceptedContent()
  }), (err, res) => {
    if (err) return reply(Boom.badRequest());
    reply({ref_id});
  });
};

function orderAcceptedContent() {
  return Fs.readFileSync(`${__dirname}/../templates/order_accepted.hbs`, 'utf8');
}
