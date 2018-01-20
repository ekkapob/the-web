import Authen     from './handlers/authentication';
import Dashboard  from './handlers/dashboard';

module.exports = [
  {
    method: 'GET',
    path: '/signin',
    handler: Authen.signin_screen
  },
  {
    method: 'POST',
    path: '/signin',
    handler: Authen.signin
  },
  {
    method: 'GET',
    path: '/signout',
    handler: Authen.signout
  },
  {
    method: 'GET',
    path: '/signup',
    handler: Authen.signup_screen
  },
  {
    method: 'POST',
    path: '/signup',
    handler: Authen.signup
  },
  {
    method: 'GET',
    path: '/dashboard',
    handler: Dashboard.index
  },
  {
    method: 'GET',
    path: '/dashboard/accounts',
    handler: Dashboard.account
  },
  {
    method: 'POST',
    path: '/dashboard/accounts',
    handler: Dashboard.accountCreate
  },
  {
    method: 'PUT',
    path: '/dashboard/accounts/{id}',
    handler: Dashboard.accountUpdate
  },
  {
    method: 'GET',
    path: '/dashboard/accounts/{id}/edit',
    handler: Dashboard.accountEdit
  },
  {
    method: 'GET',
    path: '/dashboard/products',
    handler: Dashboard.products
  },
  {
    method: 'GET',
    path: '/dashboard/products/search',
    handler: Dashboard.productsSearch
  },
  {
    method: 'PUT',
    path: '/dashboard/products/{productId}/primary_images',
    handler: Dashboard.productPrimaryImageUpdate
  },
  {
    method: 'DELETE',
    path: '/dashboard/products/{productId}',
    handler: Dashboard.productRemove
  },
  {
    method: 'DELETE',
    path: '/dashboard/products/{productId}/images',
    handler: Dashboard.productRemoveImage
  },
  {
    method: 'GET',
    path: '/dashboard/products/{id}',
    handler: Dashboard.productEdit
  },
  {
    method: 'GET',
    path: '/dashboard/products/new',
    handler: Dashboard.productNew
  },
  {
    method: 'PUT',
    path: '/dashboard/products/{productId}',
    handler: Dashboard.productUpdate
  },
  {
    method: 'GET',
    path: '/dashboard/categories',
    handler: Dashboard.categories
  },
  {
    method: 'POST',
    path: '/dashboard/categories',
    handler: Dashboard.categoriesCreate
  },
  {
    method: 'PUT',
    path: '/dashboard/categories/{id}',
    handler: Dashboard.categoriesUpdate
  },
  {
    method: 'POST',
    path: '/dashboard/subcategories',
    handler: Dashboard.subcategoriesCreate
  },
  {
    method: 'PUT',
    path: '/dashboard/subcategories/{id}',
    handler: Dashboard.subcategoriesUpdate
  },
  {
    method: 'GET',
    path: '/dashboard/orders',
    handler: Dashboard.orders
  },
  {
    method: 'GET',
    path: '/dashboard/orders/{id}',
    handler: Dashboard.ordersShow
  },
  {
    method: 'POST',
    path: '/dashboard/products/create',
    handler: Dashboard.productCreate,
    config: {
      payload: {
        // maxBytes: (5 * 1024) * 1024, // 5MB to bytes
        output: 'stream',
        parse: true
      }
    }
  }
  // {
  //   method: 'GET',
  //   path: '/dashboard',
  //   handler: Dashboard.index
  // }
];
