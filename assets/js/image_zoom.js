$(function(){
  $('.xzoom').xzoom({
    defaultScale: -0.5,
    smooth: false,
  });

  $('.image-thumbnails').hover(function(){
    $('.xzoom-preview').remove();
    $('.xzoom-source').remove();
  });
});
