const I18n = require('i18n');
const _ = require('lodash');

exports.register = (server, options, next) => {
  I18n.configure(options);

  server.ext('onPreAuth', function(request, reply){
    request.i18n = {};
    I18n.init(request, request.i18n);
    return reply.continue();
  });

  server.ext( "onPreResponse", function ( request, reply ){
    var response = request.response;
    if (response.variety === 'view') {
      const locale = getLocale(request);
      request.i18n.setLocale(locale);
      response.source.context = _.assign(response.source.context,
                                         request.i18n,
                                         { locale: locale });
      response.source.context.languageCode = locale;
    }
    return reply.continue();
  });
  next();
};

function getLocale(request) {
  // [LANG] Set locale manually on development
  if (process.env.ENV == 'development') {
    return process.env.LANG;
  }
  return request.headers['set-locale'];
  // development
  // let defaultLocale = 'en'
  // let hostRegexp = /^(http|https):\/\/(en|th)\./;
  // if (!request.info.referrer) return defaultLocale;
  // let result = request.info.referrer.match(hostRegexp);
  // if (!result) return defaultLocale;
  // return result[2];
}

exports.register.attributes = require('./package');
