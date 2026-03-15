var widgetBktHCaptchaSignUp;
var widgetBktHCaptchaSignIn;

var onLoadBktHCaptchaSignUp = function() {
    if (jQuery('#idDivHCaptchaSignUp').length) {
        widgetBktHCaptchaSignUp = hcaptcha.render('idDivHCaptchaSignUp', {
            'sitekey': '38663b6a-85dc-4346-965e-f066cd8e7d26',
            'callback': onHCaptchaSubmitedSignUp
        });
    }
};

var onHCaptchaSubmitedSignUp = function() {
    $('#idDivHCaptchaSignUp').click();
};

var onLoadBktHCaptchaSignIn = function() {
    if (jQuery('#idDivHCaptchaSignIn').length) {
        widgetBktHCaptchaSignIn = hcaptcha.render('idDivHCaptchaSignIn', {
            'sitekey': '38663b6a-85dc-4346-965e-f066cd8e7d26',
            'callback': onHCaptchaSubmitedSignIn
        });
    }
};

var onHCaptchaSubmitedSignIn = function() {
    $('#idDivHCaptchaSignIn').click();
};

//# sourceURL=captcha.js