define(['jquery', 'underscore', 'backbone', 'widgets/default/views/signupfieldslist', 'widgets/default/models/client',
        'widgets/default/models/field', 'widgets/utils', 'widgets/default/views/breadcrumb', 'widgets/default/views/languages', 'widgets/default/models/widgetconfiguration',
        'widgets/default/models/service'
    ],
    function($, _, Backbone, SignupFieldsList, Client, Field, Utils, BreadCrumb, LanguagesSelector, WidgetConfiguration, Event) {
        var SignUpContainer = Backbone.View.extend({
            el: $("#idBktDefaultSignUpContainer"),
            initialize: function() {
                this.iMaxTextareaChars = 500;

                this.field = new Field();
                //            this.bReCaptcha = false;
            },
            events: {
                'click #idIptBktAcceptCondtions': 'removeAcceptContiditionsError',
                'click #idBktDefaultSignUpAcceptText': 'showLegalNotice',
                'click #idDivBktSignUpSubHeaderAccount': 'showSignIn',
                'click #idBktDefaultSignUpConfirmButton': 'handleSubmit',
                'click #idDivReCaptchaSignUp': 'captchaSubmited',
                'click #idDivHCaptchaSignUp': 'captchaSubmited',
                'click #idDivCfCaptchaSignUp': 'captchaSubmited',
            },
            start: function() {
                this.render();
                this.show();
            },
            checkTempEvent: function() {
                if (typeof oClientValues_248295.clientData !== 'undefined' && typeof oClientValues_248295.clientData.attributes !== 'undefined' && oClientValues_248295.clientData.attributes.event_created === true) {
                    var oTempEvent = new Event();
                    oTempEvent.url = Utils.get_server_url() + "freetempevent/";

                    var data = {
                        bktToken: oClientValues_248295.bktToken
                    };

                    oTempEvent.fetch({
                        data: data
                    });
                }
            },
            render: function() {
                if (this.signup_fields) {
                    delete this.signup_fields;
                    delete this.client;
                }

                this.checkTempEvent();
                this.languagesselector = new LanguagesSelector();
                this.widgetconfiguration = new WidgetConfiguration();
                this.signup_fields = new SignupFieldsList();

                this.bindTextareaMaxChars();
                this.setCommnetsField();

                $('#idTxaBktUserComments').removeClass('clsDivBktDefaultInputError');
                $('#idTxaBktUserCommentsError').hide();

                $('#idBktDefaultSignUpCommentsField').show();

                if (typeof oClientValues_248295.waitingListData !== 'undefined') {
                    $('#idBktDefaultSignUpCommentsField').hide();
                }

                $('#idIptBktAcceptCondtions').attr('checked', false);
            },
            captchaSubmited: function() {
                if ($('#idDivReCaptchaSignUp').length) {
                    $('#idBktDefaultSignUpConfirmButton').show();
                }

                if ($('#idDivHCaptchaSignUp').length) {
                    $('#idBktDefaultSignUpConfirmButton').show();
                }

                if ($('#idDivCfCaptchaSignUp').length) {
                    $('#idBktDefaultSignUpConfirmButton').show();
                }
            },
            handleErrors: function(p_someErrors) {
                var that = this;

                _.each(p_someErrors, function(error) {
                    if (error.hasOwnProperty('type') && error.type === 'system') {
                        oClientValues_248295.createEventError = [];
                        oClientValues_248295.createEventError.push({
                            name: error.name,
                            message: error.message
                        });

                        Backbone.history.navigate('error/' + error.name, {
                            trigger: true,
                            replace: true
                        });
                        return;
                    }

                    that.showFieldError(error);
                });
            },
            showFieldError: function(error) {
                var attr = $('#idIptBkt' + error.field).attr("type");

                if (typeof attr !== typeof undefined && attr !== false && attr.toLowerCase() === 'text') {
                    $('#idIptBkt' + error.field).addClass('clsDivBktDefaultInputError');
                }
                //            else{
                $('#idDivBktFieldError' + error.field).html(error.message);
                $('#idDivBktFieldError' + error.field).attr('title', error.message);
                $('#idDivBktFieldError' + error.field).show();
                //            }

                if (error.field === 'comments') {
                    $('#idTxaBktUserComments').addClass('clsDivBktDefaultInputError');

                    $('#idTxaBktUserCommentsError').html(error.message);
                    $('#idTxaBktUserCommentsError').attr('title', error.message);
                    $('#idTxaBktUserCommentsError').show();
                }
            },
            prepareClientFormdata: function() {
                var clientFormData = {};

                var that = this;

                _.each(this.signup_fields.ClientFields, function(field) {
                    clientFormData[field.input_text] = that.getInputValue(field);
                });

                _.each(this.signup_fields.EventFields, function(field) {
                    clientFormData[field.input_text] = that.getInputValue(field);
                });

                if ($("#idIptBktInternationalCodecellphone").is(':visible')) {
                    clientFormData['countries_id'] = $.trim($("#idIptBktInternationalCodecellphone").val());
                }

                if ($("#idIptBktvoucher").is(':visible')) {
                    clientFormData['voucher'] = $.trim($("#idIptBktvoucher").val());
                }

                clientFormData['comments'] = $('#idTxaBktUserComments').val();
                clientFormData['accept_conditions'] = '';

                if ($('#idIptBktAcceptCondtions').prop('checked')) {
                    clientFormData['accept_conditions'] = $.trim($('#idIptBktAcceptCondtions').val());
                }

                if (typeof oClientValues_248295.widgetcustom !== 'undefined') {
                    for (var i = 0; i < oClientValues_248295.widgetcustom.length; i++) {
                        if (oClientValues_248295.widgetcustom[i].hasOwnProperty('custom_field')) {
                            if (typeof bkt_init_widget.fields !== 'undefined' && typeof bkt_init_widget.fields[oClientValues_248295.widgetcustom[i].custom_field] !== 'undefined') {
                                clientFormData[oClientValues_248295.widgetcustom[i].custom_field] = bkt_init_widget.fields[oClientValues_248295.widgetcustom[i].custom_field];
                            }
                        }
                    }
                }

                return clientFormData;
            },
            getDataToFetch: function() {
                var data = $.extend(true, {}, bkt_init_widget);

                data.services = Utils.obtainObjectsIds(oClientValues_248295.selectedServices);
                data.agendas = Utils.obtainObjectsIds(oClientValues_248295.selectedAgendas);
                data.date = oClientValues_248295.selectedDate;
                data.time = oClientValues_248295.selectedTime;
                data.selectedPeople = oClientValues_248295.selectedPeople;

                if (typeof oClientValues_248295.bktToken !== "undefined") {
                    data.bktToken = oClientValues_248295.bktToken;
                }

                _.each(this.client.attributes, function(value, key) {
                    data[key] = encodeURIComponent(value);
                });

                if (typeof oClientValues_248295.waitingListData !== "undefined") {
                    data.waitinglist = oClientValues_248295.waitingListData;
                }

                if (typeof oClientValues_248295.selectedExtras !== 'undefined') {
                    data.extras = Utils.obtainExtrasIds(oClientValues_248295.selectedExtras);
                }

                if ($('#idDivReCaptchaSignUp').length) {
                    data.gct = grecaptcha.getResponse(widgetBktReCaptchaSignUp);
                }

                if ($('#idDivHCaptchaSignUp').length) {
                    data.gct = hcaptcha.getResponse(widgetBktHCaptchaSignUp);
                }

                if ($('#idDivCfCaptchaSignUp').length) {
                    data.gct = document.querySelector('#idDivBktSignUpContainer input[name="cf-turnstile-response"]') ? .value;
                }

                return data;
            },
            checkAndSetClientListenTo: function(event) {
                var identifier = new Date().getTime();

                //            if(this.bReCaptcha === false){
                this.showLoading(identifier);
                //            }

                event.preventDefault();
                event.stopPropagation();

                this.client = new Client({
                    ClientFields: this.signup_fields.ClientFields,
                    EventFields: this.signup_fields.EventFields
                });

                var clientFormData = this.prepareClientFormdata();

                this.client.set(clientFormData);

                oClientValues_248295.clientData = this.client.clone();

                if (!this.client.isValid()) {
                    this.handleErrors(this.client.someErrors);
                    delete this.client;

                    this.hideLoading(identifier);

                    return false;
                }

                delete this.client.ClientFields;
                delete this.client.EventFields;
                delete this.client.attributes.ClientFields;
                delete this.client.attributes.EventFields;

                this.listenTo(this.client, "change", function() {
                    if (this.client.attributes.errors) {
                        if (this.client.attributes.errors.length > 0) {
                            this.handleErrors(this.client.attributes.errors);
                        } else {
                            this.showLoadDataError();
                        }
                    } else {
                        if (typeof this.client.attributes.bktToken !== 'undefined') {
                            oClientValues_248295.bktToken = this.client.attributes.bktToken;
                            delete this.client.attributes.bktToken;
                        }

                        if (typeof this.client.attributes.Prices !== 'undefined') {
                            oClientValues_248295.priceData = this.client.attributes.Prices;
                            delete this.client.attributes.Prices;
                        }

                        oClientValues_248295.clientData = this.client;

                        Backbone.history.navigate('confirmclient', {
                            trigger: true,
                            replace: true
                        });
                    }

                    this.hideLoading(identifier);
                });

                return true;
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
                    //            if($('#idDivReCaptcha').length && this.bReCaptcha === false){
                    //                this.bReCaptcha = true;
                    //
                    //                grecaptcha.reset();
                    //                grecaptcha.execute();
                    //            }
                    //            else{
                    //                if($('#idDivReCaptcha').length && this.bReCaptcha === true){
                    //                    data.gct = grecaptcha.getResponse();
                    //                    this.bReCaptcha = false;
                    //                }

                    this.client.fetch({
                        data: data,
                        error: (function() {
                            that.showLoadDataError();
                        })
                    });
                    //            }
                }
            },
            bindTextareaMaxChars: function() {
                var that = this;

                $('#idTxaBktUserComments').keypress(function(event) {
                    var sVal = $('#idTxaBktUserComments').val();
                    var iChars = sVal.length;

                    var iRemain = parseInt(that.iMaxTextareaChars - iChars);

                    if (iRemain <= 0 && event.which !== 0 && event.charCode !== 0) {
                        $('#idTxaBktUserComments').val((sVal).substring(0, iChars - 1));
                    }
                });
            },
            getInputValue: function(field) {
                var oInput = $('#idIptBkt' + field.input_text);

                var sVal = "";

                if (parseInt(field.type) === this.field.iTypeCheckbox) {
                    if ($(oInput).prop('checked')) {
                        sVal = $.trim($(oInput).val());
                    }
                } else if (parseInt(field.type) === this.field.iTypeDrop) {
                    if (parseInt($.trim($(oInput).val())) !== -1) {
                        sVal = $.trim($(oInput).val());
                    }
                } else {
                    sVal = $.trim($(oInput).val());
                }

                return sVal;
            },
            removeAcceptContiditionsError: function() {
                $('#idDivBktFieldErroraccept_conditions').hide();
            },
            show: function() {
                var breadCrumb = new BreadCrumb();
                breadCrumb.show('#idBktDefaultSignUpContainer .clsDivSubHeaderBreadcrumbsText');
                $(".clsBktDefaultErrorContainer").hide();
                $(".clsBktDefaultWindow").hide();
                $('#idTxaSignInUserComments').val('');
                $("#idFormSignUpContainer").show();

                if ($('#idDivReCaptchaSignUp').length) {
                    $('#idBktDefaultSignUpConfirmButton').hide();
                    grecaptcha.reset(widgetBktReCaptchaSignUp);
                }

                if ($('#idDivHCaptchaSignUp').length) {
                    $('#idBktDefaultSignUpConfirmButton').hide();
                    hcaptcha.reset(widgetBktHCaptchaSignUp);
                }

                if ($('#idDivCfCaptchaSignUp').length) {
                    turnstile.remove(widgetBktCfCaptchaSignUp);

                    onLoadBktCfCaptchaSignUp();

                    $('#idBktDefaultSignUpConfirmButton').hide();
                    //                turnstile.reset(widgetBktCfCaptchaSignUp);
                }

                this.$el.show();
            },
            showLegalNotice: function() {
                $('#idBktWidgetDefaultBodyContainer').append('<div class="clsBktDefaultPopupOverlay" style="display: block;"></div>');
                $('#idBktDefaultLegalNoticeContainer').show();

                $('#idBktDefaultLegalNoticeHeaderClose').click(function() {
                    $('#idBktDefaultLegalNoticeContainer').hide();
                    $('.clsBktDefaultPopupOverlay').hide();
                });
            },
            showSignIn: function() {
                Backbone.history.navigate('signin', {
                    trigger: true,
                    replace: true
                });
            },
            showLoadDataError: function() {
                $("#idFormSignUpContainer").hide();

                $("#idBktDefaultSignUpErrorContainer").show();
                $('.clsDivBktWidgetDefaultLoadingContainer').remove();
            },
            showLoading: function(p_iIdentifier) {
                $('#idBktWidgetDefaultBodyContainer').prepend('<div class="clsDivBktWidgetDefaultLoadingContainer clsDivBktLoadingContainer' + p_iIdentifier + '"><div class="clsDivBktWidgetDefaultLoading"></div></div>');
            },
            hideLoading: function(p_iIdentifier) {
                $('.clsDivBktLoadingContainer' + p_iIdentifier).remove();
            },
            setCommnetsField: function() {
                if (typeof oClientValues_248295.clientData !== 'undefined' && typeof oClientValues_248295.clientData.attributes.comments !== 'undefined') {
                    $('#idTxaBktUserComments').val(oClientValues_248295.clientData.attributes.comments);
                } else {
                    $('#idTxaBktUserComments').val('');
                }

                if (typeof oClientValues_248295.widgetlabel.label_users_comments !== 'undefined' && $.trim(oClientValues_248295.widgetlabel.label_users_comments).length > 0) {
                    $('#idTxaBktUserComments').attr("placeholder", $.trim(oClientValues_248295.widgetlabel.label_users_comments));
                }
            }
        });

        return SignUpContainer;
    });