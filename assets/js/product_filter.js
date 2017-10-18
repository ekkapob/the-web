$(function() {
 clickToSubmit();
 registerMobileFilter();
 filterSectionShowHide();
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

function filterSectionShowHide() {
  $('.filter-title a.show-btn').click(function(e){
    e.preventDefault();

    var $this = $(this);
    var component = $this.data('toggle');
    $(component).show();
    var pairBtn = $this.data('pair-button');
    console.log(pairBtn);
    $(pairBtn).show();
    $this.hide();
  });

  $('.filter-title a.hide-btn').click(function(e){
    e.preventDefault();

    var $this = $(this);
    var component = $this.data('toggle');
    $(component).hide();
    var pairBtn = $this.data('pair-button');
    console.log(pairBtn);
    $(pairBtn).show();
    $this.hide();
  });
}

