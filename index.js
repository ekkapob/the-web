const Hapi = require('hapi');
const Server = new Hapi.Server({
  connections: {
    router: {
      stripTrailingSlash: true
    }
  }
});
const Plugins = require('./plugins');

Server.connection({ port: 4000 });
Server.bind({
  apiUrl: 'http://localhost:4001/api/v1',
});

Server.register(Plugins, (err) => {
  if (err) { throw err; }

  Server.views({
    engines: {
      hbs: require('handlebars')
    },
    relativeTo: __dirname,
    path: './views',
    layout: true,
    layoutPath: './views/layout',
    partialsPath: './views/partials',
    helpersPath: './views/helpers',
    isCached: false,
    context: function(request){
      return {
        cart: request.yar.get('cart')
      };
    }
  });

  Server.route({
    method: 'GET',
    path: '/assets/{param*}',
    handler: {
      directory: {
        path: 'assets'
      }
    }
  });

  Server.start(() => {
    console.log('Started Server at ', Server.info.uri);
  });
});
