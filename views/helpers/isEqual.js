module.exports = (input, target, options) => {
  if (String(input) == String(target)) return options.fn(this);
  return options.inverse(this);
};
