const CarBrands = require('./handlers/car_brands');
const Categories = require('./handlers/categories');
const Subcategories = require('./handlers/subcategories');
const Products = require('./handlers/products');
const Customers = require('./handlers/customers');
const Orders = require('./handlers/orders');
const Users = require('./handlers/users');

module.exports = [
  {
    method: 'GET',
    path: '/api/v1/products',
    handler: Products.index
  },
  {
    method: 'POST',
    path: '/api/v1/products',
    handler: Products.create
  },
  {
    method: 'PUT',
    path: '/api/v1/products/{productId}',
    handler: Products.update
  },
  {
    method: 'GET',
    path: '/api/v1/products/{productId}',
    handler: Products.show
  },
  {
    method: 'PUT',
    path: '/api/v1/products/{productId}/primary_image',
    handler: Products.updatePrimaryImage
  },
  {
    method: 'DELETE',
    path: '/api/v1/products/{productId}/images',
    handler: Products.removeImage
  },
  {
    method: 'DELETE',
    path: '/api/v1/products/{productId}',
    handler: Products.delete
  },
  {
    method: 'GET',
    path: '/api/v1/products/search',
    handler: Products.search
  },
  {
    method: 'GET',
    path: '/api/v1/recommended_products/{productId}',
    handler: Products.recommended
  },
  {
    method: 'GET',
    path: '/api/v1/products/random',
    handler: Products.random
  },
  {
    method: 'GET',
    path: '/api/v1/categories',
    handler: Categories.index
  },
  {
    method: 'POST',
    path: '/api/v1/categories',
    handler: Categories.create
  },
  {
    method: 'PUT',
    path: '/api/v1/categories/{id}',
    handler: Categories.update
  },
  {
    method: 'GET',
    path: '/api/v1/subcategories',
    handler: Subcategories.index
  },
  {
    method: 'POST',
    path: '/api/v1/subcategories',
    handler: Subcategories.create
  },
  {
    method: 'GET',
    path: '/api/v1/car_brands',
    handler: CarBrands.index
  },
  {
    method: 'POST',
    path: '/api/v1/customers',
    handler: Customers.create
  },
  {
    method: 'POST',
    path: '/api/v1/orders',
    handler: Orders.create
  },
  {
    method: 'POST',
    path: '/api/v1/order_details',
    handler: Orders.createOrderDetails
  },
  {
    method: 'GET',
    path: '/api/v1/orders',
    handler: Orders.index
  },
  {
    method: 'GET',
    path: '/api/v1/orders/{id}',
    handler: Orders.show
  },
  {
    method: 'GET',
    path: '/api/v1/users/{id}',
    handler: Users.show
  },
  {
    method: 'PUT',
    path: '/api/v1/users/{id}',
    handler: Users.update
  }
];
