import Async        from 'async';
import Boom         from 'boom';
import Request      from 'superagent';
import Requests     from '../../base/requests';
import Querystring  from 'querystring';
import fs           from 'fs';
import Mv           from 'mv';
import _            from 'lodash';

const apiUrl = 'http://localhost:4001/api/v1';
const PRODUCTS_PER_PAGE = 100;

exports.index = (request, reply) => {
  reply.redirect(`/dashboard/accounts`);
  // reply.view('dashboard/index', null, {
  //   layout: 'dashboard'
  // });
};

exports.account = (request, reply) => {
  const signedInAccount = request.yar.get('authenticated');
  const { user_id } = signedInAccount;
  Async.parallel({
    user: getUserInfo(user_id)
  }, (err, results) => {
    const { username, name, email, phone, address,
      country, city, zip, role } = results.user;
    request.yar.set('authenticated', {
      success: true,
      user_id, username, name, email, phone, address,
      country, city, zip, role
    });
    reply.view('dashboard/account', {
      account: results.user
    }, {
      layout: 'dashboard'
    });
  });
};

exports.accountUpdate = accountUpdate;

function accountUpdate(request, reply) {
  const { id } = request.payload;
  Async.parallel([
    updateAccount(id, request.payload)
  ], (err, results) => {
    if (err) {
      return reply.view('dashboard/account_edit', {
          account: request.payload,
          errors: results[0].errors
        }, {
          layout: 'dashboard'
        });
    }
    reply.redirect(`/dashboard/accounts`);
  });
}

exports.accountCreate = (request, reply) => {
  const { _method } = request.payload;
  if (_method == 'PUT') return accountUpdate(request, reply);
};

exports.accountEdit = (request, reply) => {
  const signedInAccount = request.yar.get('authenticated');
  const { user_id } = signedInAccount;
  Async.parallel({
    user: getUserInfo(user_id)
  }, (err, results) => {
    reply.view('dashboard/account_edit', {
      account: results.user
    }, {
      layout: 'dashboard'
    });
  });
};

exports.products = (request, reply) => {
  request.query = _.assign(request.query, { limit: PRODUCTS_PER_PAGE });
  const query = Querystring.stringify(request.query);
  Async.parallel({
    products: getProducts(query)
  },
  (err, results) => {
    const { products, page, limit,
      all_records, query_params  } = results.products;
    reply.view('dashboard/products/index', {
      all_records,
      products,
      page,
      path: '/dashboard/products',
      pages: Math.ceil(all_records/limit),
      query_params
    }, {
      layout: 'dashboard'
    });
  });
}

exports.productsSearch = (request, reply) => {
  request.query = _.assign(request.query, { limit: PRODUCTS_PER_PAGE });
  const query = Querystring.stringify(request.query);
  Async.parallel({
    search: Requests.productSearch({ query: `?${query}` }),
  }, (err, results) => {
    const { all_records, page, limit, query_params, products } = results.search;
    reply.view('dashboard/products/index', {
      all_records,
      not_found: (all_records == 0),
      products,
      page,
      path: '/dashboard/products',
      pages: Math.ceil(all_records/limit),
      query_params
    }, {
      layout: 'dashboard'
    });
  });
}

exports.productRemove = (request, reply) => {
  const { productId } = request.params;
  Async.parallel([
    deleteProduct('/products/' + productId)
  ], (err, results) => {
    reply({
      product_id: productId
    });
  });
};

exports.productRemoveImage = (request, reply) => {
  const { image_name } = request.payload;
  const { productId } = request.params;
  Async.parallel([
    deleteProductImage(
      '/products/' + productId + '/images',
      { image_name }
    )
  ], (err, results) => {
    if (err) return reply(Boom.badRequest());
    const { deleted_image_name, subcategory } = results[0];

    removeImage(productId, subcategory, deleted_image_name, () => {
      reply({
        deleted_image_name: results[0].deleted_image_name
      });
    });
  });
};

exports.productPrimaryImageUpdate = (request, reply) => {
  Async.parallel([
    updateProductPrimaryImage(
      '/products/' + request.params.productId + '/primary_image',
      { image_name: request.payload.image_name }
    )
  ], (err, results) => {
    if (err) return reply(Boom.badRequest());
    reply().code(200);
  });
}

