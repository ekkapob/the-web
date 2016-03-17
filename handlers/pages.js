exports.home = function(request, reply) {
  const products = [{
    name: 'product 1'
  }, {
    name: 'product 2'
  }];
  reply.view('index', {
    products: products
  })
}
