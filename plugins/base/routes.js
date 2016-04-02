const Pages = require('./handlers/pages');

module.exports = [{
  method: 'GET',
  path: '/',
  handler: Pages.index
}, {
  method: 'GET',
  path: '/{param*}',
  handler: (request, reply) => {
    reply.view('404');
  }
}];