exports.productEdit = (request, reply) => {
  Async.parallel([
    getData('/categories'),
    getData('/subcategories'),
    getData('/car_brands'),
    findProduct(request.params.id)
  ], (err, results) => {
    reply.view('dashboard/products/form', {
      categories: results[0].categories,
      subcategories: results[1].subcategories,
      car_brands: results[2].car_brands,
      product: results[3].product[0]
    }, {
      layout: 'dashboard'
    });
  })
};

exports.productNew = (request, reply) => {
  Async.parallel([
    getData('/categories'),
    getData('/subcategories'),
    getData('/car_brands')
  ], (err, results) => {
    const categories = results[0].categories;
    const subcategories = results[1].subcategories;
    const car_brands = results[2].car_brands;
    // Missing product ID and name
    reply.view('dashboard/products/form', {
      categories,
      subcategories,
      product: {},
      car_brands,
      create: true
    }, {
      layout: 'dashboard'
    });
  });
};

exports.productUpdate = productUpdate;

function productUpdate(request, reply) {
  const { product_id, images } = request.payload;
  let subcategoryData = getSubcategoryData(request.payload.subcategory);
  let subcategoryText = subcategoryData.text
  let subcategory = subcategoryData.id;
  request.payload.subcategory = subcategory;

  saveImages(product_id, subcategoryText, images, (uploadedImages) => {
    let images = getImageNames(uploadedImages);
    request.payload = _.assign(request.payload, { images });
    Async.parallel([
      findProduct(product_id),
      updateProduct(`/products/${product_id}`, request.payload)
    ], (err, results) => {
      if (err) return reply.redirect(`/dashboard/products/${product_id}`);
      if (results[0].product[0].subcategory != subcategoryText) {
        moveImageFolder(
          results[0].product[0].subcategory, subcategoryText,
          product_id, () => {
            return reply.redirect(`/dashboard/products/${product_id}`);
          });
        return;
      }
      reply.redirect(`/dashboard/products/${product_id}`);
    });
  });
}

function moveImageFolder(oldSubcategory, newSubcategory, productId, callbackFn) {
  let sourceFolder = oldSubcategory.replace(/\s/g,'_').toLowerCase();
  sourceFolder = `${__dirname}/../../../assets/images/products/${sourceFolder}/${productId}`;
  let destFolder = newSubcategory.replace(/\s/g,'_').toLowerCase();
  destFolder = `${__dirname}/../../../assets/images/products/${destFolder}/${productId}`;
  Mv(sourceFolder, destFolder, { mkdirp: true }, callbackFn);
}

exports.productCreate = (request, reply) => {
  const {
    _method,
    product_id, name, name_th,
    part_no, substitute_part_no,
    category, carBrand,
    engine_model, details, details_th, images, remark, remark_th
  } = request.payload;

  if (_method == 'PUT') return productUpdate(request, reply);

  let subcategoryData = getSubcategoryData(request.payload.subcategory);
  let subcategoryText = subcategoryData.text
  let subcategory = subcategoryData.id;
  request.payload.subcategory = subcategory;

  let errors = {};
  if (!product_id) errors.product_id = 'Product ID is required.';
  if (!name) errors.name = 'Product name is required.';

  Async.parallel([
    getData('/categories'),
    getData('/subcategories'),
    getData('/car_brands')
  ], (err, results) => {
    const categories = results[0].categories;
    const subcategories = results[1].subcategories;
    const car_brands = results[2].car_brands;
    // Missing product ID and name
    if (!_.isEmpty(errors)) {
      reply.view('dashboard/products/form', {
        errors,
        anyErrors: true,
        product: request.payload,
        categories,
        subcategories,
        car_brands
      }, {
        layout: 'dashboard'
      });
      return;
    }

    // Check for duplicate product ID
    Async.parallel([
      findProduct(product_id)
    ], (err, results) => {
      if (!_.isEmpty(results[0].product)) {
        reply.view('dashboard/products/form', {
          errors: { product_id: 'Product ID must be unique.' },
          anyErrors: true,
          product: request.payload,
          categories,
          subcategories,
          car_brands
        }, {
          layout: 'dashboard'
        });
        return;
      }

      saveImages(product_id, subcategoryText, images, (uploadedImages) => {
        let images = getImageNames(uploadedImages);
        Async.parallel([
          createProduct({
            product_id,
            name,
            name_th,
            part_no,
            substitute_part_no,
            category,
            subcategory,
            carBrand,
            engine_model,
            images,
            details,
            details_th,
            remark,
            remark_th
          })
        ], (err, results) => {
          if (err) {
            reply.view('dashboard/products/form', {
              errors: { product_id: "Couldn't create this product." },
              anyErrors: true,
              product: request.payload,
              categories,
              subcategories,
              car_brands
            }, {
              layout: 'dashboard'
            });
            return;
          }
          reply.redirect('/dashboard/products');
        });

      });
    });
  });
};

