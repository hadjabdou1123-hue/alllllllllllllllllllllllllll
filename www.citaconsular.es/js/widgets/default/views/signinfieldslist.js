define(['jquery', 'underscore', 'backbone', 'widgets/default/collections/signinfields', 'widgets/default/models/field', 'widgets/utils'],
    function($, _, Backbone, SignInFields, Field, Utils) {
        var SignInFieldsList = Backbone.View.extend({
            el: $("#idFormSignInContainer"),
            initialize: function() {
                this.field = new Field();
                this.render();
            },
            events: {
                'click input': 'hideFieldError',
                'focus input': 'hideFieldError',
                'click select': 'hideFieldError',
                'focus select': 'hideFieldError'
            },
            template: "",
            render: function() {
                var identifier = new Date().getTime();

                this.showLoading(identifier);

                this.signin_fields = new SignInFields();
                var that = this;
                this.emptyFields();
                this.listenTo(this.signin_fields, "reset", function() {
                    that.$('#idSelBktSignInLoginType').empty();
                    that.$('#idBktDefaultSignInEventFields').empty();

                    var someSigninFields = that.signin_fields.models;

                    for (var i = 0; i < someSigninFields.length; i++) {
                        if (typeof someSigninFields[i].attributes.errors !== 'undefined') {
                            that.showLoadDataError();
                            return false;
                        } else {
                            that.ClientFields = someSigninFields[i].attributes.Clients;
                            that.EventFields = someSigninFields[i].attributes.Events;
                            that.CountriesData = someSigninFields[i].attributes.Countries;
                            that.SelectOptions = someSigninFields[i].attributes.SelectOptions;
                            that.VoucherFields = someSigninFields[i].attributes.Voucher;
                        }
                    }

                    _.each(that.ClientFields, function(field) {
                        that.drawClientInputField(field);
                    });

                    if (typeof oClientValues_248295.waitingListData === 'undefined') {
                        _.each(that.EventFields, function(field) {
                            that.drawEventInputField(field);
                        });

                        if (bkt_init_widget.publickey === '219e622e6c2907000611b02dfb9e89e6f') {
                            var input = $("#idIptBktSignIncustomevent1");

                            var textarea = $("<textarea></textarea>").attr({
                                id: input.prop('id'),
                                name: input.prop('name'),
                                value: input.val(),
                                placeholder: input.prop('placeholder')
                            });

                            input.after(textarea).remove();
                        }

                        this.checkAndDrawVoucherInputField(that.VoucherFields);
                    }

                    $('#idIptBktSignInlogin').attr('placeholder', '* ' + $.trim($('#idSelBktSignInLoginType option:first').text()));
                    this.hideLoading(identifier);
                });

                var dataToSend = $.extend({}, bkt_init_widget);
                dataToSend.services = Utils.obtainObjectsIds(oClientValues_248295.selectedServices);

                this.signin_fields.fetch({
                    data: dataToSend,
                    error: (function() {
                        that.showLoadDataError();
                    })
                });
            },
            emptyFields: function() {
                if (typeof oClientValues_248295.clientData !== 'undefined' && typeof oClientValues_248295.clientData.attributes.login !== 'undefined') {
                    this.$('#idIptBktSignInlogin').val(oClientValues_248295.clientData.attributes.login);
                } else {
                    this.$('#idIptBktSignInlogin').val('');
                }
                this.$('#idIptBktSignInpassword').val('');
                this.$('#idIptBktSignInlogin').removeClass('clsDivBktDefaultInputError');
                this.$('#idIptBktSignInpassword').removeClass('clsDivBktDefaultInputError');
            },
            drawClientInputField: function(field) {
                if (parseInt(field.show_widget) === 1 && parseInt(field.validate) === 1) {
                    var template = _.template($("#idTemSignInInputSelectOption").html(), {
                        iOptionValue: field.input_text,
                        sOptionText: field.field_text
                    });
                    this.$('#idSelBktSignInLoginType').append(template);
                }
            },
            drawEventInputField: function(field) {
                if (parseInt(field.show_widget) === 1) {

                    var sFieldText = field.field_text;

                    if (parseInt(field.obligatory) === 1) {
                        sFieldText = '* ' + field.field_text;
                    }

                    var sValue = "";
                    if (typeof oClientValues_248295.clientData !== 'undefined') {
                        sValue = oClientValues_248295.clientData.attributes[field.input_text];
                    }

                    var sInputTemplate = this.getFieldTemplate(field);

                    var template = _.template($("#" + sInputTemplate).html(), {
                        attributes: field,
                        sShowText: sFieldText,
                        sValue: sValue
                    });
                    this.$('#idBktDefaultSignInEventFields').append(template);

                    this.checkAndDrawSelectOptions(field);

                    if (typeof bkt_init_widget.fields !== 'undefined') {
                        if (typeof bkt_init_widget.fields[field.input_text] !== 'undefined') {
                            $('#idIptBktSignIn' + field.input_text).val(bkt_init_widget.fields[field.input_text]);
                        }
                    }
                }
            },
            checkAndDrawSelectOptions: function(field) {
                if (parseInt(field.type) === this.field.iTypeDrop) {
                    var iSelectList = parseInt(field.custom_fields_select_lists_id);

                    if (iSelectList > 0) {
                        for (var i = 0; i < this.SelectOptions.length; i++) {
                            if (parseInt(this.SelectOptions[i].custom_fields_select_lists_id) === iSelectList) {
                                var template = _.template($("#idTemSignInInputSelectOption").html(), {
                                    iOptionValue: this.SelectOptions[i].value,
                                    sOptionText: this.SelectOptions[i].option_text
                                });
                                this.$('#idIptBktSignIn' + field.input_text).append(template);
                            }
                        }
                    }
                }
            },
            getFieldTemplate: function(field) {
                var sInputTemplate = 'idTemSignInInputFieldsText';

                if (parseInt(field.type) === this.field.iTypeCheckbox) {
                    sInputTemplate = 'idTemSignInInputFieldsCheckBox';
                } else if (parseInt(field.type) === this.field.iTypeDrop) {
                    sInputTemplate = 'idTemSignInInputFieldsDrop';
                } else if (parseInt(field.type) === this.field.iTypeDropAndText) {
                    sInputTemplate = 'idTemSignInInputFieldsDropAndText';
                }

                return sInputTemplate;
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
            showLoadDataError: function() {
                $("#idFormSignInContainer").hide();

                $("#idBktDefaultSignInErrorContainer").show();
                $('.clsDivBktWidgetDefaultLoadingContainer').remove();
            },
            showLoading: function(p_iIdentifier) {
                $('#idBktWidgetDefaultBodyContainer').prepend('<div class="clsDivBktWidgetDefaultLoadingContainer clsDivBktLoadingContainer' + p_iIdentifier + '"><div class="clsDivBktWidgetDefaultLoading"></div></div>');
            },
            hideLoading: function(p_iIdentifier) {
                $('.clsDivBktLoadingContainer' + p_iIdentifier).remove();
            },
            checkAndDrawVoucherInputField: function(field) {
                if (field === true) {
                    var template = _.template($("#idTemSignInVoucherInputField").html(), {});
                    $('#idBktDefaultSignInEventFields').append(template);
                }
            }
        });

        return SignInFieldsList;
    });