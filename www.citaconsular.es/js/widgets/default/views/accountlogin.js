define(['jquery', 'underscore', 'backbone', 'widgets/default/views/accountloginfieldslist', 'widgets/default/models/client', 'widgets/utils', 'widgets/default/views/footer'],
    function($, _, Backbone, AccountLoginFieldsList, Client, Utils, Footer) {
        var AccountLoginContainer = Backbone.View.extend({
            el: $("#idBktDefaultAccountLoginContainer"),
            events: {
                'click #idBktDefaultAccountLoginConfirmButton': 'handleSubmit'
            },
            initialize: function() {
                this.identifier = new Date().getTime();
                this.footer = new Footer();
            },
            start: function() {
                $('.clsBktWidgetDefaultLoading').remove();
                $('#idBktWidgetDefaultBodyContainer').show();
                $('.clsDivBktWidgetDefaultLoadingContainer').remove();

                this.showLoading();
                this.loadFields();
            },
            loadFields: function() {
                if (this.fields_list) {
                    delete this.fields_list;
                }
                this.fields_list = new AccountLoginFieldsList({
                    parentView: this
                });
                this.fields_list.start();

                this.listenTo(this.fields_list.fields, "reset", function() {
                    if (this.fields_list.loaded) {
                        this.render();
                        this.show();
                    }

                    this.hideLoading();
                });
            },
            render: function() {

            },
            show: function() {
                $(".clsDivBktWidgetDefaultLoadingContainer").hide();
                $(".clsBktDefaultErrorContainer").hide();
                $(".clsBktDefaultWindow").hide();
                $(".clsDivBktDefaultFieldError").hide();

                $("#idDivBktAccountLoginContent").show();
                $("#idDivBktAccountLoginContainer").show();
                this.$el.show();
            },
            showLoading: function() {
                $('#idBktWidgetDefaultBodyContainer').prepend('<div class="clsDivBktWidgetDefaultLoadingContainer clsDivBktLoadingContainer' + this.identifier + '"><div class="clsDivBktWidgetDefaultLoading"></div></div>');
            },
            hideLoading: function() {
                $('.clsDivBktLoadingContainer' + this.identifier).remove();
            },
            handleSubmit: function(event) {
                this.showLoading();

                event.preventDefault();
                event.stopPropagation();

                this.client = new Client();
                var clientFormData = {};

                clientFormData['logintype'] = $.trim(this.$("#idSelBktAccountLoginType").val());
                clientFormData['login'] = $.trim(this.$("#idIptBktAccountLoginlogin").val());
                clientFormData['password'] = $.trim(this.$("#idIptBktAccountLoginpassword").val());

                var someErrors = this.client.validate(clientFormData, {
                    screen: 'accountlogin'
                });

                if (someErrors && someErrors.length > 0) {
                    this.handleErrors(this.client.someErrors);
                    delete this.client;

                    this.hideLoading();
                } else {
                    this.doSubmit();
                }
            },
            doSubmit: function() {
                var that = this;

                this.listenTo(this.client, "change", function() {
                    if (this.client.attributes.errors) {
                        this.handleErrors(this.client.attributes.errors);
                    } else {
                        oClientValues_248295.signedInData = {
                            name: this.client.attributes.name,
                            signedin: this.client.attributes.signedin,
                            bktToken: this.client.attributes.bktToken
                        };
                        //                    Utils.setCookie(oClientValues_248295.signedInData);
                        delete oClientValues_248295.bktToken;

                        if (typeof this.client.attributes.bktToken !== 'undefined') {
                            oClientValues_248295.bktToken = this.client.attributes.bktToken;
                        }

                        that.footer.signInAccountShow();
                        Backbone.history.navigate('history', {
                            trigger: true,
                            replace: true
                        });
                    }

                    this.hideLoading();
                });

                var data = $.extend(true, {}, bkt_init_widget);
                data.logintype = $.trim(this.$("#idSelBktAccountLoginType").val());
                data.login = $.trim(this.$("#idIptBktAccountLoginlogin").val());
                data.password = encodeURIComponent($.trim(this.$("#idIptBktAccountLoginpassword").val()));

                this.client.url = Utils.get_server_url() + "signinaccount/";

                if (typeof oClientValues_248295.bktToken !== "undefined") {
                    data.bktToken = oClientValues_248295.bktToken;
                }

                this.client.fetch({
                    data: data,
                    error: (function() {
                        that.showLoadDataError();
                    })
                });
            },
            handleErrors: function(p_someErrors) {
                var that = this;

                this.$('.clsDivBktDefaultInputError').removeClass();

                _.each(p_someErrors, function(error) {
                    if (error.hasOwnProperty('type') && error.type === 'system') {
                        that.showLoadDataError();
                    }

                    that.showFieldError(error);
                });
            },
            showFieldError: function(error) {
                var attr = $('#idIptBktAccountLogin' + error.field).attr("type");

                if (typeof attr !== typeof undefined && attr !== false && (attr.toLowerCase() === 'text' || attr.toLowerCase())) {
                    $('#idIptBktAccountLogin' + error.field).addClass('clsDivBktDefaultInputError');
                }

                $('#idIptBktAccountLoginError' + error.field).html(error.message);
                $('#idIptBktAccountLoginError' + error.field).attr('title', error.message);
                $('#idIptBktAccountLoginError' + error.field).show();
            },
            showLoadDataError: function() {
                $(".clsBktDefaultErrorContainer").hide();
                $(".clsBktDefaultWindow").hide();

                $("#idDivBktAccountLoginContent").hide();
                $(".clsDivBktWidgetDefaultLoadingContainer").remove();
                $("#idBktDefaultAccountLoginErrorContainer").show();

                this.$el.show();
            }
        });

        return AccountLoginContainer;
    });