$(function(){
  var displayImg = $('#product-show .display-image > img');
  $('.image-thumbnails > div').mouseover(showImageThumbnail(displayImg));
});

function showImageThumbnail(displayImg) {
  return function() {
    clearImageThumbnailSelection($(this).parent());
    var imgThumbnail = $(this).children();
    var hoverImg = imgThumbnail.attr('src');
    imgThumbnail.addClass('selected');

    displayImg.attr('src', hoverImg)
  };
};

function clearImageThumbnailSelection(imgThumbnailsContainer) {
  imgThumbnailsContainer.find('img.selected').removeClass('selected');
}
