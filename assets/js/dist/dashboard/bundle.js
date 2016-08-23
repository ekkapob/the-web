
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiLCJwcm9kdWN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIiwiJChmdW5jdGlvbigpe1xuICAkKCcucHJvZHVjdHMgLmltYWdlcyBhLnNldC1wcmltYXJ5LWltYWdlJykuY2xpY2soZnVuY3Rpb24oZSl7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHZhciBpbWFnZVRhZyA9ICQodGhpcykuZmluZCgnaW1nJyk7XG4gICAgdmFyIGRhdGEgPSBpbWFnZVRhZy5kYXRhKCk7XG4gICAgdmFyIGltYWdlTmFtZSA9IGRhdGEuaW1hZ2U7XG4gICAgdmFyIHByb2R1Y3RJZCA9IGRhdGEucHJvZHVjdElkO1xuXG4gICAgJC5hamF4KHtcbiAgICAgIHVybDogJy9kYXNoYm9hcmQvcHJvZHVjdHMvJyArIHByb2R1Y3RJZCArICcvcHJpbWFyeV9pbWFnZXMnLFxuICAgICAgdHlwZTogJ1BVVCcsXG4gICAgICBkYXRhOiB7IGltYWdlX25hbWUgOiBpbWFnZU5hbWUgfSxcbiAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICB1cGRhdGVQcmltYXJ5SW1hZ2UoaW1hZ2VOYW1lKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG5cbiAgJCgnLnByb2R1Y3RzIC5pbWFnZXMgYS5yZW1vdmUtaW1hZ2UnKS5jbGljayhmdW5jdGlvbihlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHZhciBkYXRhID0gJCh0aGlzKS5kYXRhKCk7XG4gICAgdmFyIGltYWdlTmFtZSA9IGRhdGEuaW1hZ2U7XG4gICAgdmFyIHByb2R1Y3RJZCA9IGRhdGEucHJvZHVjdElkO1xuXG4gICAgJC5hamF4KHtcbiAgICAgIHVybDogJy9kYXNoYm9hcmQvcHJvZHVjdHMvJyArIHByb2R1Y3RJZCArICcvaW1hZ2VzJyxcbiAgICAgIHR5cGU6ICdERUxFVEUnLFxuICAgICAgZGF0YTogeyBpbWFnZV9uYW1lOiBpbWFnZU5hbWUgfSxcbiAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICByZW1vdmVEZWxldGVkSW1hZ2UocmVzdWx0LmRlbGV0ZWRfaW1hZ2VfbmFtZSk7XG4gICAgICAgIGlmIChkYXRhLmlzUHJpbWFyeUltYWdlKSBzZXRQcmltYXJ5SW1hZ2UoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG5cbiAgZnVuY3Rpb24gc2V0UHJpbWFyeUltYWdlKCkge1xuICAgIHZhciAkaW1hZ2UgPSAkKCcuaW1hZ2VzIC5pbWFnZTpmaXJzdC1jaGlsZCcpO1xuICAgIGlmICgkaW1hZ2UubGVuZ3RoID09IDApIHJldHVybjtcbiAgICAkaW1hZ2UuZmluZCgnYS5zZXQtcHJpbWFyeS1pbWFnZScpLmNsaWNrKCk7XG4gIH1cblxuICBmdW5jdGlvbiB1cGRhdGVQcmltYXJ5SW1hZ2UocHJpbWFyeUltYWdlTmFtZSkge1xuICAgIHZhciAkaW1hZ2VzID0gJCgnLmltYWdlcyBpbWcnKTtcbiAgICAkaW1hZ2VzLnJlbW92ZUNsYXNzKCdwcmltYXJ5LWltYWdlJyk7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8ICRpbWFnZXMubGVuZ3RoOyBpKysgKSB7XG4gICAgICB2YXIgaW1hZ2UgPSAkaW1hZ2VzW2ldO1xuICAgICAgaWYoJChpbWFnZSkuZGF0YSgpLmltYWdlID09IHByaW1hcnlJbWFnZU5hbWUpIHtcbiAgICAgICAgJChpbWFnZSkuYWRkQ2xhc3MoJ3ByaW1hcnktaW1hZ2UnKTtcbiAgICAgICAgJChpbWFnZSkucGFyZW50KCkuc2libGluZ3MoKS5maW5kKCdhJykuZGF0YSgnaXNQcmltYXJ5SW1hZ2UnLCB0cnVlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcmVtb3ZlRGVsZXRlZEltYWdlKGRlbGV0ZWRJbWFnZSkge1xuICAgIHZhciBpbWFnZXMgPSAkKCcuaW1hZ2VzIC5pbWFnZScpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaW1hZ2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgJGltYWdlID0gJChpbWFnZXNbaV0pO1xuICAgICAgdmFyICRsaW5rID0gJGltYWdlLmZpbmQoJ2EgaW1nJyk7XG4gICAgICB2YXIgZGF0YSA9ICRsaW5rLmRhdGEoKTtcbiAgICAgIGlmIChkYXRhLmltYWdlID09IGRlbGV0ZWRJbWFnZSkge1xuICAgICAgICAkaW1hZ2UucmVtb3ZlKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxufSk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
