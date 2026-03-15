define(['jquery', 'underscore', 'backbone', 'widgets/default/views/signup', 'widgets/utils', 'widgets/default/models/widgetconfiguration'],
    function($, _, Backbone, SignUpContainer, Utils, WidgetConfiguration) {
        var SignUpFirstAppointmentContainer = SignUpContainer.extend({
            initialize: function() {
                this.widgetconfiguration = new WidgetConfiguration();
                this.checkFirstAppointment();

                SignUpFirstAppointmentContainer.__super__.initialize();
            },
            checkFirstAppointment: function() {
                if (typeof oClientValues_248295.widgetconfiguration.registration_type !== 'undefined' && parseInt(oClientValues_248295.widgetconfiguration.registration_type) === this.widgetconfiguration.iFirstAppointment) {
                    $('#idDivBktSignUpSubHeader').remove();
                }
            },
            handleSubmit: function(event) {
                if (this.checkAndSetClientListenTo(event) === true) {
                    this.submit(event);
                }
            },
            submit: function(event) {
                var that = this;

                var data = this.getDataToFetch(event);

                if (data === false) {
                    return false;
                }

                this.client.url = Utils.get_server_url() + "signupfirstappointment/";

                if ($('#idDivReCaptchaSignUp.clsBktReCaptchaSignUp').length) {
                    grecaptcha.ready(function() {
                        grecaptcha.execute('6LdqftIZAAAAADcngqKaM97DRGXV47ca0Xk8spwH', {
                            action: 'submit'
                        }).then(function(token) {
                            data.gctoken = token;

                            that.client.fetch({
                                data: data,
                                error: (function() {
                                    that.showLoadDataError();
                                })
                            });
                        });
                    });
                } else {
                    if ($('#idDivReCaptcha').length && this.bReCaptcha === false) {
                        this.bReCaptcha = true;

                        grecaptcha.reset();
                        grecaptcha.execute();
                    } else {
                        if ($('#idDivReCaptcha').length && this.bReCaptcha === true) {
                            data.gct = grecaptcha.getResponse();
                            this.bReCaptcha = false;
                        }

                        this.client.fetch({
                            data: data,
                            error: (function() {
                                that.showLoadDataError();
                            })
                        });
                    }
                }
            }


        });

        return SignUpFirstAppointmentContainer;
    });