exports.categories = (request, reply) => {
  Async.parallel([
    getData('/categories'),
    getData('/subcategories')
  ], (err, results) => {
    reply.view('dashboard/categories', {
      categories: results[0].categories,
      subcategories: results[1].subcategories,
    }, {
      layout: 'dashboard'
    });
  });
};

exports.categoriesCreate = (request, reply) => {
  const { name, name_th } = request.payload;
  Async.parallel([
    createCategory({ name, name_th })
  ], (err, results) => {
    reply.redirect('/dashboard/categories');
  });
};

exports.categoriesUpdate = (request, reply) => {
  const { name, name_th } = request.payload;
  const id = request.params.id;
  Async.parallel([
    updateCategory(id, { name, name_th })
  ], (err, results) => {
    if (err) return reply(Boom.badRequest());
    reply().code(200);
  });
};

exports.subcategoriesCreate = (request, reply) => {
  const { category_id, name, name_th } = request.payload;
  Async.parallel([
    createSubcategory({ category_id, name, name_th })
  ], (err, results) => {
    reply.redirect('/dashboard/categories');
  });
};

exports.subcategoriesUpdate = (request, reply) => {
  const { category_id, name, name_th } = request.payload;
  const id = request.params.id;
  Async.parallel([
    updateSubcategory(id, { category_id, name, name_th })
  ], (err, results) => {
    if (err) return reply(Boom.badRequest());
    reply().code(200);
  });
};

exports.orders = (request, reply) => {
  Async.parallel([
    getData('/orders')
  ], (err, results) => {

    let orders = results[0].orders;
    let getOrderDetails = [];
    orders.forEach((order) => {
      const by = (!order.user_id)? '?by=customer' : '';
      getOrderDetails.push(getData('/orders/' + order.id + by));
      order.details = [];
    });

    // Get each order items
    Async.parallel(getOrderDetails, (err, results) => {

      results.forEach((items) => {
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          let order = _.find(orders, {'id': item.order_id});
          if (_.isEmpty(order)) continue;
          order.details.push({
            product_id: item.product_id,
            primary_image: item.primary_image,
            subcategory_name: item.subcategory_name,
            quantity: item.quantity
          });
        }
      });

      reply.view('dashboard/orders/index', {
        orders: orders
      }, {
        layout: 'dashboard'
      });

    });

  });
};

exports.ordersShow = (request, reply) => {
  const { id } = request.params;
  const { by } = request.query;
  Async.parallel([
    getData(`/orders/${id}?by=${by}`)
  ], (err, results) => {
    if (err) reply.redirect('/dashboard/orders');
    if (results[0].length == 0) reply.redirect('/dashboard/orders');
    let orderDetails = results[0];
    let firstOrderDetails = results[0][0];
    const {
      customer_name, email, phone, address,
      country, city, zip, ordered_at, ref_id
    } = firstOrderDetails;
    reply.view('dashboard/orders/show', {
      customer: {
        customer_name, email, phone, address, country, city, zip
      },
      ordered_at,
      ref_id,
      orderDetails
    }, {
      layout: 'dashboard'
    });
  });
};

function getSubcategoryData(subcategoryParam) {
  let id = subcategoryParam;
  let text = undefined;
  const data = subcategoryParam.split('|');
  if (data.length > 1) {
    id = data[0];
    text = data[data.length - 1];
  }
  return { id, text };
}

function getImageNames(images) {
  let imgNames = [];
  if (!_.isArray(images)) images = [images];
  images.forEach((image) => {
    let imageData = image.split('/');
    imgNames.push(imageData[imageData.length - 1]);
  });
  return imgNames;
}

function saveImages(productId, subcategoryText, images, successFn) {
  let uploadedImages = [];
  const firstImage = _.isArray(images) ? images[0] : images;
  if (!productId || !subcategoryText || _.isEmpty(firstImage.hapi.filename)) {
    return successFn(uploadedImages);
  }
  if (!_.isArray(images)) images = [images];

  const folderName = subcategoryText.replace(/\s/g,'_').toLowerCase();
  let subCategoryPath = `${__dirname}/../../../assets/images/products/${folderName}`;
  if (!fs.existsSync(subCategoryPath)) fs.mkdirSync(subCategoryPath);

  const productImagePath = `${subCategoryPath}/${productId}`;
  if (!fs.existsSync(productImagePath)) fs.mkdirSync(productImagePath);

  let imgCount = images.length;
  images.forEach((img) => {
    let name = img.hapi.filename;
    let path = `${productImagePath}/${name}`;
    let file = fs.createWriteStream(path);
    img.pipe(file);
    img.on('end', (err) => {
      uploadedImages.push(path);
      imgCount--;
      if (imgCount == 0) return successFn(uploadedImages);
    });
  });
}

