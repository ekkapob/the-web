const _ = require('lodash');
const Wreck = require('wreck');
const Request = require('superagent');
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

exports.productSearch = (params) => {
  const { query } = params;
  return (cb) => {
    Request.get(`${apiUrl}/products/search${query}`)
      .end((err, res) => {
        if (err) return cb(true);
        cb(null, res.body);
      });
  }
}

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

exports.randomCoolantPumpAssy = (params) => {
  return (cb) => {
    Wreck.get(`${apiUrl}/products/random${params.query}`, { json: true },
      (err, response, payload) => {
        if (err) return cb(true);
        cb(null, payload);
      })
  }
};

exports.createCustomer = (params) => {
  return (cb) => {
    Request.post(`${apiUrl}/customers`)
      .send(params)
      .end((err, res) => {
        if (err) return cb(true);
        cb(null, res.body);
      });
  }
}

// Chained function after create customer
exports.createOrder = (user) => {
  if (!user) {
    return (customer, cb) => {
      Request.post(`${apiUrl}/orders`)
        .send(customer)
        .end((err, res) => {
          if (err) return cb(true);
          cb(null, res.body);
        });
    }
  }

  return (cb) => {
    Request.post(`${apiUrl}/orders`)
      .send(user)
      .end((err, res) => {
        if (err) return cb(true);
        cb(null, res.body);
      });
  }
}

// Chained function after create order
exports.createOrderDetail = (params) => {
  return (order, cb) => {
    Request.post(`${apiUrl}/order_details`)
      .send({
        order,
        items: params
      })
      .end((err, res) => {
        if (err) return cb(true);
        cb(null, res.body);
      });
  }
}

exports.emailOrderAccepted = (params) => {
  let { customer, cart } = params;
  return (order, cb) => {
    Request.post(`${apiUrl}/mail/order_accepted`)
      .send({ order, customer, cart })
      .end((err, res) => {
        if (err) return cb(true);
        cb(null, res.body);
      });
  }
}

// exports.signin = (params) => {
//   return (cb) => {
//     Request.post(`${apiUrl}/signin`)
//       .send(params)
//       .end((err, res) => {
//         console.log(res);
//         if (err) return cb(true);
  //       cb(null, res.body);
  //     });
//   // }
// }
