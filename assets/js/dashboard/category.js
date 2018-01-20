var DEFAULT_CONVERT_CATEGORY_ID;

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

  $('button.category-delete-btn').click(function(e){
    e.preventDefault();
    var id = $(this).data('id');
    var tdName = $(this).parent().siblings('td.name')[0];
    var name = $(tdName).children('input')[0].value;


    DEFAULT_CONVERT_CATEGORY_ID = undefined;
    bootbox.prompt({
      title: '<span style="color: red">Delete ' + (name) + ' & Convert its products to new one</span>',
      inputType: 'select',
      inputOptions: getCategoryOptions(id),
      callback: function (result) {
        if (result == '') result = DEFAULT_CONVERT_CATEGORY_ID;
        $.ajax({
          url: '/dashboard/categories/' + id + '/convert_products_to/' + result,
          type: 'DELETE',
          success: function(result) {
            console.log('...del...');
            location.reload();
            // $('#category-status').empty();
            // $('#category-status').append('<div class="alert alert-success" role="alert">Category has been updated.</div>');
            // setTimeout(function(){
            //   $('#category-status').empty();
            // }, 3000);
          }
        });
        // console.log('<<<' + result + '>>>>');
      }
    });
  });

  function getCategoryOptions(toDeleteId) {
    var results = [];
    var categories = $('tr.list-category');
    for (var i = 0; i < categories.length; i++) {
      var category = categories[i];
      var id = $(category).data('categoryId');
      if (toDeleteId == id) continue;
      var name = $(category).data('categoryName');
      results.push({
        text: name,
        value: id
      });
    }
    if (results.length > 0) {
      // to force selection, need to remove first option to have blank value
      DEFAULT_CONVERT_CATEGORY_ID = results[0].value;
      results[0].value = '';
    }
    return results;
  }

});
