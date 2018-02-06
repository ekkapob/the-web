import Hapi from 'hapi';
import _    from 'lodash';

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
  apiUrl: 'http://localhost:4001/api/v1'
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
      let headerLocale = request.headers['set-locale'];
      // [LANG] Need to set locale manually on development
      if (process.env.ENV == 'development') {
        headerLocale = process.env.LANG;
      }
      return {
        lang: headerLocale,
        th: headerLocale == 'th',
        urlPath: request.url.path,
        production: process.env.ENV == 'production',
        cart: request.yar.get('cart'),
        user: request.yar.get('authenticated'),
        subcategories: request.response.subcategories,
      };
    }
  });

  // const routes = _.concat(
  //   // require('./plugins/base/routes'),
  //   require('./plugins/dashboard/routes')
  // );
  //
  // Server.route(routes);

  Server.start(() => {
    console.log('Started Server at ', Server.info.uri);
  });
});
