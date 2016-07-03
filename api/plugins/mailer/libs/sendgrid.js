import Request  from 'superagent';

exports.mail = (data, cb) => {
  // return cb(null);
  Request
    .post('https://api.sendgrid.com/v3/mail/send')
    .send(data)
    .set('Authorization', `Bearer ${process.env.SENDGRID_API_KEY}`)
    .set('Content-Type', 'application/json')
    .end(cb);
}
