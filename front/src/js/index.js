function Banner() {
    this.viewportWidth = 735;
    this.BannerViewport = $("#viewport");
    this.index = 1;
    this.bannerUL = $("#banner-ul");
    this.liList = this.bannerUL.children("li");
    this.liCount = this.liList.length;
    this.leftArrow = $(".left-arrow");
    this.rightArrow = $(".right-arrow");
    this.bannerControl = $(".banner-control");
}

Banner.prototype.initBanner = function () {
    var self = this;
    var firstBanner = self.liList.eq(0).clone();
    var lastBanner = self.liList.eq(self.liCount - 1).clone();
    self.bannerUL.append(firstBanner);
    self.bannerUL.prepend(lastBanner);
    self.bannerUL.css({"width": self.viewportWidth * (self.liCount + 2), "left": -self.viewportWidth});
}


Banner.prototype.initBannerControl = function () {
    var self = this;

    for (var i = 0; i < self.liCount; i++) {
        var circle = $("<li></li>");
        self.bannerControl.append(circle);
        if (i === 0) {
            circle.addClass("active");
        }
    }
    self.bannerControl.css({"width": self.liCount * 12 + 2 * 2 + (self.liCount - 1) * 4})
}


Banner.prototype.animate = function () {
    var self = this;
    self.bannerUL.stop().animate({"left": -self.viewportWidth * self.index}, 500);
    var index = self.index;
    if (index === 0) {
        index = self.liCount - 1;
    } else if (index === self.liCount + 1) {
        index = 0
    } else {
        index = self.index - 1;
    }
    self.bannerControl.children("li").eq(index).addClass("active").siblings().removeClass("active");
}


Banner.prototype.toggleArrow = function (isShow) {
    var self = this;
    if (isShow == true) {
        self.leftArrow.show();
        self.rightArrow.show();
    } else {
        self.leftArrow.hide();
        self.rightArrow.hide();
    }
};

Banner.prototype.looping = function () {
    var self = this;

    self.timer = setInterval(function () {
        //console.log("before: ", self.index);
        if (self.index >= self.liCount + 1) {
            self.bannerUL.css({"left": -self.viewportWidth});
            self.index = 2;
        } else {
            self.index++;
        }
        //console.log("After: ", self.index);
        //console.log("==========================")
        self.animate();
    }, 3000)
}

Banner.prototype.ListenHoverBannerControl = function () {
    var self = this;
    self.bannerControl.children("li").each(function (index, obj) {
        $(obj).hover(function () {
            self.index = index + 1;
            self.animate();
            clearInterval(self.timer);
        }, function () {
            self.looping();
        })
    })
}

Banner.prototype.ListenClickArrow = function () {
    var self = this;
    self.leftArrow.click(function () {
        if (self.index === 0) {
            self.bannerUL.css({"left": -self.viewportWidth * self.liCount})
            self.index = self.liCount - 1;
        } else {
            self.index--;
        }
        self.animate();
    })

    self.rightArrow.click(function () {
        if (self.index === self.liCount + 1) {
            self.bannerUL.css({"left": -self.viewportWidth})
            self.index = 2;
        } else {
            self.index++;
        }
        self.animate();
    })
};

Banner.prototype.listenBannerHover = function () {
    var self = this;
    this.BannerViewport.hover(function () {
        clearInterval(self.timer);
        self.toggleArrow(true);
    }, function () {
        self.looping();
        self.toggleArrow(false);
    })
};


Banner.prototype.run = function () {
    this.initBanner();
    this.initBannerControl();
    this.looping();
    this.ListenClickArrow();
    this.listenBannerHover();
    this.ListenHoverBannerControl();
};


function Index() {
    var self = this;
    self.page = 2;
    self.category_id = 0;
    self.loadBtn = $("#load-more-btn");


}


Index.prototype.listenLoadMoreEvent = function () {
    var self = this;
    var loadBtn = $("#load-more-btn");
    loadBtn.click(function () {
        plpajax.get({
            'url': '/news/list/',
            'data': {
                'p': self.page,
                                'category_id': self.category_id
            },
            'success': function (result) {
                if (result['code'] === 200) {
                    var newses = result['data'];
                    if (newses.length > 0) {
                        var tpl = template("news-item", {"newses": newses});
                        var ul = $(".list-inner-group");
                        ul.append(tpl);
                        self.page += 1;
                    } else {
                        loadBtn.hide();
                    }
                }
            }
        });
    });
};

Index.prototype.listenCategorySwitchEvent = function () {
    var self = this;
    var tabGroup = $(".list-tab");
    tabGroup.children().click(function () {
        // this: <li></li>
        var li = $(this);
        var category_id = li.attr("data-category");
        var page = 1;
        plpajax.get({
            'url': '/news/list/',
            'data': {
                'category_id': category_id,
                'p': page
            },
            'success': function (result) {
                if(result['code'] === 200){
                    var newses = result['data'];
                    var tpl = template("news-item",{"newses":newses});
                    var newsListGroup = $(".list-inner-group");
                    //empty() -> delete all the children elements of this tag
                    newsListGroup.empty();
                    newsListGroup.append(tpl);
                    self.page = 2;
                    self.category_id = category_id;
                    li.addClass('active').siblings().removeClass('active');
                    self.loadBtn.show();
                }
            }
        });
    });
};



Index.prototype.run = function () {
    var self = this;
    self.listenLoadMoreEvent();
    self.listenCategorySwitchEvent();
};


$(function () {
    var banner = new Banner();
    banner.run();

    var index = new Index();
    index.run();
});