function removeImage(productId, subcategoryText, imageName, successFn) {
  if (!productId || !subcategoryText || !imageName) return successFn();

  const folderName = subcategoryText.replace(/\s/g,'_').toLowerCase();
  let subCategoryPath = `${__dirname}/../../../assets/images/products/${folderName}`;
  const productImagePath = `${subCategoryPath}/${productId}`;
  if (!fs.existsSync(productImagePath)) return successFn();

  fs.unlink(`${productImagePath}/${imageName}`, successFn);
}

function getProducts(query) {
  return (cb) => {
    Request.get(`${apiUrl}/products?${query}`)
      .end((err, res) => {
        if (err) return cb(true);
        cb(null, res.body);
      });
  };
}

function findProduct(productId) {
  return (cb) => {
    Request.get(`${apiUrl}/products/${productId}`)
      .end((err, res) => {
        if (err) return cb(true);
        cb(null, res.body);
      });
  };
}

function createProduct(request) {
  return (cb) => {
    Request.post(`${apiUrl}/products`)
      .send(request)
      .end((err, res) => {
        if (err) return cb(true);
        cb(null, res.body);
      });
  };
}

function getData(path) {
  return (cb) => {
    Request.get(`${apiUrl}${path}`)
      .end((err, res) => {
        if (err) return cb(true);
        cb(null, res.body);
      });
  };
}

function updateProductPrimaryImage(path, data) {
  return (cb) => {
    Request.put(`${apiUrl}${path}`)
      .send(data)
      .end((err, res) => {
        if (err) return cb(true);
        cb(null, res.body);
      });
  };
}

function updateProduct(path, request) {
  return (cb) => {
    Request.put(`${apiUrl}${path}`)
      .send(request)
      .end((err, res) => {
        if (err) return cb(true);
        cb(null, res.body);
      });
  };
}

function deleteProduct(path) {
  return (cb) => {
    Request.del(`${apiUrl}${path}`)
      .end((err, res) => {
        if (err) return cb(true);
        cb(null, res.body);
      });
  };
}

function deleteProductImage(path, data) {
  return (cb) => {
    Request.del(`${apiUrl}${path}`)
      .send(data)
      .end((err, res) => {
        if (err) return cb(true);
        cb(null, res.body);
      });
  };
}

function getUserInfo(userId) {
  return (cb) => {
    Request.get(`${apiUrl}/users/${userId}`)
      .end((err, res) => {
        if (err) return cb(true);
        cb(null, res.body);
      });
  };
}

function updateAccount(userId, data) {
  return (cb) => {
    Request.put(`${apiUrl}/users/${userId}`)
      .send(data)
      .end((err, res) => {
        if (err) return cb(true, res.body);
        cb(null, res.body);
      });
  };
}

// function getData(url) {
//   return (cb) => {
//     Request.get(`${apiUrl}/${url}`)
//       .end((err, res) => {
//         if (err) return cb(true, res.body);
//         cb(null, res.body);
//       });
//   };
// }

function createCategory(data) {
  return (cb) => {
    Request.post(`${apiUrl}/categories`)
      .send(data)
      .end((err, res) => {
        if (err) return cb(true);
        cb(null, res.body);
      });
  };
}

function updateCategory(id, data) {
  return (cb) => {
    Request.put(`${apiUrl}/categories/${id}`)
      .send(data)
      .end((err, res) => {
        if (err) return cb(true);
        cb(null, res.body);
      });
  };
}

function updateSubcategory(id, data) {
  return (cb) => {
    Request.put(`${apiUrl}/subcategories/${id}`)
      .send(data)
      .end((err, res) => {
        if (err) return cb(true);
        cb(null, res.body);
      });
  };
}

function createSubcategory(data) {
  return (cb) => {
    Request.post(`${apiUrl}/subcategories`)
      .send(data)
      .end((err, res) => {
        if (err) return cb(true);
        cb(null, res.body);
      });
  };
}
