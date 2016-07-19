$(function(){
  // $(window).on('scroll', scrollHandler);
});

function scrollHandler() {
  console.log(window.scrollY);
  if (window.scrollY > 200) {
    $('header').addClass('fixed');
  } else if (window.scrollY < 35){
    $('header').removeClass('fixed');
  }
}


