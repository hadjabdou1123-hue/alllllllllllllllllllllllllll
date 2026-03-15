define(['jquery', 'underscore', 'backbone', 'widgets/default/models/client', 'widgets/utils'],
    function($, _, Backbone, Client, Utils) {
        var ChangePassword = Backbone.View.extend({
            el: $("#idBktDefaultChangePasswordContainer"),
            events: {
                'click #idBktChangePasswordSubmit': 'handleSubmit',
                'click #idDivBktAccountSubHeaderChangePasswordEvents': 'showHistory'
            },
            initialize: function() {
                this.identifier = new Date().getTime();
            },
            render: function() {

            },
            show: function() {
                this.$el.show();
            },
            showHistory: function() {
                Backbone.history.navigate('history', {
                    trigger: true,
                    replace: true
                });
            },
            start: function() {
                $('.clsBktWidgetDefaultLoading').remove();
                $('#idBktWidgetDefaultBodyContainer').show();
                $('.clsDivBktWidgetDefaultLoadingContainer').remove();

                this.hideMessages();
                $(".clsBktDefaultWindow").hide();
                this.emptyFields();
                this.show();
            },
            emptyFields: function() {
                this.$('#idIptBktChangePasswordNew').val('');
                this.$('#idIptBktChangePasswordNew').removeClass('clsDivBktDefaultInputError');
                this.$('#idIptBktChangePasswordRepeat').val('');
                this.$('#idIptBktChangePasswordRepeat').removeClass('clsDivBktDefaultInputError');
            },
            showLoading: function() {
                $('#idBktWidgetDefaultBodyContainer').prepend('<div class="clsDivBktWidgetDefaultLoadingContainer clsDivBktLoadingContainer' + this.identifier + '"><div class="clsDivBktWidgetDefaultLoading"></div></div>');
            },
            hideLoading: function() {
                $('.clsDivBktLoadingContainer' + this.identifier).remove();
            },
            handleSubmit: function(event) {
                this.hideMessages();
                this.showLoading();

                event.preventDefault();
                event.stopPropagation();

                this.client = new Client();
                var clientFormData = {};

                clientFormData['new_password'] = $.trim(this.$("#idIptBktChangePasswordNew").val());
                clientFormData['repeat_password'] = $.trim(this.$("#idIptBktChangePasswordRepeat").val());

                var someErrors = this.client.validate(clientFormData, {
                    screen: 'changepassword'
                });

                if (someErrors && someErrors.length > 0) {
                    $("#idIptBktChangePasswordRepeat").addClass('clsDivBktDefaultInputError');
                    $("#idIptBktChangePasswordNew").addClass('clsDivBktDefaultInputError');
                    delete this.client;
                    this.hideLoading();
                } else {
                    this.doSubmit();
                }
            },
            doSubmit: function() {
                var that = this;
                this.listenTo(this.client, "change", function() {
                    if (this.client.attributes.errors[0].hasOwnProperty('type') && this.client.attributes.errors[0].type === 'data') {
                        $("#idBktChangePasswordSaveMessageError").show();
                        $("#idBktChangePasswordSaveMessageErrorText").html(this.client.attributes.errors[0].message);
                    } else if (this.client.attributes.errors) {
                        //error
                        $("#idBktChangePasswordSaveMessageFail").show();
                    } else {
                        //ok
                        $("#idBktChangePasswordSaveMessageOk").show();
                    }
                    delete this.client;
                    that.emptyFields();
                    this.hideLoading();
                });

                var data = $.extend(true, {}, bkt_init_widget);
                data.new_password = encodeURIComponent($.trim(this.$('#idIptBktChangePasswordNew').val()));
                data.repeat_password = encodeURIComponent($.trim(this.$('#idIptBktChangePasswordRepeat').val()));
                data.bktToken = oClientValues_248295.bktToken;

                this.client.url = Utils.get_server_url() + "changepassword/";

                this.client.fetch({
                    data: data,
                    error: (function() {
                        $("#idBktChangePasswordSaveMessageFail").show();
                        that.hideLoading();
                    })
                });
            },
            hideMessages: function() {
                $("#idBktChangePasswordSaveMessageFail").hide();
                $("#idBktChangePasswordSaveMessageOk").hide();
                $("#idBktChangePasswordSaveMessageError").hide();
                $("#idIptBktChangePasswordNew").removeClass('clsDivBktDefaultInputError');
                $("#idIptBktChangePasswordRepeat").removeClass('clsDivBktDefaultInputError');
            }

        });
        return ChangePassword;
    });