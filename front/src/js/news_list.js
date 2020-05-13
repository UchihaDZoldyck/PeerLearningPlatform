function CMSNewsList() {

}
CMSNewsList.prototype.initDatePicker = function () {
    var startPicker = $("#start-picker");
    var endPicker = $("#end-picker");

    var todayDate = new Date();
    var todayStr = todayDate.getFullYear() + '/' + (todayDate.getMonth()+1) + '/' + todayDate.getDate();
    var options = {
        'showButtonPanel': true,
        'format': 'yyyy/mm/dd',
        'startDate': '2017/6/1',
        'endDate': todayStr,
        'todayBtn': 'linked',
        'todayHighlight': true,
        'clearBtn': true,
        'autoclose': true
    };

    startPicker.datepicker(options);
    endPicker.datepicker(options);
};

CMSNewsList.prototype.listenDeleteEvent = function () {
    var deleteBtns = $(".delete-btn");
    deleteBtns.click(function () {
        var btn = $(this);
        var news_id = btn.attr('data-news-id');
        plpalert.alertConfirm({
            'text': 'Are you sure you want to delete this news?',
            'confirmCallback': function () {
                plpajax.post({
                    'url': '/cms/delete_news/',
                    'data': {
                        'news_id': news_id
                    },
                    'success': function (result) {
                        if(result['code'] === 200){
                            window.location = window.location.href;
                            // window.location.reload()
                        }
                    }
                });
            }
        });
    });
};


CMSNewsList.prototype.run = function () {
    var self = this;
    self.initDatePicker();
    self.listenDeleteEvent();
};

$(function () {
    var newsList = new CMSNewsList();
    newsList.run();
});