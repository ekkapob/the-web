module.exports = (user, options) => {
  if (!user) return options.inverse(this);
  if (!user.role) return options.inverse(this);
  if (user.role.indexOf('admin') != -1) return options.fn(this);
  options.inverse(this);
}
