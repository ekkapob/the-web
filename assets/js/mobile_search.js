$(function(){
  var $mobileSearchForm = $('#mobile-search-form')
  $mobileSearchForm.find('span').click(function(e){
    e.preventDefault();
    $mobileSearchForm.submit();
  })
})
