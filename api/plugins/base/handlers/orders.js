import Async    from 'async';
import Boom     from 'boom';
import S        from 'squel';
import Moment   from 'moment';
import Random   from 'randomstring';

const Squel = S.useFlavour('postgres');

exports.index = (request, reply) => {
  let q = ['SELECT id, customer_id, user_id, created_at, ref_id, quantity',
    'FROM orders LEFT JOIN',
    '(SELECT order_id, SUM(quantity) AS quantity FROM order_details GROUP BY order_id)', 
    'AS order_quantities ON orders.id = order_quantities.order_id',
    'ORDER BY orders.created_at DESC;'].join(' ');
  request.pg.client.query(q, (err, result) => {
    if (err) { return reply(Boom.badRequest()); }
    reply({
      orders: result.rows
    });
  });
};

exports.create = (request, reply) => {
  const { customer_id } = request.payload
  const ref_id = orderRefId();
  let q = Squel.insert()
            .into('orders')
            .set('customer_id', customer_id)
            .set('ref_id', ref_id)
            .returning('id')
            .toParam();
  request.pg.client.query(q.text, q.values, (err, result) => {
    if (err) return reply(Boom.badRequest());
    reply({
      order_id: result.rows[0].id,
      ref_id
    });
  });
};

function createOrderDetail(request, reply, productId, quantity, orderId) {
  return (cb) => {
    let q = Squel.insert()
            .into('order_details')
            .set('product_id', productId)
            .set('quantity', quantity)
            .set('order_id', orderId)
            .toParam();
    request.pg.client.query(q.text, q.values, (err, result) => {
      if (err) return cb(true);
      cb(null);
    });
  };
}

function getOrderDetail(request, orderId, by) {
  return (cb) => {
    let q = Squel.select()
              .from('order_details')
              .field('*')
              .field('p.name', 'product_name')
              .field('st.name', 'subcategory_name')
              .field('o.created_at', 'ordered_at')
              .join('orders', 'o',
                Squel.expr()
                  .and("order_details.order_id = o.id")
              )
              .join('products', 'p',
                Squel.expr()
                  .and("order_details.product_id = p.product_id")
              );

    if (by == 'customer') {
      q = q.field('c.name', 'customer_name')
            .join('customers', 'c',
              Squel.expr()
                .and("c.id = o.customer_id")
            );
    } else {
      q = q.field('u.name', 'customer_name')
            .join('users', 'u',
              Squel.expr()
                .and("u.id = o.user_id")
           );
    }
    q = q.join('subcategories', 'st',
            Squel.expr()
              .and("p.subcategory_id = st.id")
          ).where('order_details.order_id = ?', orderId)
          .toParam();

    request.pg.client.query(q.text, q.values, (err, result) => {
      if (err) return cb(true);
      cb(null, result.rows);
    });
  };
}

exports.createOrderDetails = (request, reply) => {
  const { order, items } = request.payload;
  const { order_id, ref_id } = order;

  let operations = [];
  for (var productId in items) {
    operations.push(createOrderDetail(request, reply,
                                      productId, items[productId], order_id));
  }

  Async.waterfall(operations, (err, result) => {
    if (err) return reply(Boom.badRequest());
    reply({ ref_id });
  });
};

exports.show = (request, reply) => {
  const { id } = request.params;
  const { by } = request.query;
  Async.waterfall([
    getOrderDetail(request, id, by)
  ], (err, results) => {
    if (err) return reply(Boom.badRequest());
    deleteSensitiveData(results);
    reply(results);
  });
};

function deleteSensitiveData(results) {
  results.forEach((result) => {
    delete result['username'];
    delete result['hash_password'];
    delete result['role'];
  });
}

function orderRefId() {
  let time = Moment().format('ssDDMM');
  let string = Random.generate({
    length: 3, capitalization: 'uppercase'
  });
  return `${string}${time}`;
}
