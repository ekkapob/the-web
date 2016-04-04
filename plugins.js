module.exports = [
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
  {
    register: require('./plugins/i18n'),
    options: {
      locales: ['en', 'th'],
      defaultLocale: 'en',
      directory: __dirname + '/locales'
    }
  },
  require('./plugins/base')
];
