import Async    from 'async';
import Boom     from 'boom';
import S        from 'squel';
import Moment   from 'moment';
import Random   from 'randomstring';

const Squel = S.useFlavour('postgres');

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

function orderRefId() {
  let time = Moment().format('ssDDMM');
  let string = Random.generate({
    length: 3, capitalization: 'uppercase'
  });
  return `${string}${time}`;
}
