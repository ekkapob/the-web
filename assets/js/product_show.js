$(function(){
  var displayImg = $('#product-show .display-image > img');
  $('.image-thumbnails > div').mouseover(showImageThumbnail(displayImg));
  registerOrderAmountBtn();
  registerOrderBtn();
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

function registerOrderAmountBtn() {
  var clickHandler = function(step) {
    return function(btn){
      var $target = $(btn.target);
      var $input = $target.siblings('input');
      var inputVal = $input.val();
      if (!inputVal || isNaN(inputVal)) return;
      var nextVal = parseInt(inputVal) + step;
      if (nextVal <= 0) return;
      $input.val(nextVal);
    }
  };
  $('.decrease-order').click(clickHandler(-1));
  $('.increase-order').click(clickHandler(1));
}

function registerOrderBtn() {
  $('.btn-order').click(function(e){
    var productId = $(this).data('product-id');
    var orderVal = $('#order-amount').val();
    if (!orderVal || isNaN(orderVal)) return;
    if (orderVal <= 0) return;

    global.updateCart(productId, orderVal, function(){
      $('#flash-ordered-msg').text(getMsg(orderVal))
        .fadeIn('fast').fadeOut(1200);
      global.refreshCart();
      $('.in-cart-msg').removeClass('hidden');
    }, function(){
      $('#flash-ordered-msg').text('There are some errors. No order is added.')
      .fadeIn('fast').fadeOut(2000);
    });

  });
}

function getMsg(amount) {
  if (amount < 2) return amount + ' item is added to your cart.';
  return amount + ' items are added to your cart.';
}
