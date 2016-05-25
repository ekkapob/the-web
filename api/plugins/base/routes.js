const CarBrands = require('./handlers/car_brands');
const Categories = require('./handlers/categories');
const Subcategories = require('./handlers/subcategories');
const Products = require('./handlers/products');

module.exports = [
  {
    method: 'GET',
    path: '/api/v1/products',
    handler: Products.index
  },
  {
    method: 'GET',
    path: '/api/v1/products/{productId}',
    handler: Products.show
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
    method: 'GET',
    path: '/api/v1/subcategories',
    handler: Subcategories.index
  },
  {
    method: 'GET',
    path: '/api/v1/car_brands',
    handler: CarBrands.index
  }
];
