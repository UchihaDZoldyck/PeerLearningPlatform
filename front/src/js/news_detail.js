function NewsList() {

}

// function Likeing(){
//
// }

// Likeing.prototype.listenLikeBtn = function(){
//     var likeBtn = $('.like-btn');
//     likeBtn.off().on('click', function () {
//         console.log("You like me?");
//     });
// };

NewsList.prototype.listenSubmitEvent = function () {
    var submitBtn = $('.submit-comment-btn');
    var textarea = $("textarea[name='comment']");
    submitBtn.off().on('click', function () {
        var content = textarea.val();
        var news_id = submitBtn.attr('data-news-id');
        plpajax.post({
            'url': '/news/public_comment/',
            'data': {
                'content': content,
                'news_id': news_id
            },
            'success': function (result) {
                //console.log(result);
                if (result['code'] === 200) {
                    var comment = result['data'];
                    var tpl = template('comment-item', {"comment": comment});
                    var commentListGroup = $(".comment-list");
                    commentListGroup.prepend(tpl);//add to the first one (append add to the last one)
                    window.messageBox.showSuccess('Comment Success!');
                    textarea.val("");
                } else {
                    window.messageBox.showError(result['message']);
                }
            }
        });
    });
};

NewsList.prototype.run = function () {
    this.listenSubmitEvent();
};

// Likeing.prototype.run = function(){
//     this.listenLikeBtn();
// };


$(function () {
    var newsList = new NewsList();
    newsList.run();
});

// $(function () {
//     var liking = new Likeing();
//     liking.run();
// });

