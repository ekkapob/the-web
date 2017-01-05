exports.register = (server, options, next) => {
  server.route(require('./routes'));

  server.ext('onPreAuth', function(request, reply){
    let path = request.path;
    const paths = path.substr(1).split('/');
    const rootPath = paths[0];
    const pagePath = paths[1]

    const signedInUser = request.yar.get('authenticated');
    if (rootPath == 'dashboard') {
      if (!signedInUser) return reply.redirect('/');
      if (!pagePath) return reply.continue();
      if (!isAdmin(signedInUser) && pagePath != 'accounts') {
        return reply.redirect('/dashboard/accounts');
      }
    }
    return reply.continue();
  });

  next();
};

function isAdmin(user) {
  if (!user || !user.role) return false;
  if (user.role.indexOf('admin') == -1) return false;
  return true;
}

exports.register.attributes = require('./package');
