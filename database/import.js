var conn = "postgres://webadmin:Ekka1994@localhost/web_dev";
var _ = require('lodash');
var fs = require('fs');
var parse = require('csv-parse');
var Client = require('pg-native')
var client = new Client();

var indexes = {
  category: { en: undefined, th: undefined },
  carBrand: undefined,
  productId: undefined,
  subcategoryId: undefined
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

  console.log(`[DONE]`);
  console.log(`Products: ${productRows[0].count} rows [sync]`);
  console.log(`Car brands: ${carBrandRows[0].count} rows [sync]`);
  console.log(`Categories: ${categoryRows[0].count} rows [sync]`);
}

function processHeaders(headers) {
  var columnMappings = {
    id: 'product_id',
    subcategory: 'subcategory_id'
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
  } else if (_.startsWith(header, 'subcategory_id')) {
    indexes.subcategoryId = index;
  }
}

function updateTables(columns, row) {
  var productId = row[indexes.productId].trim();
  if (_.isEmpty(productId)) return;

  var carId = findOrCreateCarBrand(row);
  var categoryId = findOrCreateCategory(row);
  var filterIdColumns = (header, index) => {
    return _.indexOf([indexes.carBrand,
                     indexes.category.en,
                     indexes.category.th,
                     // TODO: ignore subcategory for now
                     indexes.subcategoryId], index) == -1;
  }
  columns = columns.filter(filterIdColumns);
  columns = columns.concat(['car_brand_id', 'category_id']);
  row = row.filter(filterIdColumns);
  row = row.concat([carId, categoryId]);

  // Update
  var insertQuery = updateQuery = '';
  for (i = 0; i < columns.length; i++) {
    if (i != 0) {
      updateQuery += ','
      insertQuery += ','
    }
    updateQuery += ` ${columns[i]} = $${(i+1)} `;
    insertQuery += ` $${(i+1)} `;
  }
  var rows = client.querySync(`UPDATE products SET ${updateQuery}
                              WHERE product_id = $${columns.length + 1}
                              RETURNING id`, row.concat(productId));
  // Insert
  if (_.isEmpty(rows)) {
    client.querySync(`INSERT INTO products (${columns.join(',')}) VALUES (${insertQuery})`, row);
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

