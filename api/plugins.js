module.exports = [
  {
    register: require('hapi-node-postgres'),
    options: {
      connectionString: 'postgres://webadmin:Ekka1994@localhost/web_dev',
      native: true
    }
  },
  require('./plugins/base')
];
