exports.index = (request, reply) => {
  console.log(request.info.referer);
  request.yar.set('example', { key: 'value' });
  reply.view('index');
};

exports.products = (request, reply) => {
  // console.log(request.info.referer);
  // console.log(request.query.next);
  const key = request.yar.get('example');
  reply(key);
}
