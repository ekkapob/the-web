$(function(){
  initMobileNav();
});

function initMobileNav() {
  $('#mobile-menu').on('click', function(e){
    e.preventDefault();
    var $this = $(this);
    var target = $(this).data('target');
    var isOpened = $this.hasClass('active');
    if (isOpened) {
      $this.removeClass('active');
      $(target).slideUp();
    } else {
      $(target).slideDown();
      $this.addClass('active');
    }
  });
}
