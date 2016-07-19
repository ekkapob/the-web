$(function() {
 clickToSubmit();
 registerMobileFilter();
});

function clickToSubmit() {
  var productFilterForm = $('#product-filter-form');
  $('#product-filter-form label').click(function(){
    $('#loading').removeClass('hidden');
    productFilterForm.submit();
  });
}

function registerMobileFilter() {
  $('#show-categories-btn').click(function(e){
    e.preventDefault();
    $('.filter-container').addClass('opened');
  });

  $('#filter-toggle').click(function(e){
    $('.filter-container').removeClass('opened');
  });
}
