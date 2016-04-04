const I18n = require('i18n');
const _ = require('lodash');

exports.register = (server, options, next) => {
  I18n.configure(options);

  server.ext('onPreAuth', function(request, reply){
    request.i18n = {};
    I18n.init(request, request.i18n);
    const locale = request.yar.get('locale');
    if (locale) { request.i18n.setLocale(locale.value ); }
    reply.continue();
  });
  
  server.ext( "onPreResponse", function ( request, reply ){
    var response = request.response;
    if (response.variety === 'view') {
      response.source.context = _.assign(
          response.source.context,
          request.i18n,
          { locale: request.i18n.getLocale() }
      );
    }
    reply.continue();
  });
  next();
};

exports.register.attributes = require('./package');
