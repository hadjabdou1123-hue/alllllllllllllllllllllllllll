define(['jquery', 'underscore', 'backbone', 'widgets/default/models/client', 'widgets/utils'],
    function($, _, Backbone, Client, Utils) {
        var RecoverPasswordContainer = Backbone.View.extend({
            el: $("#idBktDefaultRecoverPasswordContainer"),
            events: {
                'click #idBktDefaultRecoverPasswordConfirmButton': 'handleSubmit',
                'click input': 'hideFieldError',
                'focus input': 'hideFieldError',
                'change #idSelBktRecoverPasswordField': 'changeRecoverField'
            },
            initialize: function() {
                this.identifier = new Date().getTime();
            },
            start: function() {
                $('.clsBktWidgetDefaultLoading').remove();
                $('#idBktWidgetDefaultBodyContainer').show();
                $('.clsDivBktWidgetDefaultLoadingContainer').remove();

                this.render();
                this.show();
            },
            render: function() {
                this.emptyFields();
                this.changeRecoverField();
            },
            show: function() {
                $(".clsDivBktWidgetDefaultLoadingContainer").hide();
                $(".clsBktDefaultErrorContainer").hide();
                $(".clsBktDefaultOkContainer").hide();
                $(".clsBktDefaultWindow").hide();

                $("#idDivBktRecoverPasswordContent").show();
                $("#idDivBktRecoverPasswordContainer").show();
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

                clientFormData['field'] = $.trim(this.$("#idSelBktRecoverPasswordField").val());
                clientFormData['email'] = $.trim(this.$("#idIptBktRecoverPasswordemail").val());

                var someErrors = this.client.validate(clientFormData, {
                    screen: 'recoverpassword'
                });

                if (someErrors && someErrors.length > 0) {
                    this.handleErrors(this.client.someErrors);
                    delete this.client;

                    this.hideLoading();
                } else {
                    this.doSubmit();
                }
            },
            handleErrors: function(p_someErrors) {
                var that = this;

                this.$('.clsDivBktDefaultInputError').removeClass();

                _.each(p_someErrors, function(error) {
                    if (error.hasOwnProperty('type') && error.type === 'system') {
                        that.showGeneralError();
                    } else if (error.hasOwnProperty('type') && error.type === 'data') {
                        that.showDataError(error.message);
                    }

                    that.showFieldError(error);
                });
            },
            showFieldError: function(error) {
                var attr = $('#idIptBktRecoverPassword' + error.field).attr("type");

                if (typeof attr !== typeof undefined && attr !== false && (attr.toLowerCase() === 'text' || attr.toLowerCase())) {
                    $('#idIptBktRecoverPassword' + error.field).addClass('clsDivBktDefaultInputError');
                }
            },
            doSubmit: function() {
                var that = this;

                this.listenTo(this.client, "change", function() {
                    if (this.client.attributes.errors) {
                        this.handleErrors(this.client.attributes.errors);
                    } else {
                        that.showRecoverOk();
                    }

                    this.hideLoading();
                });

                var data = $.extend(true, {}, bkt_init_widget);
                data.email = $.trim(this.$('#idIptBktRecoverPasswordemail').val());
                data.field = $.trim(this.$("#idSelBktRecoverPasswordField").val());

                this.client.url = Utils.get_server_url() + "recoverpassword/";

                this.client.fetch({
                    data: data,
                    error: (function() {
                        that.showLoadDataError();
                    })
                });
            },
            showLoadDataError: function() {
                $(".clsBktDefaultErrorContainer").hide();
                $(".clsBktDefaultWindow").hide();

                $("#idDivBktRecoverPasswordContent").hide();

                $(".clsDivBktWidgetDefaultLoadingContainer").remove();

                $("#idDivBktDefaultErrorRecoverPasswordGeneral").hide();
                $("#idDivBktDefaultErrorRecoverPasswordLoadingData").show();

                $("#idBktDefaultRecoverPasswordErrorContainer").show();

                this.$el.show();
            },
            showGeneralError: function() {
                $(".clsBktDefaultErrorContainer").hide();
                $(".clsBktDefaultWindow").hide();

                $("#idDivBktRecoverPasswordContent").hide();

                $(".clsDivBktWidgetDefaultLoadingContainer").remove();

                $("#idDivBktDefaultErrorRecoverPasswordLoadingData").hide();
                $("#idDivBktDefaultErrorRecoverPasswordGeneral").show();

                $("#idBktDefaultRecoverPasswordErrorContainer").show();

                this.$el.show();
            },
            showDataError: function(message) {
                $(".clsBktDefaultErrorContainer").hide();
                $(".clsBktDefaultWindow").hide();

                $(".clsDivBktWidgetDefaultLoadingContainer").remove();
                $("#idBktDefaultRecoverPasswordDataErrorContainer").show();
                $("#idDivBktDefaultDataErrorRecoverPasswordLoadingData").html(message);

                $('#idIptBktRecoverPasswordemail').addClass('clsDivBktDefaultInputError');

                this.$el.show();
            },
            showRecoverOk: function() {
                $(".clsBktDefaultErrorContainer").hide();
                $(".clsBktDefaultWindow").hide();

                $("#idDivBktRecoverPasswordContent").hide();

                $(".clsDivBktWidgetDefaultLoadingContainer").remove();
                $("#idBktDefaultRecoverPasswordOkContainer").show();

                this.$el.show();
            },
            hideFieldError: function(event) {
                var eventId = event.target.id;

                if (eventId.length > 0) {
                    var sName = this.$('#' + event.target.id).attr('name');

                    if (this.$('#idDivBktFieldError' + sName).is(':visible')) {
                        this.$('#' + event.target.id).removeClass('clsDivBktDefaultInputError');
                        this.$('#idDivBktFieldError' + sName).hide();
                    } else if (this.$('#' + event.target.id).is(':visible')) {
                        this.$('#' + event.target.id).removeClass('clsDivBktDefaultInputError');
                    }
                }
            },
            emptyFields: function() {
                this.$('#idIptBktRecoverPasswordemail').val('');
                this.$('#idIptBktRecoverPasswordemail').removeClass('clsDivBktDefaultInputError');
            },
            changeRecoverField: function() {
                this.$('#idIptBktRecoverPasswordemail').attr('placeholder', '* ' + this.$('#idSelBktRecoverPasswordField :selected').text());
            }
        });

        return RecoverPasswordContainer;
    });