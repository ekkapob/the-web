const Hapi = require('hapi');
const Server = new Hapi.Server({
  connections: {
    router: {
      stripTrailingSlash: true
    }
  }
});
const Plugins = require('./plugins');

Server.connection({ port: 4001 });

Server.register(Plugins, (err) => {
  if (err) { throw err; }

  Server.start(() => {
    console.log('API Server at ', Server.info.uri);
  });
});
