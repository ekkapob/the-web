// console.log(process.env.ENV);
//
// var http = require('http');
// http.createServer(function (req, res) {
//   res.writeHead(200, {'Content-Type': 'text/plain'});
//   res.end('Hello World\n');
// }).listen(4000, 'localhost');
// console.log('Server running at http://localhost:4000/');
var Hapi = require('hapi')  
var CookieAuth = require('hapi-auth-cookie')

// create new server instance
var server = new Hapi.Server()

// register plugins to server instance
server.register(CookieAuth, function (err) {

  server.auth.strategy('session', 'cookie', {
    password: '12345678901234567890123456789012'
  })

  // start your server after plugin registration
  server.start(function (err) {
    console.log('info', 'Server running at: ' + server.info.uri)
  })

  server.route({  
    method: 'GET',
    path: '/private-route',
    config: {
      auth: 'session',
      handler: function (request, reply) {
        reply('Yeah! This message is only available for authenticated users!')
      }
    }
  })
})
