$(function() {
  $('button.subcategory-update-btn').click(function(e){
    e.preventDefault();
    var id = $(this).data('id');
    var tdName = $(this).parent().siblings('td.name')[0];
    var tdNameTh = $(this).parent().siblings('td.name_th')[0];
    var tdCategoryId = $(this).parent().siblings('td.category_id')[0];
    var category_id = $(tdCategoryId).children('input')[0].value;
    var name = $(tdName).children('input')[0].value;
    var name_th = $(tdNameTh).children('input')[0].value;
    $.ajax({
      url: '/dashboard/subcategories/' + id,
      type: 'PUT',
      data: { category_id: category_id, name: name, name_th: name_th },
      success: function(result) {
        $('#category-status').empty();
        $('#category-status').append('<div class="alert alert-success" role="alert">Subcategory has been updated.</div>');
        setTimeout(function(){
          $('#category-status').empty();
        }, 3000);
      },
      error: function(result) {
        $('#category-status').empty();
        $('#category-status').append('<div class="alert alert-danger" role="alert">Category ID is required.</div>');
        setTimeout(function(){
          $('#category-status').empty();
        }, 3000);
      }
    });

  });
});
