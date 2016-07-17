var global = {
  refreshCart: function(cb) {
    $.get('/cart', function(data){
      if (!data) return;
      var total = 0;
      for (var key in data) {
        var order = data[key];
        if (isNaN(order)) continue;
        total += order;
      }
      $('#cart-items').text(total);
      if (cb) cb(total);
    });
  },
  updateCart: function(productId, value, doneCb, failCb) {
    doneCb = doneCb || function(){};
    failCb = failCb || function(){};
    $.post('/orders/' + productId, { amount: value })
      .done(doneCb)
      .fail(failCb);
  },
  showLoading: function(){
    $('#loading').removeClass('hidden');
  },
  hideLoading: function(){
    $('#loading').addClass('hidden');
  }
};

