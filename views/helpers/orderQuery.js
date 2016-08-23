module.exports = (customerId) => {
  return (!customerId) ? '' : '?by=customer';
};
