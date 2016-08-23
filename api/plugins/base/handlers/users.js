import Bcrypt   from 'bcrypt';
import Boom     from 'boom';
import S        from 'squel';
import _        from 'lodash';

const Squel = S.useFlavour('postgres');

exports.show = (request, reply) => {
  const { id } = request.params;
  let q = Squel.select()
            .from('users')
            .field('id')
            .field('username')
            .field('name')
            .field('email')
            .field('phone')
            .field('address')
            .field('country')
            .field('city')
            .field('zip')
            .where('id = ?', id)
            .toParam();
  request.pg.client.query(q.text, q.values, (err, result) => {
    if (err) { return reply(Boom.badRequest()); }
    const { id, username, name, email, phone,
      address, country, city, zip } = result.rows[0];
    reply({
      id, username, name, email, phone, address,
      country, city, zip
    });
  });
};

exports.update = (request, reply) => {
  const { id } = request.params;
  const { name, email, password, confirm_password,
    phone, address, country, city, zip } = request.payload;

  var hashPassword;
  if (!_.isEmpty(password) && !_.isEmpty(confirm_password)) {
    // not match
    if (password != confirm_password) {
      return reply({
        errors: [
          "Password and Confirmation password don't match."
        ]
      }).code(400);
    }
    hashPassword = getHashPassword(password);
  }

  let q = Squel.update()
            .table('users');
  if (!_.isEmpty(hashPassword)) {
    q = q.set('hash_password', hashPassword);
  }
  q = q.set('name', name)
        .set('email', email)
        .set('phone', phone)
        .set('address', address)
        .set('country', country)
        .set('city', city)
        .set('zip', zip)
        .where('id = ?', id)
        .toParam();
  request.pg.client.query(q.text, q.values, (err, result) => {
    if (err) { return reply(Boom.badRequest()); }
    reply().code(200);
  });
};

function getHashPassword(password) {
  return Bcrypt.hashSync(password, 10);
}
