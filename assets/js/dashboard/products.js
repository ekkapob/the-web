$(function() {
  $('.product-delete-btn').click(function(e){
    e.preventDefault();
    var productId = $(this).data().productId;
    $.ajax({
      url: '/dashboard/products/' + productId,
      type: 'DELETE',
      success: function(result) {
        $('#product-' + result.product_id).remove();
      }
    });
  });
});
