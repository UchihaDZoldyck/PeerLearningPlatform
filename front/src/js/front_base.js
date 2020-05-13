//for nav bar
function FrontBase() {
}

FrontBase.prototype.run = function () {
    var self = this;
    self.listenAuthBoxHover();
};

FrontBase.prototype.listenAuthBoxHover = function () {
    var authBox = $(".auth-box");
    var userMoreBox = $(".user-more-box");
    authBox.hover(function () {
        userMoreBox.show();
    }, function () {
        userMoreBox.hide();
    });
};

//For login and register
function Auth() {
    var self = this;
    self.maskWrapper = $('.mask-wrapper');
    self.scrollWrapper = $(".scroll-wrapper");
    self.smsCaptcha = $(".sms-captcha-btn");
}

function TopBtn() {
    var self = this;
    self.topBtn = $('#myBtn');
}

TopBtn.prototype.run = function () {
    var self = this;
    self.listenScroll();
};
TopBtn.prototype.listenScroll = function () {
    var self = this;
    window.scroll(function () {
        self.scrollFunction();
    });
};

TopBtn.prototype.scrollFunction = function () {
    var self = this;

    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        self.topBtn.style.display = "block";
    } else {
        self.topBtn.style.display = "none";
    }
};

TopBtn.prototype.listenTopBtn = function () {
    var self = this;
    self.topBtn.click(function () {
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    });
}


Auth.prototype.run = function () {
    var self = this;
    self.listenShowHideEvent();
    self.listenSwitchEvent();
    self.listenSigninEvent();
    self.listenImgCaptchaEvent();
    self.listenSmsCaptchaEvent();
    self.listenSignupEvent();

};

Auth.prototype.showEvent = function () {
    var self = this;
    self.maskWrapper.show();
};

Auth.prototype.hideEvent = function () {
    var self = this;
    self.maskWrapper.hide();
};

Auth.prototype.smsSuccessEvent = function () {
    var self = this;
    messageBox.showSuccess('Send email success!');
    self.smsCaptcha.addClass('disabled');
    var count = 30;
    self.smsCaptcha.unbind('click');
    var timer = setInterval(function () {
        self.smsCaptcha.text(count + 's');
        count -= 1;
        if (count <= 0) {
            clearInterval(timer);
            self.smsCaptcha.removeClass('disabled');
            self.smsCaptcha.text('Send Code');
            self.listenSmsCaptchaEvent();
        }
    }, 1000);
};


Auth.prototype.listenShowHideEvent = function () {
    var self = this;
    var signinBtn = $('.signin-btn');
    var signupBtn = $('.signup-btn');
    var closeBtn = $('.close-btn')
    var scrollWrapper = $('.scroll-wrapper');
    signinBtn.click(function () {
        self.showEvent();
        self.scrollWrapper.css({"left": 0});
    });
    signupBtn.click(function () {
        self.showEvent();
        self.scrollWrapper.css({"left": -400});

    });
    closeBtn.click(function () {
        self.hideEvent();
    });
};

Auth.prototype.listenSwitchEvent = function () {
    var self = this;
    var switcher = $(".switch");
    switcher.click(function () {

        var currentLeft = self.scrollWrapper.css("left");
        currentLeft = parseInt(currentLeft);
        if (currentLeft < 0) {
            self.scrollWrapper.animate({"left": "0"});
        } else {
            self.scrollWrapper.animate({"left": "-400px"});
        }
    });
};

Auth.prototype.listenImgCaptchaEvent = function () {
    var imgCaptcha = $('.img-captcha');
    imgCaptcha.click(function () {
        //console.log("ssss");
        imgCaptcha.attr("src", "/account/img_captcha/" + "?random=" + Math.random())
    });

};


