const Async = require('async');
var Requests = require('./requests');
const _ = require('lodash');

exports.register = (server, options, next) => {
  server.route(require('./routes'));

  server.ext( "onPreResponse", function ( request, reply ){
    var response = request.response;
    getSubCategories(response, reply);
  });

  next();
};

function getSubCategories(response, reply) {
  Async.parallel({
    subcategories: Requests.subcategories(),
  },
  (err, results) => {
    const { subcategories } = results.subcategories;
    response.subcategories = subcategories;
    reply.continue();
  });
}

exports.register.attributes = require('./package');
