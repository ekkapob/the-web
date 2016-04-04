exports.locale = (request, reply) => {
  request.yar.set('locale', { value: request.params.locale });
  reply.redirect(request.info.referrer);
};

exports.index = (request, reply) => {
  console.log(request.i18n.getLocale());
  console.log(request.i18n.__("Hello"));
  reply.view('index');
};

exports.products = (request, reply) => {
  const key = request.yar.get('locale');
  reply(key);
}
