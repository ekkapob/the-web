const Hapi = require('hapi');
const Path = require('path');
const server = new Hapi.Server();
server.connection({ port: 4000 });
server.bind({
  apiBaseUrl: 'http://localhost:4000/api',
  webBaseUrl: 'http://localhost:4000'
});

server.register([
  require('inert'),
  require('vision'),
  {
    register: require('yar'),
    options: {
      storeBlank: false,
      cookieOptions: {
        password: 'f9!^4nZHr@NqWmby@%PmFp%8%pRgn$qv',
        isSecure: false
      }
    }
  },
  require('./plugins/base')
], (err) => {
  if (err) { throw err; }

  server.views({
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

  server.route({
    method: 'GET',
    path: '/assets/{param*}',
    handler: {
      directory: {
        path: 'assets'
      }
    }
  });

  server.start(() => {
    console.log('Started server at ', server.info.uri);
  });
});
