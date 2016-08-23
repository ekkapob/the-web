exports.register = (server, options, next) => {
  server.route(require('./routes'));

  server.ext('onPreAuth', function(request, reply){
    let path = request.path;
    const rootPath = path.substr(1).split('/')[0];
    if (rootPath == 'dashboard' && !request.yar.get('authenticated')) {
      return reply.redirect('/');
    }
    return reply.continue();
  });

  next();
};

exports.register.attributes = require('./package');
