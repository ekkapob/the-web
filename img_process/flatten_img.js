var fs = require('fs-extra');

// {source_dir} --> {source_dir}/{target_dir}
var sourceDir = 'images';
var targetDir = 'flattened';

var directories = fs.readdirSync(sourceDir).filter((name) => {
  var path = `${__dirname}/${sourceDir}/${name}`;
  return name != targetDir &&
    name != 'final' && // skip 'final' directory
    fs.statSync(path).isDirectory();
});


directories.forEach((dir) => {
  var dirPath = `${sourceDir}/${dir}`;
  var files = fs.readdirSync(dirPath);
  if (files.length == 0) return;

  files.forEach((file) => {
    var filePath = `${dirPath}/${file}`;
    var newPath = `${sourceDir}/${targetDir}/${dir}_${file}`;
    try {
      fs.copySync(filePath, newPath);
      console.log(`[DONE] copied: ${filePath} to ${newPath}`);
    } catch (err) {
      console.error(err);
    }
  });
});
