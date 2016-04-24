var dbname = 'web_dev';
var conn = `postgres://webadmin:Ekka1994@localhost/${dbname}`;
var _ = require('lodash');
var fs = require('fs');
var parse = require('csv-parse');
var Client = require('pg-native')
var client = new Client();
var Squel = require('squel').useFlavour('postgres');

// Saved indexes for relation dbs
var indexes = {
  category: { en: undefined, th: undefined },
  carBrand: undefined,
  productId: undefined,
  subcategory: {en: undefined, th: undefined }
};

var parser = parse((err, data) => {
  var columns = processHeaders(data[0]);
  data = _.drop(data);
  client.connectSync(conn);
  data.forEach((row) => {
    updateTables(columns, row);
  })
  summary();
  client.end();
});

/* Main program */
(() => {
  var csvFile = process.argv[2];
  if (!_.isEmpty(csvFile)) {
    console.log(`Importing ${csvFile}`);
    fs.createReadStream(csvFile).pipe(parser);
  }
})();

function summary() {
  var productRows = client.querySync('SELECT COUNT(1) FROM products');
  var carBrandRows = client.querySync('SELECT COUNT(1) FROM car_brands');
  var categoryRows = client.querySync('SELECT COUNT(1) FROM categories');
  var subcategoryRows = client.querySync('SELECT COUNT(1) FROM subcategories');


  console.log(`[DONE]`);
  console.log(`Products: ${productRows[0].count} rows [sync]`);
  console.log(`Car brands: ${carBrandRows[0].count} rows [sync]`);
  console.log(`Categories: ${categoryRows[0].count} rows [sync]`);
  console.log(`Subcategories: ${subcategoryRows[0].count} rows [sync]`);
}

function processHeaders(headers) {
  var columnMappings = {
    id: 'product_id'
  };
  return headers.map((header, index) => {
    result = header.toLowerCase();
    result = result.replace(/ /g, '_');
    result = result.replace(/[(|)|\.]/g, '');
    result = columnMappings[result] || result;
    fetchIndexes(result, index);
    return result;
  });
}

function fetchIndexes(header, index) {
  if (_.startsWith(header, 'category_en')) {
    indexes.category.en = index;
  } else if (_.startsWith(header, 'category_th')) {
    indexes.category.th = index;
  } else if (_.startsWith(header, 'car_brand')) {
    indexes.carBrand = index;
  } else if (_.startsWith(header, 'product_id')) {
    indexes.productId = index;
  } else if (_.startsWith(header, 'subcategory_en')) {
    indexes.subcategory.en = index;
  } else if (_.startsWith(header, 'subcategory_th')) {
    indexes.subcategory.th = index;
  }
}

function updateTables(columns, row) {
  var productId = row[indexes.productId].trim();
  if (_.isEmpty(productId)) return;

  var carId = findOrCreateCarBrand(row);
  var categoryId = findOrCreateCategory(row);
  var subcategoryId = findOrCreateSubcategory(row, categoryId);

  var filterIdColumns = (header, index) => {
    return _.indexOf([
                      indexes.carBrand,
                      indexes.category.en,
                      indexes.category.th,
                      indexes.subcategory.en,
                      indexes.subcategory.th
                     ], index) == -1;
  }
  columns = columns.filter(filterIdColumns);
  columns = columns.concat(['car_brand_id', 'category_id', 'subcategory_id']);
  row = row.filter(filterIdColumns);
  row = row.concat([carId, categoryId, subcategoryId]);

  var q = Squel.update().table('products');
  for (i = 0; i < columns.length; i++) {
    q.set(columns[i], row[i]);
  }
  q = q.where('product_id = ?', row[indexes.productId])
    .returning('id')
    .toParam();

  // Update first
  var rows = client.querySync(q.text, q.values);
  // then, Insert
  if (_.isEmpty(rows)) {
    q = Squel.insert().into('products');
    for (i = 0; i < columns.length; i++) {
      q.set(columns[i], row[i]);
    }
    q = q.toParam();
    client.querySync(q.text, q.values);
  }
}

function findOrCreateCarBrand(row) {
  var car = row[indexes.carBrand].trim().toUpperCase();
  if (_.isEmpty(car)) return null;

  var rows = client.querySync('SELECT id FROM car_brands WHERE name = $1', [car]);
  if (_.isEmpty(rows)) {
    var q = `INSERT INTO car_brands (name) SELECT $1 WHERE NOT EXISTS
    (SELECT id FROM car_brands WHERE name = $1) RETURNING id`
    rows = client.querySync(q, [car]);
  }
  return rows[0].id
}

function findOrCreateCategory(row) {
  var categoryEn = row[indexes.category.en].trim();
  if (_.isEmpty(categoryEn)) return null;

  var categoryTh = row[indexes.category.th].trim();
  categoryTh = _.isEmpty(categoryTh)? null : categoryTh;

  var rows = client.querySync('SELECT id FROM categories WHERE name = $1', [categoryEn]);
  if (_.isEmpty(rows)) {
    var q = `INSERT INTO categories (name, name_th) SELECT $1, $2 WHERE NOT EXISTS
    (SELECT id FROM categories WHERE name = $1) RETURNING id`
    rows = client.querySync(q, [categoryEn, categoryTh]);
  }
  return rows[0].id
}

function findOrCreateSubcategory(row, categoryId) {
  if (!categoryId) return null;
  var subcategoryEn = row[indexes.subcategory.en].trim();
  if (_.isEmpty(subcategoryEn)) return null;

  var subcategoryTh = row[indexes.subcategory.th].trim();
  subcategoryTh = _.isEmpty(subcategoryTh)? null : subcategoryTh;

  var rows = client.querySync('SELECT id FROM subcategories WHERE name = $1', [subcategoryEn]);
  if (_.isEmpty(rows)) {
    var q = `INSERT INTO subcategories (category_id, name, name_th) SELECT $1, $2, $3 WHERE NOT EXISTS
    (SELECT id FROM subcategories WHERE name = $2) RETURNING id`
    rows = client.querySync(q, [categoryId, subcategoryEn, subcategoryTh]);
  }
  return rows[0].id
}

