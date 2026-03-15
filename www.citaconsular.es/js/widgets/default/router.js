define([
    'jquery',
    'underscore',
    'backbone',
    'widgets/default/views/custom',
    'widgets/default/views/services',
    'widgets/default/views/agendas',
    'widgets/default/views/datetime',
    'widgets/default/views/signup',
    'widgets/default/views/summary',
    'widgets/default/views/signin',
    'widgets/default/views/signupfirstappointment',
    'widgets/default/views/signupsecondappointment',
    'widgets/default/models/widgetconfiguration',
    'widgets/default/views/creditcardcapture',
    'widgets/default/views/accountlogin',
    'widgets/default/views/recoverpassword',
    'widgets/default/views/history',
    'widgets/default/views/footer',
    'widgets/default/views/changepassword',
    'widgets/default/views/signedin',
    'widgets/default/views/confirmclient',
    'widgets/default/views/redsys',
    'widgets/default/views/waitinglistsummary'
], function($, _, Backbone, CustomView, ServicesView, AgendasView, DateView, SignUpView, SummaryView, SignInView, SignUpFirstAppointmentView, SignUpSecondAppointmentView, WidgetConfiguration, CreditCardCapture,
    SignInAccountView, RecoverPasswordView, HistoryView, Footer, ChangePasswordView, SignedInView, ConfirmClientView, RedsysView, WaitingListSummaryView) {
    var AppRouter = Backbone.Router.extend({
        routes: {
            '': 'custom',
            'custom': 'custom',
            'selectlanguage/:lang': 'selectlanguage',
            'services': 'services',
            'dochangelanguage/:lang': 'services',
            'selectservice/:id': 'selectservice',
            'selectservices': 'selectservices',
            'agendas': 'agendas',
            'selectagenda/:id': 'selectagenda',
            'datetime': 'datetime',
            'selecttime/:date/:time/:agenda': 'selecttime',
            'error/:error': 'error',
            'signup': 'signup',
            'signupfirstappointment': 'signupfirstappointment',
            'signupsecondappointment': 'signupsecondappointment',
            'signin': 'signin',
            'signedin': 'signedin',
            'summary': 'summary',
            'confirmclient': 'confirmclient',
            'selectpaymentgateway': 'selectpaymentgateway',
            'creditcardcapture': 'creditcardcapture',
            'extraservices': 'extraservices',
            'signinaccount': 'signinaccount',
            'recoverpassword': 'recoverpassword',
            'history': 'history',
            'changepassword': 'changepassword',
            'redsysko': 'redsysko',
            'redsysok/:token': 'redsysok',
            'waitinglist': 'waitinglist',
            'waitinglistsummary': 'waitinglistsummary',
            //            'selectwaitinglist/:date/:time/:agenda'    : 'selectwaitinglist'
        },
        getCurrentPage: function() {
            var someUrlPieces = location.href.split("#");
            if (someUrlPieces.length > 1) {
                someUrlPieces.pop();
            }
            var sCurrengPage = someUrlPieces.join("");
            return sCurrengPage;
        },
        selectlanguage: function(p_sLanguage) {
            var sReloadPage = this.getCurrentPage();
            window.location.assign(sReloadPage + '#dochangelanguage/' + p_sLanguage);
            window.location.reload(true);
        },
        dochangelanguage: function() {
            this.showServices();
        },
        custom: function() {
            if (this.showCustomView()) {
                this.showCustom();
            } else {
                this.navigate("services", {
                    trigger: true,
                    replace: true
                });
            }
        },
        services: function() {
            if (this.showCustomView() && oClientValues_248295.hasOwnProperty('customData') && !oClientValues_248295.customData.hasOwnProperty('backToCustom')) {
                this.navigate("custom", {
                    trigger: true,
                    replace: true
                });
            } else if (this.showCustomView() && !oClientValues_248295.hasOwnProperty('customData')) {
                this.navigate("custom", {
                    trigger: true,
                    replace: true
                });
            } else if (this.showCustomView() && typeof oClientValues_248295.backToServices !== 'undefined' && oClientValues_248295.backToServices === false) {
                this.navigate("custom", {
                    trigger: true,
                    replace: true
                });
            } else {
                this.showServices();
            }
        },
        selectservice: function(p_sServiceId) {
            this.servicesView.setSelected([p_sServiceId]);
            this.navigate("agendas", {
                trigger: true,
                replace: true
            });
        },
        selectservices: function() {
            this.servicesView.setMultiSelect();
            this.navigate("agendas", {
                trigger: true,
                replace: true
            });
        },
        agendas: function() {
            this.checkShowAgendas();
        },
        checkShowAgendas: function() {
            if (typeof oClientValues_248295.backToAgendas === 'undefined' || (typeof oClientValues_248295.backToAgendas !== 'undefined' && oClientValues_248295.backToAgendas === true)) {
                this.showAgendas();
            } else {
                this.navigate("services", {
                    trigger: true,
                    replace: true
                });
                //                this.services();
            }
        },
        selectagenda: function(p_sAgendaId) {
            this.agendasView.setSelected(p_sAgendaId.split('-'));
            this.navigate("datetime", {
                trigger: true,
                replace: true
            });
        },
        datetime: function() {
            this.showDate();
        },
        selecttime: function(p_sDate, p_sTime, p_sAgenda) {
            if (typeof oClientValues_248295.waitingListData !== 'undefined') {
                delete oClientValues_248295.waitingListData;
            }

            oClientValues_248295.selectedDate = p_sDate;
            oClientValues_248295.selectedTime = p_sTime;

            for (var i = 0; i < oClientValues_248295.selectedAgendas.length; i++) {
                if (oClientValues_248295.selectedAgendas[i].id === p_sAgenda) {
                    oClientValues_248295.selectedAgendas = [{
                        id: p_sAgenda,
                        name: oClientValues_248295.selectedAgendas[i].name
                    }];
                }
            }

            if (this.checkShowSignInStep()) {
                this.navigate("signin", {
                    trigger: true,
                    replace: true
                });
            } else {
                this.navigate("signup", {
                    trigger: true,
                    replace: true
                });
            }
        },
        error: function(p_sError) {
            this.showDate(p_sError);
        },
        signup: function() {
            this.footer = new Footer();

            if (this.checkFirstAppointment()) {
                this.navigate("signupfirstappointment", {
                    trigger: true,
                    replace: true
                });
            } else if (this.footer.checkSignedIn()) {
                this.navigate("signedin", {
                    trigger: true,
                    replace: true
                });
            } else if (this.checkSecondAppointment()) {
                this.navigate("signupsecondappointment", {
                    trigger: true,
                    replace: true
                });
            } else {
                this.showSignUp();
            }
        },
        signupfirstappointment: function() {
            this.showSignUpFirstAppointment();
        },
        signupsecondappointment: function() {
            this.showSignUpSecondAppointment();
        },
        signin: function() {
            if (this.checkFirstAppointment()) {
                this.navigate("signupfirstappointment", {
                    trigger: true,
                    replace: true
                });
            } else {
                this.showSignIn();
            }
        },
        signedin: function() {
            if (this.checkFirstAppointment()) {
                this.navigate("signupfirstappointment", {
                    trigger: true,
                    replace: true
                });
            } else {
                this.showSignedIn();
            }
        },
        signinaccount: function() {
            if (this.checkFirstAppointment()) {
                this.navigate("services", {
                    trigger: true,
                    replace: true
                });
            } else {
                this.showSignInAccount();
            }
        },
        history: function() {
            if (this.checkFirstAppointment()) {
                this.navigate("services", {
                    trigger: true,
                    replace: true
                });
            } else {
                this.showHistory();
            }
        },
        recoverpassword: function() {
            if (this.checkFirstAppointment()) {
                this.navigate("services", {
                    trigger: true,
                    replace: true
                });
            } else {
                this.showRecoverPassword();
            }
        },
        changepassword: function() {
            if (this.checkFirstAppointment()) {
                this.navigate("services", {
                    trigger: true,
                    replace: true
                });
            } else {
                this.showChangePassword();
            }
        },
        confirmclient: function() {
            this.showConfirmClient();
            //            this.navigate("selectpaymentgateway", {trigger: true, replace: true});
        },
        selectpaymentgateway: function() {
            this.navigate("creditcardcapture", {
                trigger: true,
                replace: true
            });
        },
        creditcardcapture: function() {
            this.showCreditCardCapture();
        },
        summary: function() {
            this.showSummary();
        },
        initialize: function() {
            //it checks if Analytics is inside the page. Only for new versions of analytics
            //            this.hostPageHasAnalytics = 1;
            //            if(typeof ga !== 'function'){
            //                  this.hostPageHasAnalytics = 0;
            //                  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
            //                    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
            //                    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
            //                    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
            //            }
            //            this.bind('route', this.sendStats);
        },
        sendStats: function() {
            //            var path = Backbone.history.getFragment();    
            //            var host = window.location.host;
            //            if (host === 'localhost' || host.indexOf('192.168') !== -1 
            //                    || host.indexOf('127.0.0.1') !== -1 || host === 'docs.nubesis.com') return; //If you want to test it locally please comment this line

            //            if(this.hostPageHasAnalytics){            
            //                ga('create', 'UA-24297809-13', 'auto', {'name': 'bktWidgetTracker', 'cookieFlags': 'SameSite=None; Secure'});                
            //                ga('bktWidgetTracker.send', 'pageview', {page: "/" + path});            
            //            }
            //            else {
            //                ga('create', 'UA-24297809-13', 'auto', {'cookieFlags': 'SameSite=None; Secure'});                
            //                ga('send', 'pageview', {page: "/" + path});            
            //            }

            //            gtag('create', sBktWidgetGoogleAnalyticsId, 'auto', {'cookieFlags': 'SameSite=None; Secure'});                
            //            gtag('send', 'pageview', {page: "/" + path});   
            //            gtag('set', 'page_path', {page: "/" + path});
        },
        showCustomView: function() {
            if (typeof oClientValues_248295.widgetcustom !== 'undefined') {
                return true;
            }

            return false;
        },
        showCustom: function() {
            if (this.customView) {
                this.customView.start();
            } else {
                this.customView = new CustomView();
                this.customView.start();
            }
        },
        showServices: function() {
            if (this.servicesView) {
                this.servicesView.start();
            } else {
                this.servicesView = new ServicesView();
                this.servicesView.start();
            }
        },
        showAgendas: function() {
            this.checkServices();

            if (this.agendasView) {
                this.agendasView.start();
            } else {
                this.agendasView = new AgendasView();
                this.agendasView.start();
            }
        },
        showDate: function(p_sError) {
            this.checkServices();
            this.checkAgendas();
            if (this.dateView) this.dateView.render(p_sError);
            else this.dateView = new DateView();
        },
        showSignUp: function() {
            this.checkServices();
            this.checkAgendas();
            this.checkDateTime();
            if (this.signUpView) {
                this.signUpView.start();
            } else {
                this.signUpView = new SignUpView();
                this.signUpView.start();
            }
        },
        showSignUpFirstAppointment: function() {
            this.checkServices();
            this.checkAgendas();
            this.checkDateTime();
            if (this.signUpFirstAppointmentView) {
                this.signUpFirstAppointmentView.start();
            } else {
                this.signUpFirstAppointmentView = new SignUpFirstAppointmentView();
                this.signUpFirstAppointmentView.start();
            }
        },
        showSignUpSecondAppointment: function() {
            this.checkServices();
            this.checkAgendas();
            this.checkDateTime();
            if (this.SignUpSecondAppointmentView) {
                this.SignUpSecondAppointmentView.start();
            } else {
                this.SignUpSecondAppointmentView = new SignUpSecondAppointmentView();
                this.SignUpSecondAppointmentView.start();
            }
        },
        showSummary: function() {
            this.summaryView = new SummaryView();
        },
        showSignIn: function() {
            this.checkServices();
            this.checkAgendas();
            this.checkDateTime();
            if (this.signInView) {
                this.signInView.start();
            } else {
                this.signInView = new SignInView();
                this.signInView.start();
            }
        },
        showSignedIn: function() {
            this.checkServices();
            this.checkAgendas();
            this.checkDateTime();
            if (this.signedInView) {
                this.signedInView.start();
            } else {
                this.signedInView = new SignedInView();
                this.signedInView.start();
            }
        },
        showSignInAccount: function() {
            this.footer = new Footer();

            if (this.footer.checkSignedIn() === false) {
                if (this.accountLogin) {
                    this.accountLogin.start();
                } else {
                    this.accountLogin = new SignInAccountView();
                    this.accountLogin.start();
                }
            } else {
                this.navigate("history", {
                    trigger: true,
                    replace: true
                });
            }
        },
        showHistory: function() {
            this.footer = new Footer();

            if (this.footer.checkSignedIn() === true) {
                if (this.accountHistory) {
                    this.accountHistory.start();
                } else {
                    this.accountHistory = new HistoryView();
                    this.accountHistory.start();
                }
            } else {
                this.navigate("signinaccount", {
                    trigger: true,
                    replace: true
                });
            }
        },
        showRecoverPassword: function() {
            this.footer = new Footer();

            if (this.footer.checkSignedIn() === false) {
                if (this.recoverPassword) {
                    this.recoverPassword.start();
                } else {
                    this.recoverPassword = new RecoverPasswordView();
                    this.recoverPassword.start();
                }
            } else {
                this.navigate("history", {
                    trigger: true,
                    replace: true
                });
            }
        },
        showChangePassword: function() {
            this.footer = new Footer();

            if (this.footer.checkSignedIn() === true) {
                if (this.changePassword) {
                    this.changePassword.start();
                } else {
                    this.changePassword = new ChangePasswordView();
                    this.changePassword.start();
                }
            } else {
                this.navigate("signinaccount", {
                    trigger: true,
                    replace: true
                });
            }
        },
        showCreditCardCapture: function() {
            if (this.creditCardCapture) {
                this.creditCardCapture.start();
            } else {
                this.creditCardCapture = new CreditCardCapture();
                this.creditCardCapture.start();
            }
        },
        showConfirmClient: function() {
            if (this.confirmClient) {
                this.confirmClient.start();
            } else {
                this.confirmClient = new ConfirmClientView();
                this.confirmClient.start();
            }
        },
        redirectToStartPage: function() {
            var sReloadPage = this.getCurrentPage();
            location.assign(sReloadPage);

        },
        checkServices: function() {
            if (!this.areServicesSelected()) this.redirectToStartPage();
        },
        checkAgendas: function() {
            if (!this.areAgendasSelected()) this.redirectToStartPage();
        },
        checkDateTime: function() {
            if (!this.isDateTimeSelected()) this.redirectToStartPage();
        },
        checkFirstAppointment: function() {
            this.widgetconfiguration = new WidgetConfiguration();

            if (typeof oClientValues_248295.widgetconfiguration.registration_type !== 'undefined' && parseInt(oClientValues_248295.widgetconfiguration.registration_type) === this.widgetconfiguration.iFirstAppointment) {
                return true;
            }

            return false;
        },
        checkSecondAppointment: function() {
            this.widgetconfiguration = new WidgetConfiguration();

            if (typeof oClientValues_248295.widgetconfiguration.registration_type !== 'undefined' && parseInt(oClientValues_248295.widgetconfiguration.registration_type) === this.widgetconfiguration.iSecondAppointment) {
                return true;
            }

            return false;
        },
        checkShowSignInStep: function() {
            this.widgetconfiguration = new WidgetConfiguration();

            if (typeof oClientValues_248295.widgetconfiguration.registration_type !== 'undefined' && parseInt(oClientValues_248295.widgetconfiguration.registration_type) === this.widgetconfiguration.iShowSignInStep) {
                return true;
            }

            return false;
        },
        areServicesSelected: function() {
            if (typeof oClientValues_248295.selectedServices === 'undefined') {
                return false;
            }
            return true;
        },
        areAgendasSelected: function() {
            if (typeof oClientValues_248295.someAgendas === 'undefined') {
                return false;
            }
            return true;
        },
        isDateTimeSelected: function() {
            if (typeof oClientValues_248295.waitingListData !== 'undefined') {
                return true;
            }

            if (typeof oClientValues_248295.selectedDate === 'undefined' && typeof oClientValues_248295.selectedTime === 'undefined') {
                return false;
            }

            return true;
        },
        redsysko: function() {
            this.redsysView = new RedsysView();
            this.redsysView.ko();
        },
        redsysok: function(p_sToken) {
            this.redsysView = new RedsysView();
            this.redsysView.ok(p_sToken);
        },
        waitinglist: function() {
            if (this.checkShowSignInStep()) {
                this.navigate("signin", {
                    trigger: true,
                    replace: true
                });
            } else {
                this.navigate("signup", {
                    trigger: true,
                    replace: true
                });
            }
        },
        waitinglistsummary: function() {
            if (this.showWaitingListSummaryView) {
                this.showWaitingListSummaryView.start();
            } else {
                this.showWaitingListSummaryView = new WaitingListSummaryView();
                this.showWaitingListSummaryView.start();
            }
        },
        //        selectwaitinglist: function(p_sDate, p_sTime, p_sAgenda){
        //            oClientValues_248295.waitingListData = {
        //                time: p_sTime,
        //                service: oClientValues_248295.selectedServices[0].id,
        //                agenda: p_sAgenda,
        //                date: p_sDate
        //            };            
        //            
        //            Backbone.history.navigate('waitinglist', {trigger: true, replace: true});
        //        }        
    });

    return AppRouter;
});