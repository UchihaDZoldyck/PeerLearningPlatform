function NewsCategory() {

};

NewsCategory.prototype.run = function () {
    var self = this;
    self.listenAddCategoryEvent();
    self.listenEditCategoryEvent();
    self.listenDeleteCategoryEvent();
};

NewsCategory.prototype.listenAddCategoryEvent = function () {
    var addBtn = $('#add-btn');
    addBtn.click(function () {
        plpalert.alertOneInput({
            'title': 'Add new category',
            'placeholder': 'Please input new category',
            'confirmCallback': function (inpuValue) {
                plpajax.post({
                    'url': '/cms/add_news_category/',
                    'data': {
                        'name': inpuValue
                    },
                    'success': function (result) {
                        if (result['code'] === 200) {
                            console.log(result);
                            window.location.reload();
                        } else {
                            plpalert.close();
                        }
                    }
                });
            }
        });
    });
};

NewsCategory.prototype.listenEditCategoryEvent = function () {
    var self = this;
    var editBtn = $(".edit-btn");
    editBtn.click(function () {
        var currentBtn = $(this);
        var tr = currentBtn.parent().parent();
        var pk = tr.attr('data-pk');
        var name = tr.attr('data-name');
        plpalert.alertOneInput({
            'title': 'Name change',
            'placeholder': 'Please input new name of category',
            'value': name,
            'confirmCallback': function (inputValue) {
                plpajax.post({
                    'url': '/cms/edit_news_category/',
                    'data': {
                        'pk': pk,
                        'name': inputValue
                    },
                    'success': function (result) {
                        if (result['code'] === 200) {
                            window.location.reload();
                        } else {
                            plpalert.close();
                        }
                    }
                });
            }
        });
    });
};

NewsCategory.prototype.listenDeleteCategoryEvent = function () {
    var deleteBtn = $(".delete-btn");
    deleteBtn.click(function () {
        var currentBtn = $(this);
        var tr = currentBtn.parent().parent();
        var pk = tr.attr('data-pk');
        plpalert.alertConfirm({
            'title': 'Are you sure you want to delete it?',
            'confirmCallback': function () {
                plpajax.post({
                    'url': '/cms/delete_news_category/',
                    'data': {
                        'pk': pk
                    },
                    'success': function (result) {
                        if (result['code'] === 200) {
                            window.location.reload();
                        }
                    }
                });
            }
        });
    });
};


$(function () {
    var category = new NewsCategory();
    category.run();
});