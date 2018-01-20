$(function() {
  $('button.category-update-btn').click(function(e){
    e.preventDefault();
    var id = $(this).data('id');
    var tdName = $(this).parent().siblings('td.name')[0];
    var tdNameTh = $(this).parent().siblings('td.name_th')[0];
    var name = $(tdName).children('input')[0].value;
    var name_th = $(tdNameTh).children('input')[0].value;
    $.ajax({
      url: '/dashboard/categories/' + id,
      type: 'PUT',
      data: { name: name, name_th: name_th },
      success: function(result) {
        $('#category-status').empty();
        $('#category-status').append('<div class="alert alert-success" role="alert">Category has been updated.</div>');
        setTimeout(function(){
          $('#category-status').empty();
        }, 3000);
      }
    });

  });
});
