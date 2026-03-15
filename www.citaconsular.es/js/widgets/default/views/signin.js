define(['jquery', 'underscore', 'backbone', 'widgets/default/views/signinfieldslist', 'widgets/default/views/breadcrumb', 'widgets/default/models/client',
        'widgets/default/models/field', 'widgets/utils', 'widgets/default/views/languages', 'widgets/default/models/widgetconfiguration', 'widgets/default/models/service',
        'widgets/default/views/footer'
    ],
    function($, _, Backbone, SigninFieldsList, BreadCrumb, Client, Field, Utils, LanguagesSelector, WidgetConfiguration, Event, Footer) {
        var SignInContainer = Backbone.View.extend({
            el: $("#idBktDefaultSignInContainer"),
            initialize: function() {
                $(this.el).off();

                this.iMaxTextareaChars = 200;

                this.oField = new Field();

                this.identifier = new Date().getTime();
                this.footer = new Footer();
            },
            start: function() {
                this.render();
                this.show();
            },
            render: function() {
                this.checkTempEvent();

                this.languagesselector = new LanguagesSelector();
                this.widgetconfiguration = new WidgetConfiguration();
                this.footer = new Footer();
                this.signin_fields = new SigninFieldsList();

                this.bindTextareaMaxChars();
                this.setCommnetsField();

                $('#idTxaSignInUserComments').removeClass('clsDivBktDefaultInputError');
                $('#idTxaSignInUserCommentsError').hide();

                $('#idBktDefaultSignInCommentsField').show();

                if (typeof oClientValues_248295.waitingListData !== 'undefined') {
                    $('#idBktDefaultSignInCommentsField').hide();
                }

                this.showSubHeaderExtra();
            },
            showSubHeaderExtra: function() {
                $('#idBktDefaultSignInContainer .clsDivBktSubHeaderExtra').show();
                $('#idBktDefaultSignInContainer #idBktDefaultSignInClientFields').show();
                $('#idBktDefaultSignInContainer #idBktDefaultSignInRecoveryPasswordContainer').show();
                $('#idBktDefaultSignInContainer #idBktDefaultSignedInAttachFileContainer').hide();
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

                    delete oTempEvent;
                }
            },
            events: {
                'click #idBktDefaultSignInConfirmButton': 'handleSubmit',
                'click #idDivBktSignInSubHeaderNewAccount': 'showSignUp',
                'change #idSelBktSignInLoginType': 'changeLoginType',
                'click #idDivReCaptchaSignIn': 'captchaSubmited',
                'click #idDivHCaptchaSignIn': 'captchaSubmited',
                'click #idDivCfCaptchaSignIn': 'captchaSubmited',
            },
            show: function() {
                var breadCrumb = new BreadCrumb();
                breadCrumb.show('#idBktDefaultSignInContainer .clsDivSubHeaderBreadcrumbsText');
                $(".clsBktDefaultErrorContainer").hide();
                $(".clsBktDefaultWindow").hide();
                $(".clsDivBktDefaultFieldError").hide();

                $("#idFormSignInContainer").show();

                if ($('#idDivReCaptchaSignIn').length) {
                    $('#idBktDefaultSignInConfirmButton').hide();
                    grecaptcha.reset(widgetBktReCaptchaSignIn);
                }

                if ($('#idDivHCaptchaSignIn').length) {
                    $('#idBktDefaultSignInConfirmButton').hide();
                    $('#idBktDefaultSignedInConfirmButton').hide();
                    hcaptcha.reset(widgetBktHCaptchaSignIn);
                }

                if ($('#idDivCfCaptchaSignIn').length) {
                    turnstile.remove(widgetBktCfCaptchaSignIn);

                    onLoadBktCfCaptchaSignIn();

                    $('#idBktDefaultSignInConfirmButton').hide();
                    $('#idBktDefaultSignedInConfirmButton').hide();
                    //                turnstile.reset(widgetBktCfCaptchaSignIn);
                }

                this.$el.show();
            },
            captchaSubmited: function() {
                if ($('#idDivReCaptchaSignIn').length) {
                    $('#idBktDefaultSignInConfirmButton').show();
                }

                if ($('#idDivHCaptchaSignIn').length) {
                    $('#idBktDefaultSignInConfirmButton').show();
                    //                $('#idBktDefaultSignedInConfirmButton').show();
                }

                if ($('#idDivCfCaptchaSignIn').length) {
                    $('#idBktDefaultSignInConfirmButton').show();
                    //                $('#idBktDefaultSignedInConfirmButton').show();
                }
            },
            handleSubmit: function(event) {
                this.showLoading();

                event.preventDefault();
                event.stopPropagation();

                var clientFormData = this.getFieldsData();

                var someErrors = this.getFieldsErrorsData(clientFormData);

                this.client.set(clientFormData);
                oClientValues_248295.clientData = this.client.clone();

                if (someErrors && someErrors.length > 0) {
                    //                this.handleErrors(this.client.someErrors);
                    this.handleErrors(someErrors);
                    delete this.client;

                    this.hideLoading();
                } else {
                    this.doSubmit();
                }
            },
            doSubmit: function() {
                delete this.client.ClientFields;
                delete this.client.EventFields;
                delete this.client.attributes.ClientFields;
                delete this.client.attributes.EventFields;

                this.listenTo(this.client, "change", function() {
                    if (this.client.attributes.errors) {
                        this.handleErrors(this.client.attributes.errors);
                    } else {
                        if (this.doAttach() === true) {
                            this.doConfirmClientNavigate(this.client);
                        }
                    }

                    this.hideLoading();
                });

                this.fetchData();
            },
            doConfirmClientNavigate: function(p_someClient) {
                if (typeof p_someClient.attributes.bktToken !== 'undefined') {
                    oClientValues_248295.bktToken = p_someClient.attributes.bktToken;
                    delete p_someClient.attributes.bktToken;
                }

                if (typeof p_someClient.attributes.Prices !== 'undefined') {
                    oClientValues_248295.priceData = p_someClient.attributes.Prices;
                    delete p_someClient.attributes.Prices;
                }

                oClientValues_248295.clientData = p_someClient;

                Backbone.history.navigate('confirmclient', {
                    trigger: true,
                    replace: true
                });
            },
            doAttach: function() {
                return true;
            },
            handleErrors: function(p_someErrors) {
                var that = this;

                $('.clsDivBktDefaultInputError').removeClass();

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
                var attr = $('#idIptBktSignIn' + error.field).attr("type");

                if (typeof attr !== typeof undefined && attr !== false && (attr.toLowerCase() === 'text' || attr.toLowerCase())) {
                    $('#idIptBktSignIn' + error.field).addClass('clsDivBktDefaultInputError');
                }
                //            else{
                $('#idDivBktSignInFieldError' + error.field).html(error.message);
                $('#idDivBktSignInFieldError' + error.field).attr('title', error.message);
                $('#idDivBktSignInFieldError' + error.field).show();
                //            }

                if (error.field === 'comments') {
                    $('#idTxaSignInUserComments').addClass('clsDivBktDefaultInputError');

                    $('#idTxaSignInUserCommentsError').html(error.message);
                    $('#idTxaSignInUserCommentsError').attr('title', error.message);
                    $('#idTxaSignInUserCommentsError').show();
                }

                if (error.field === 'attach') {
                    $('#idIptBktSignedInAttachFile').addClass('clsDivBktDefaultInputError');

                    $('#idDivBktFieldErrorattach').html(error.message);
                    $('#idDivBktFieldErrorattach').attr('title', error.message);
                    $('#idDivBktFieldErrorattach').show();
                }
            },
            showSignUp: function(event) {
                Backbone.history.navigate('signup', {
                    trigger: true,
                    replace: true
                });
            },
            bindTextareaMaxChars: function() {
                var that = this;

                $('#idTxaSignInUserComments').keypress(function(event) {
                    var sVal = that.$('#idTxaSignInUserComments').val();
                    var iChars = sVal.length;

                    var iRemain = parseInt(that.iMaxTextareaChars - iChars);

                    if (iRemain <= 0 && event.which !== 0 && event.charCode !== 0) {
                        that.$('#idTxaSignInUserComments').val((sVal).substring(0, iChars - 1));
                    }
                });
            },
            changeLoginType: function(event) {
                $('#idIptBktSignInlogin').attr('placeholder', '* ' + $('#idSelBktSignInLoginType :selected').text());
            },
            getInputValue: function(field) {
                var oInput = $('#idIptBktSignIn' + field.input_text);

                var sVal = "";

                if (parseInt(field.type) === this.oField.iTypeCheckbox) {
                    if ($(oInput).prop('checked')) {
                        sVal = $.trim($(oInput).val());
                    }
                } else if (parseInt(field.type) === this.oField.iTypeDrop) {
                    if (parseInt($.trim($(oInput).val())) !== -1) {
                        sVal = $.trim($(oInput).val());
                    }
                } else {
                    sVal = $.trim($(oInput).val());
                }

                return sVal;
            },
            showLoadDataError: function() {
                $("#idFormSignInContainer").hide();

                $("#idBktDefaultSignInErrorContainer").show();
                $('.clsDivBktWidgetDefaultLoadingContainer').remove();
            },
            showLoading: function() {
                $('#idBktWidgetDefaultBodyContainer').prepend('<div class="clsDivBktWidgetDefaultLoadingContainer clsDivBktLoadingContainer' + this.identifier + '"><div class="clsDivBktWidgetDefaultLoading"></div></div>');
            },
            hideLoading: function() {
                $('.clsDivBktLoadingContainer' + this.identifier).remove();
            },
            setCommnetsField: function() {
                if (typeof oClientValues_248295.clientData !== 'undefined' && typeof oClientValues_248295.clientData.attributes.comments !== 'undefined') {
                    $('#idTxaSignInUserComments').val(oClientValues_248295.clientData.attributes.comments);
                } else {
                    $('#idTxaSignInUserComments').val('');
                }

                if (typeof oClientValues_248295.widgetlabel.label_users_comments !== 'undefined' && $.trim(oClientValues_248295.widgetlabel.label_users_comments).length > 0) {
                    $('#idTxaSignInUserComments').attr("placeholder", $.trim(oClientValues_248295.widgetlabel.label_users_comments));
                }
            },
            getFieldsData: function() {
                this.client = new Client({
                    ClientFields: this.signin_fields.ClientFields,
                    EventFields: this.signin_fields.EventFields
                });
                var clientFormData = {};

                clientFormData['logintype'] = $.trim($("#idSelBktSignInLoginType").val());
                clientFormData['login'] = $.trim($("#idIptBktSignInlogin").val());
                clientFormData['password'] = encodeURIComponent($.trim($("#idIptBktSignInpassword").val()));

                var that = this;

                _.each(this.signin_fields.EventFields, function(field) {
                    clientFormData[field.input_text] = $.trim(that.getInputValue(field));
                });

                if ($("#idIptBktSignInvoucher").is(':visible')) {
                    clientFormData['voucher'] = $.trim($("#idIptBktSignInvoucher").val());
                }

                clientFormData['comments'] = $.trim($('#idTxaSignInUserComments').val());

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
            getFieldsErrorsData: function(p_clientFormData) {
                var someErrors = this.client.validate(p_clientFormData, {
                    screen: 'signin'
                });

                return someErrors;
            },
            fetchData: function() {
                var that = this;

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

                if ($('#idDivReCaptchaSignIn').length) {
                    data.gct = grecaptcha.getResponse(widgetBktReCaptchaSignIn);
                }

                if ($('#idDivHCaptchaSignIn').length) {
                    data.gct = hcaptcha.getResponse(widgetBktHCaptchaSignIn);
                }

                if ($('#idDivCfCaptchaSignIn').length) {
                    data.gct = document.querySelector('#idDivBktSignInContainer input[name="cf-turnstile-response"]') ? .value;
                }

                this.client.url = Utils.get_server_url() + "signin/";

                if (typeof oClientValues_248295.signedInData !== "undefined" && typeof oClientValues_248295.signedInData.signedin !== "undefined") {
                    this.client.url = Utils.get_server_url() + "signedin/";
                }

                if ($('#idDivReCaptchaSignIn.clsBktReCaptchaSignIn').length) {
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
                    this.client.fetch({
                        data: data,
                        error: (function() {
                            that.showLoadDataError();
                        })
                    });
                }
            }
        });

        return SignInContainer;
    });