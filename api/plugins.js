var db  = process.env.DB;
module.exports = [
  {
    register: require('hapi-node-postgres'),
    options: {
      connectionString: `postgres://webadmin:Ekka1994@localhost/${db}`,
      native: true
    }
  },
  require('./plugins/base'),
  require('./plugins/mailer'),
  require('./plugins/authentication')
];
