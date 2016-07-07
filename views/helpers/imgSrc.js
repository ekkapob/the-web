import _ from 'lodash';

module.exports = (img, product_id, category, subcategory) => {
  var path;
  if (_.isEmpty(img)) {
    path = [ '/assets/images/products', 'unavailable.jpg' ];
  } else {
    var subCategoryDir = subcategory.toLowerCase().replace(/ /g, '_');
    path = [ '/assets/images/products', subCategoryDir, product_id, img ];
  }
  return path.join('/');
};
