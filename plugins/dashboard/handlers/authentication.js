import _        from 'lodash';
import Requests from '../requests';
import Async    from 'async';

exports.signin_screen = (request, reply) => {
  reply.view('member/signin');
};

exports.signin = (request, reply) => {
  const { username, password } = request.payload;
  Async.parallel({
    signin: Requests.signin({ username, password })
  }, (err, results) => {
    if (err) return reply.redirect('/');
    request.yar.set('authenticated', results.signin);
    reply.redirect('/dashboard');
  });
};

exports.signup_screen = (request, reply) => {
  reply.view('member/signup');
};

exports.signup = (request, reply) => {
  const { password, confirm_password } = request.payload;
  const store = _.cloneDeep(request.payload);
  delete store.password;
  delete store.confirm_password;

  Async.parallel({
    signup: Requests.signup(request.payload)
  }, (err, results) => {
    if (err) return reply.view('member/signup', {
      store,
      errors: results.signup.errors
    });
    request.yar.set('authenticated', results.signup);
    reply.redirect('/dashboard');
  });
}
