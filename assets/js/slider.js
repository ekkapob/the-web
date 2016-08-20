$(function(){
  $('#home-products .coolant-products').slick({
    dots: true,
    slidesToShow: 3,
    autoplay: true,
    autoplaySpeed: 3500,
    responsive: [
    {
      breakpoint: 770,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        dots: true
      }
    }]
  });

  $('#product-show .product-images').slick({
    dots: true
  });
})
