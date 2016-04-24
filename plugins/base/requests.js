var Wreck = require('wreck');
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

exports.carBrands = (params) => {
  return (cb) => {
    Wreck.get(`${apiUrl}/car_brands`, { json: true },
      (err, response, payload) => {
        if (err) { return cb(new Error()); }
        cb(null, payload);
    });
  }
};
