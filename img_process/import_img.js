var fs = require('fs-extra');
var Squel = require('squel').useFlavour('postgres');
var sourceDir = 'images/final';

var dbname = 'web_dev';
var conn = `postgres://webadmin:Ekka1994@localhost/${dbname}`;
var Client = require('pg-native')
var client = new Client();

client.connectSync(conn);


var directories = fs.readdirSync(sourceDir).filter((name) => {
  var path = `${__dirname}/${sourceDir}/${name}`;
  return fs.statSync(path).isDirectory();
});

directories.forEach((dir) => {
  var files = fs.readdirSync(`${sourceDir}/${dir}`);
  if (files.length < 1) return;
  var fileString = files.join(",");
  updateImages(dir, fileString);
  setPrimaryImg(dir, files[0]);
});

function updateImages(productId, fileString) {
  var q = Squel.update().table('products')
            .set('images', `{${fileString}}`)
            .where('product_id = ?', productId)
            .toParam();
  client.querySync(q.text, q.values);
}

function setPrimaryImg(productId, img) {
  var q = Squel.update().table('products')
            .set('primary_image', img)
            .where('product_id = ?', productId)
            .toParam();
  client.querySync(q.text, q.values);
}
