$(function() {
  $('.product-delete-btn').click(function(e){
    e.preventDefault();
    var productId = $(this).data().productId;

    bootbox.confirm({
      message: "Are you sure to delete this product?",
      buttons: {
        confirm: {
          label: 'Delete',
          className: 'btn-danger'
        },
        cancel: {
          label: 'Cancel',
          className: 'btn-default'
        }
      },
      callback: function (result) {
        if (result) {
          $.ajax({
            url: '/dashboard/products/' + productId,
            type: 'DELETE',
            success: function(result) {
              // $('#product-' + result.product_id).remove();
              location.reload();
            }
          });
        }
      }
    });

  });
});
