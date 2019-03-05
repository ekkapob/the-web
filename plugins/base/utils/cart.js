const _ = require('lodash');

exports.total = (cart) => {
  if (_.isEmpty(cart)) return '0';
  let total = 0;
  for (var key in cart) {
    let order = cart[key];
    if (isNaN(order)) continue;
    total += order;
  }
  return total;
};
