var DEFAULT_CONVERT_SUBCATEGORY_ID;

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


  $('button.subcategory-delete-btn').click(function(e){
    e.preventDefault();
    var id = $(this).data('id');
    var tdName = $(this).parent().siblings('td.name')[0];
    var name = $(tdName).children('input')[0].value;

    DEFAULT_CONVERT_SUBCATEGORY_ID = undefined;
    bootbox.prompt({
      title: '<span style="color: red">Delete ' + (name) + ' & Convert its products to new one</span>',
      inputType: 'select',
      inputOptions: getSubcategoryOptions(id),
      callback: function (result) {
        if (result == '') result = DEFAULT_CONVERT_SUBCATEGORY_ID;
        $.ajax({
          url: '/dashboard/subcategories/' + id + '/convert_products_to/' + result,
          type: 'DELETE',
          success: function(result) {
            location.reload();
          }
        });
      }
    });
  });

  function getSubcategoryOptions(toDeleteId) {
    var results = [];
    var subcategories = $('tr.list-subcategory');
    for (var i = 0; i < subcategories.length; i++) {
      var subcategory = subcategories[i];
      var id = $(subcategory).data('subcategoryId');
      if (toDeleteId == id) continue;
      var name = $(subcategory).data('subcategoryName');
      results.push({
        text: name,
        value: id
      });
    }
    if (results.length > 0) {
      // to force selection, need to remove first option to have blank value
      DEFAULT_CONVERT_SUBCATEGORY_ID = results[0].value;
      results[0].value = '';
    }
    return results;
  }


});
