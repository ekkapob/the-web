$(function(){
  $('.products .images a.set-primary-image').click(function(e){
    e.preventDefault();
    var imageTag = $(this).find('img');
    var data = imageTag.data();
    var imageName = data.image;
    var productId = data.productId;

    $.ajax({
      url: '/dashboard/products/' + productId + '/primary_images',
      type: 'PUT',
      data: { image_name : imageName },
      success: function(result) {
        updatePrimaryImage(imageName);
      }
    });
  });

  $('.products .images a.remove-image').click(function(e) {
    e.preventDefault();
    var data = $(this).data();
    var imageName = data.image;
    var productId = data.productId;

    $.ajax({
      url: '/dashboard/products/' + productId + '/images',
      type: 'DELETE',
      data: { image_name: imageName },
      success: function(result) {
        removeDeletedImage(result.deleted_image_name);
        if (data.isPrimaryImage) setPrimaryImage();
      }
    });
  });

  function setPrimaryImage() {
    var $image = $('.images .image:first-child');
    if ($image.length == 0) return;
    $image.find('a.set-primary-image').click();
  }

  function updatePrimaryImage(primaryImageName) {
    var $images = $('.images img');
    $images.removeClass('primary-image');

    for (var i = 0; i < $images.length; i++ ) {
      var image = $images[i];
      if($(image).data().image == primaryImageName) {
        $(image).addClass('primary-image');
        $(image).parent().siblings().find('a').data('isPrimaryImage', true);
        break;
      }
    }
  }

  function removeDeletedImage(deletedImage) {
    var images = $('.images .image');
    for (var i = 0; i < images.length; i++) {
      var $image = $(images[i]);
      var $link = $image.find('a img');
      var data = $link.data();
      if (data.image == deletedImage) {
        $image.remove();
        return;
      }
    }
  }

});
