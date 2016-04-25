import _      from 'lodash';
import Wreck  from 'wreck';
var apiUrl = 'http://localhost:4001/api/v1';

exports.products = (params) => {
  return (cb) => {
    Wreck.get(`${apiUrl}/products${params.query}`, { json: true },
      (err, response, payload) => {
        if (err) { return cb(new Error()); }
        cb(null, payload);
    });
  }
};

exports.categories = (params) => {
  return (cb) => {
    Wreck.get(`${apiUrl}/categories`, { json: true },
      (err, response, payload) => {
        if (err) { return cb(new Error()); }
        cb(null, payload);
    });
  }
};


exports.subcategories = (params) => {
  return (cb) => {
    Wreck.get(`${apiUrl}/subcategories`, { json: true },
      (err, response, payload) => {
        if (err) { return cb(new Error()); }
        cb(null, payload);
      });
  }
};

exports.carBrands = (params) => {
  return (cb) => {
    Wreck.get(`${apiUrl}/car_brands`, { json: true },
      (err, response, payload) => {
        if (err) { return cb(new Error()); }
        cb(null, payload);
      });
  };
};

exports.product = (params) => {
  const { productId } = params;
  return (cb) => {
    Wreck.get(`${apiUrl}/products/${productId}`, { json: true },
      (err, response, payload) => {
        if (err) return cb(new Error());
        const product = _.isEmpty(payload.product) ? '' : payload.product[0];
        cb(null, product);
      });
  };
};

exports.recommended = (params) => {
  const { productId } = params;
  return (cb) => {
    Wreck.get(`${apiUrl}/recommended_products/${productId}`,
    { json: true  },
    (err, response, payload) => {
      if (err) return cb(true);
      cb(null, payload.recommended);
    });
  };
};
