var Boom = require('boom');

exports.index = (request, reply) => {
  let q = `SELECT COUNT(1) OVER() AS all_records,
      products.id,
      products.product_id,
      products.name,
      products.details,
      products.part_no,
      products.engine_model,
      car_brands.name AS car_name
    FROM products
    LEFT JOIN car_brands ON products.car_brand_id = car_brands.id
    ORDER BY products.created_at
    LIMIT $1
    OFFSET $2`;

  const limit = parseInt(request.query.limit) || 24;
  let page = parseInt(request.query.page);
  page = isNaN(page) ? 1 : page;
  page = (page <= 0) ? 1 : page;

  const offset = (page - 1) * limit;

  request.pg.client.query(q, [limit, offset], (err, result) => {
    if (err) { return reply(Boom.badRequest()); }

    const all_records = result.rows[0]?
      parseInt(result.rows[0].all_records) : 0;
    const data = {
      all_records: all_records,
      page: page,
      limit: limit,
      data: result.rows
    }
    reply(data);
  });
};