Auth.prototype.listenSmsCaptchaEvent = function () {
    var self = this;
    var smsCaptcha = $(".sms-captcha-btn");
    var emailAddressInput = $(".signup-group input[name='email']");
    smsCaptcha.click(function () {
        var emailAddress = emailAddressInput.val();
        if (!emailAddress) { // You need to check whether email is valid here
            messageBox.showInfo("Please input your email address!");
        } else {
            plpajax.get({
                'url': '/account/sms_captcha',
                'data': {
                    'email': emailAddress
                },
                'success': function (result) {
                    if (result['code'] == 200) {
                        self.smsSuccessEvent();
                    }
                },
                'fail': function (error) {
                    console.log(error)
                }
            });
        }

    });
};

Auth.prototype.listenSigninEvent = function () {
    var self = this;
    var signinGroup = $('.signin-group');
    var emailInput = signinGroup.find("input[name='email']");
    var passwordInput = signinGroup.find("input[name='password']");
    var rememberInput = signinGroup.find("input[name='remember']");

    var submitBtn = signinGroup.find(".submit-btn");
    submitBtn.click(function () {
        var email = emailInput.val();
        var password = passwordInput.val();
        var remember = rememberInput.prop("checked");
        plpajax.post({
            'url': '/account/login/',
            'data': {
                'email': email,
                'password': password,
                'remember': remember ? 1 : 0
            },
            'success': function (result) {
                self.hideEvent();
                window.location.reload();
            },
        });

    });
};

Auth.prototype.listenSignupEvent = function () {
    var signupGroup = $('.signup-group');
    var submitBtn = signupGroup.find('.submit-btn');
    submitBtn.click(function (event) {
        event.preventDefault();
        console.log('man!');
        var emailInput = signupGroup.find("input[name='email']");
        var usernameInput = signupGroup.find("input[name='username']");
        var imgCaptchaInput = signupGroup.find("input[name='img_captcha']");
        var password1Input = signupGroup.find("input[name='password1']");
        var password2Input = signupGroup.find("input[name='password2']");
        var smsCaptchaInput = signupGroup.find("input[name='sms_captcha']");

        var email = emailInput.val();
        var username = usernameInput.val();
        var img_captcha = imgCaptchaInput.val();
        var password1 = password1Input.val();
        var password2 = password2Input.val();
        var sms_captcha = smsCaptchaInput.val();
        console.log('dude');
        plpajax.post({
            'url': '/account/register/',
            'data': {
                'email': email,
                'username': username,
                'img_captcha': img_captcha,
                'password1': password1,
                'password2': password2,
                'sms_captcha': sms_captcha
            },
            'success': function (result) {
                if (result['code'] == 200)
                    window.location.reload();
            }
        });
    });
};


$(function () {
    var auth = new Auth();
    auth.run();
});

$(function () {
    var frontBase = new FrontBase();
    frontBase.run();
});
$(function () {
    var TOP = new TopBtn();
    TOP.run();
});
$(function () {
    if (template) {
        template.defaults.imports.timeSince = function (dateValue) {
            var date = new Date(dateValue);
            var datets = date.getTime();
            var nowts = (new Date()).getTime();
            var timestamp = (nowts - datets) / 1000;

            if (timestamp < 60) {
                return 'Just Now';
            } else if (timestamp >= 60 && timestamp < 60 * 60) {
                minutes = parseInt(timestamp / 60);
                return minutes + ' Minutes';
            } else if (timestamp >= 60 * 60 && timestamp < 60 * 60 * 24) {
                hours = parseInt(timestamp / 60 / 60);
                return hours + ' Hours';
            } else if (timestamp >= 60 * 60 * 24 && timestamp < 60 * 60 * 24 * 30) {
                days = parseInt(timestamp / 60 / 60 / 24);
                return days + ' Days';
            } else {
                var year = date.getFullYear();
                var month = date.getMonth();
                var day = date.getDay();
                var hour = date.getHours();
                var minute = date.getMinutes();
                return hour + ":" + minute + " " + day + "/" + month + "/" + year;

            }


        }
    }
});



