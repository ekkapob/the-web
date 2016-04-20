$(function() {
 clickToSubmit();
});

function clickToSubmit() {
  var productFilterForm = $('#product-filter-form');
  $('#product-filter-form label').click(function(){
    $('#loading').removeClass('hidden');
    productFilterForm.submit();
  });
}
