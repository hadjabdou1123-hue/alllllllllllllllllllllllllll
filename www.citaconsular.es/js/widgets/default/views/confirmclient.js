define(['jquery', 'underscore', 'backbone', 'widgets/default/views/breadcrumb', 'widgets/default/models/validate'],
    function($, _, Backbone, BreadCrumb, ValidateModel) {
        var ConfirmClientView = Backbone.View.extend({
            el: $("#idBktDefaultConfirmClientContainer"),
            initialize: function() {
                this.identifier = new Date().getTime();

                this.validateModel = new ValidateModel();

                //            if(!this.isValidateRequired()){ return; }
            },
            events: {
                'click #idBktDefaultConfirmClientBackButton': 'backButton',
                'keyup #idIptBktValidateCode': 'onlynumbers',
                'click #idDivBktConfirmClientValidateButton .clsDivContinueButton': 'validate'
            },
            start: function() {
                if (!this.isValidateRequired()) {
                    return;
                }
            },
            render: function() {
                $(".clsBktDefaultWindow").hide();
                $('#idDivBktValidateCodeError').hide();
                $('#idDivBktConfirmClientInfoSms').hide();
                $('#idDivBktConfirmClientInfoEmail').hide();

                $('#idIptBktValidateCode').val('');

                var breadCrumb = new BreadCrumb();
                breadCrumb.show('#idBktDefaultConfirmClientContainer .clsDivSubHeaderBreadcrumbsText');

                $('#idDivBktConfirmClientInfoSms').show();

                if (typeof oClientValues_248295.clientData.attributes.validateBy !== 'undefined' && oClientValues_248295.clientData.attributes.validateBy === 0) {
                    $('#idDivBktConfirmClientInfoSms').hide();
                    $('#idDivBktConfirmClientInfoEmail').show();
                }

                if (typeof oClientValues_248295.clientData.attributes.validateBy !== 'undefined' && oClientValues_248295.clientData.attributes.validateBy === 1) {
                    $('#idDivBktConfirmClientInfoEmail').hide();
                    $('#idDivBktConfirmClientInfoSms').show();
                }
            },
            show: function() {
                this.$el.show();
            },
            isValidateRequired: function() {
                if (typeof oClientValues_248295.clientData.attributes.validate === 'undefined') {
                    Backbone.history.navigate('selectpaymentgateway', {
                        trigger: true,
                        replace: true
                    });
                    return false;
                }

                this.render();
                this.show();
            },
            backButton: function() {
                Backbone.history.navigate('signup', {
                    trigger: true,
                    replace: true
                });
            },
            showLoading: function() {
                $('#idBktDefaultConfirmClientContainer').prepend('<div class="clsDivBktWidgetDefaultLoadingContainer clsDivBktLoadingContainer' + this.identifier + '"><div class="clsDivBktWidgetDefaultLoading"></div></div>');
            },
            hideLoading: function() {
                $('.clsDivBktLoadingContainer' + this.identifier).remove();
            },
            onlynumbers: function(event) {
                var val = $('#idIptBktValidateCode').val();
                val = val.replace(/[^0-9]+/g, '');
                $('#idIptBktValidateCode').val(val);
            },
            validate: function() {
                this.showLoading();

                this.stopListening();
                this.stopListening(this.validateModel);

                var that = this;

                var data = $.extend(true, {}, bkt_init_widget);
                data.bktToken = oClientValues_248295.bktToken;
                data.code = $('#idIptBktValidateCode').val();

                if (typeof oClientValues_248295.clientData.attributes.cellphone !== 'undefined') {
                    data.cellphone = oClientValues_248295.clientData.attributes.cellphone;
                }

                if (typeof oClientValues_248295.clientData.attributes.email !== 'undefined') {
                    data.email = oClientValues_248295.clientData.attributes.email;
                }

                if (data === false) {
                    return false;
                }

                this.validateModel.fetch({
                    data: data,
                    async: false,
                    success: (function(model, response) {
                        if (typeof response.Valid !== 'undefined' && response.Valid === true) {
                            Backbone.history.navigate('selectpaymentgateway', {
                                trigger: true,
                                replace: true
                            });

                            this.hideLoading();

                            return true;
                        } else if (typeof response.Exceeded !== 'undefined') {
                            that.goToBegin();
                        } else {
                            that.showValidateDataError();
                        }
                    }),
                    error: (function() {
                        that.showValidateDataError();
                    })
                });
            },
            showValidateDataError: function() {
                $('#idDivBktValidateCodeError').show();

                this.hideLoading();
            },
            goToBegin: function() {
                Backbone.history.navigate('services', {
                    trigger: true,
                    replace: true
                });
            }
        });

        return ConfirmClientView;
    });