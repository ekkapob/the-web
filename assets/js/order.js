$(function(){
  registerOrderActions();
  registerInputActions();
  registerDeleteOrder();
  registerUpdateOrder();
  registerPlaceOrder();
});

function updateOrderTotal(total){
  if (total == 0) return location.reload();
  var text = (total > 1) ? total + ' items' : total + ' item';
  $('#cart .order-total').text(text);
}

function registerUpdateOrder(){
  $('#cart .order button.update-btn').click(function(){
    var $btn = $(this)
    var productId = $btn.data('product-id');
    var orderInputId = $btn.data('order-input-id');
    var orderVal = $(orderInputId).val();
    $('#loading').removeClass('hidden');
    global.showLoading();
    global.updateCart(productId, orderVal, function(){
      global.refreshCart(updateOrderTotal);
      global.hideLoading();
      $btn.addClass('hidden');
    }, function(){
      global.hideLoading();
    });
  });
}

function registerInputActions(){
  var $input = $('#cart-summary .amount input');
  $input.change(valueChangedHandler);
  $input.keydown(valueChangedHandler);
}

function valueChangedHandler(){
  var $updateBtn = $(this).parents('.product-details')
                      .next().find('button');
  if ($updateBtn.hasClass('hidden')) {
    $updateBtn.removeClass('hidden')
      .hide().fadeIn();
  }
}

function registerOrderActions(){
  $('#cart-summary .amount span').click(function(){
    var step = 1;
    var $orderInput, orderVal, nextVal;
    if ($(this).hasClass('decrease')) {
      step = -1;
      $orderInput = $(this).next('input');
    } else {
      $orderInput = $(this).prev('input');
    }
    orderVal = $orderInput.val();
    if (!orderVal || isNaN(orderVal)) return $orderInput.val(1);
    nextVal = parseInt(orderVal) + step;
    nextVal = (nextVal < 1) ? 1 : nextVal;
    $orderInput.val(nextVal);
    $orderInput.trigger('change');
  });
}

function registerDeleteOrder(){
  $('#cart .order .delete-btn').click(function(){
    var $btn = $(this);
    global.showLoading();
    $.ajax({
      method: 'DELETE',
      url: $(this).data('url'),
    }).done(function(){
      $btn.parents('.order').remove();
      global.refreshCart(updateOrderTotal);
      global.hideLoading();
    }).fail(function(){
      global.hideLoading();
    });
  });
}

function registerPlaceOrder(){
  $('#order-place-order').click(function(){
    global.showLoading();
  });
}
