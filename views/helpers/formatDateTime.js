const Moment  = require('moment');

module.exports = (dateTime) => {
  return Moment(dateTime).format('DD/MM/YY HH:mm:ss A');
}
