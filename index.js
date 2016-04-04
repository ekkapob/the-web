const Hapi = require('hapi');
const Server = new Hapi.Server();
const Plugins = require('./plugins');

Server.connection({ port: 4000 });
Server.bind({
  apiBaseUrl: 'http://localhost:4000/api',
  webBaseUrl: 'http://localhost:4000'
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
    isCached: false
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
