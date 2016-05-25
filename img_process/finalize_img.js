var fs = require('fs-extra');

var sourceDir = 'images/flattened';
var targetDir = 'images/final';

var files = fs.readdirSync(sourceDir);
console.log(files);

files.forEach((file) => {
  var meta = file.split('_');
  var dir = meta[0];
  var newFile = getDate() + '_' + meta[1];
  try {
    var source = `${sourceDir}/${file}`;
    var destination = `${targetDir}/${dir}/${newFile}`;
    fs.copySync(source, destination);
    console.log(`[DONE] processed: ${destination}`);
  } catch (err) {
    console.error(err);
  }
});

function getDate() {
  // format is DDMMYYYY
  var now = new Date();
  var yyyy = now.getFullYear().toString();
  var mm = (now.getMonth() + 1).toString();
  var dd = now.getDate().toString();
  return yyyy + (mm[1]? mm : '0' + mm[0]) + (dd[1]? dd : '0' + dd[0]);
}
