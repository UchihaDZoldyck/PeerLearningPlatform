
function PubCourse() {

}

PubCourse.prototype.initUEditor = function () {
    window.ue = UE.getEditor("editor",{
        'serverUrl': '/ueditor/upload/'
    });
};

PubCourse.prototype.listenSubmitEvent = function () {
    var submitBtn = $("#submit-btn");
    submitBtn.click(function () {
        console.log("yo!");
        var title = $("#title-input").val();
        var category_id = $("#category-input").val();
        var video_url = $("#video-input").val();
        var cover_url = $("#cover-input").val();
        var duration = $("#duration-input").val();
        var profile = window.ue.getContent();

        plpajax.post({
            'url': '/cms/pub_course/',
            'data': {
                'title': title,
                'video_url': video_url,
                'cover_url': cover_url,
                'duration': duration,
                'profile': profile,
                'category_id': category_id,
            },
            'success': function (result) {
                if(result['code'] === 200){
                    window.location = window.location.href;
                }
            }
        });
    });
};


PubCourse.prototype.run = function () {
    this.initUEditor();
    this.listenSubmitEvent();
};


$(function () {
    var course = new PubCourse();
    course.run();
});