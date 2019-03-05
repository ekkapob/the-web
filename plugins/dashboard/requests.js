const Request = require('superagent');
var apiUrl = 'http://localhost:4001/api/v1';

exports.signin = (params) => {
  return (cb) => {
    Request.post(`${apiUrl}/signin`)
      .send(params)
      .end((err, res) => {
        if (err) return cb(true);
        cb(null, res.body);
      });
  }
}

exports.signup = (params) => {
  return (cb) => {
    Request.post(`${apiUrl}/signup`)
      .send(params)
      .end((err, res) => {
        if (err) return cb(true, res.body);
        cb(null, res.body);
      });
  }
}
