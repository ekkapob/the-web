import Boom     from 'boom';
import S        from 'squel';
const Squel = S.useFlavour('postgres');

exports.create = (request, reply) => {
  const {
    name, email,
    phone, address,
    country, city, zip } = request.payload;
  let q = Squel.insert()
            .into('customers')
            .set('name', name)
            .set('email', email)
            .set('phone', phone)
            .set('address', address)
            .set('country', country)
            .set('city', city)
            .set('zip', zip)
            .returning('id')
            .toParam();
  request.pg.client.query(q.text, q.values, (err, result) => {
    if (err) { return reply(Boom.badRequest()); }
    reply({customer_id: result.rows[0].id});
  });
};
