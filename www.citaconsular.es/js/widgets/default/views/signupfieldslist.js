define(['jquery', 'underscore', 'backbone', 'widgets/default/collections/signupfields', 'widgets/default/models/field', 'widgets/default/models/widgetconfiguration', 'widgets/utils', 'widgets/default/models/widgetconfiguration'],
    function($, _, Backbone, SignupFields, Field, WidgetConfiguration, Utils, Widgetconfiguration) {
        var SignupFieldsList = Backbone.View.extend({
            el: $("#idBktDefaultSignUpContainerFields"),
            initialize: function() {
                this.iMaxHalvedClientFields = 4;
                this.iMaxHalvedClientFieldsPerRow = 2;

                this.field = new Field();
                this.widgetconfiguration = new Widgetconfiguration();

                this.render();
            },
            events: {
                'click input': 'hideFieldError',
                'focus input': 'hideFieldError',
                'click select': 'hideFieldError',
                'focus select': 'hideFieldError',
                'keyup #idIptBktcellphone': 'onlynumbers'
            },
            template: _.template($("#idTemSignupInputFieldsRowContainer").html()),
            render: function() {
                var identifier = new Date().getTime();

                this.showLoading(identifier);

                this.iTotalFieldsToShowWidget = 0;
                this.iShowedClientFieldsCount = 0;
                this.iShowedEventFieldsCount = 0;
                this.iRowsCount = 0;

                this.signup_fields = new SignupFields();
                var that = this;

                this.listenTo(this.signup_fields, "reset", function() {
                    this.$el.empty();

                    var someSignupFields = that.signup_fields.models;

                    if (someSignupFields.length <= 0) {
                        that.showLoadDataError();
                        return false;
                    }

                    for (var i = 0; i < someSignupFields.length; i++) {
                        if (typeof someSignupFields[i].attributes.errors !== 'undefined') {
                            that.showLoadDataError();
                            return false;
                        } else {
                            that.ClientFields = someSignupFields[i].attributes.Clients;
                            that.EventFields = someSignupFields[i].attributes.Events;
                            that.CountriesData = someSignupFields[i].attributes.Countries;
                            that.SelectOptions = someSignupFields[i].attributes.SelectOptions;
                            that.UserCountry = someSignupFields[i].attributes.UserCountry;
                            that.VoucherFields = someSignupFields[i].attributes.Voucher;
                        }
                    }

                    //                if(bkt_init_widget.publickey == '2dc0509cbd1f97577886f8edecad7587f'){
                    //                    var bFirstAppointment = (typeof oClientValues_248295.widgetconfiguration.registration_type !== 'undefined' && parseInt(oClientValues_248295.widgetconfiguration.registration_type) === this.widgetconfiguration.iFirstAppointment) ? true : false;
                    //
                    //                    if(!bFirstAppointment){
                    //                        var passField = {
                    //                            field_text: that.getPassFieldText(),
                    //                            input_text: "password",
                    //                            obligatory: "1",
                    //                            show_widget: "1",
                    //                            type: "1",
                    //                        }
                    //                        
                    //                        that.ClientFields.push(passField);
                    //                    }
                    //                }                

                    _.each(that.ClientFields, function(field) {
                        if (parseInt(field.show_widget) === 1) {
                            that.iTotalFieldsToShowWidget++;
                        }
                    });

                    _.each(that.ClientFields, function(field) {
                        that.drawClientInputField(field);
                    });

                    //                that.setNumericInput();

                    if (typeof oClientValues_248295.waitingListData === 'undefined') {
                        _.each(that.EventFields, function(field) {
                            that.drawEventInputField(field);
                        });

                        if (bkt_init_widget.publickey === '219e622e6c2907000611b02dfb9e89e6f') {
                            var input = $("#idIptBktcustomevent1");

                            var textarea = $("<textarea></textarea>").attr({
                                id: input.prop('id'),
                                name: input.prop('name'),
                                value: input.val(),
                                placeholder: input.prop('placeholder')
                            });

                            input.after(textarea).remove();
                        }

                        if (bkt_init_widget.publickey === '23b55f65f5686306018de6e5ea5bdca92') {
                            var input = $("#idIptBktcustom5");

                            var textarea = $("<textarea></textarea>").attr({
                                id: input.prop('id'),
                                name: input.prop('name'),
                                value: input.val(),
                                placeholder: input.prop('placeholder'),
                                style: 'margin-bottom: 10px'
                            });

                            input.after(textarea).remove();
                        }

                        if (bkt_init_widget.publickey === '2bd2a25f395fb6693c562f212fe75caf6') {
                            var input = $("#idIptBktcustomevent2");

                            var textarea = $("<textarea></textarea>").attr({
                                id: input.prop('id'),
                                name: input.prop('name'),
                                value: input.val(),
                                placeholder: input.prop('placeholder'),
                                style: 'margin-bottom: 10px'
                            });

                            input.after(textarea).remove();
                        }

                        this.checkAndDrawVoucherInputField(that.VoucherFields);
                    }

                    this.hideLoading(identifier);
                });

                var dataToSend = $.extend({}, bkt_init_widget);
                dataToSend.services = Utils.obtainObjectsIds(oClientValues_248295.selectedServices);

                if (bkt_init_widget.publickey === '2d8c39cc364de9e9e5c4b367b9d3a04d0' || bkt_init_widget.publickey === '2419705f4bb22da0e06f913084446e953') {
                    dataToSend.preagendas = Utils.obtainObjectsIds(oClientValues_248295.selectedAgendas);
                }

                this.signup_fields.fetch({
                    data: dataToSend,
                    error: (function() {
                        that.showLoadDataError();
                    })
                });
            },
            drawClientInputField: function(field) {
                if (parseInt(field.show_widget) === 1) {
                    this.widgetconfiguration = new WidgetConfiguration();
                    var sFieldText = field.field_text;
                    var bFirstAppointment = (typeof oClientValues_248295.widgetconfiguration.registration_type !== 'undefined' && parseInt(oClientValues_248295.widgetconfiguration.registration_type) === this.widgetconfiguration.iFirstAppointment) ? true : false;

                    if ((parseInt(field.obligatory) === 1) || (!bFirstAppointment && parseInt(field.validate) === 1)) {
                        sFieldText = '* ' + field.field_text;
                    }

                    var sValue = "";
                    if (typeof oClientValues_248295.clientData !== 'undefined') {
                        sValue = oClientValues_248295.clientData.attributes[field.input_text];
                    }

                    this.calculateCreateNewClientRow();

                    var sInputTemplate = this.getFieldTemplate(field);

                    var template = _.template($("#" + sInputTemplate).html(), {
                        attributes: field,
                        sShowText: sFieldText,
                        sValue: sValue
                    });

                    if (bkt_init_widget.publickey === '23b55f65f5686306018de6e5ea5bdca92' && field.input_text === 'custom5') {
                        $('#idBktDefaultSignUpCommentsField').prepend(template);
                    } else {
                        $('#idBktDefaultSignUpRow-' + this.iRowsCount).append(template);
                    }

                    this.checkAndDrawSelectOptions(field);

                    if (typeof bkt_init_widget.fields !== 'undefined') {
                        if (typeof bkt_init_widget.fields[field.input_text] !== 'undefined') {
                            $('#idIptBkt' + field.input_text).val(bkt_init_widget.fields[field.input_text]);
                        }
                    }

                    this.iShowedClientFieldsCount++;
                }
            },
            calculateCreateNewClientRow: function() {
                if (this.iShowedClientFieldsCount > this.iMaxHalvedClientFields) {
                    return;
                }

                if (this.iShowedClientFieldsCount % this.iMaxHalvedClientFieldsPerRow !== 0) {
                    return;
                }

                var iPendingClientFields = this.iTotalFieldsToShowWidget - this.iShowedClientFieldsCount;
                var sClass = 'clsDivBktDefaultSignUpHalvedRow';

                this.iRowsCount++;

                if (this.iShowedClientFieldsCount === this.iMaxHalvedClientFields) {
                    sClass = 'clsDivBktDefaultSignUpRow';
                }

                if (iPendingClientFields < this.iMaxHalvedClientFieldsPerRow) {
                    sClass = 'clsDivBktDefaultSignUpRow';
                }

                var template = _.template($("#idTemSignupInputFieldsRowContainer").html(), {
                    iRow: this.iRowsCount,
                    sClass: sClass
                });
                this.$el.append(template);
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

                    this.calculateCreateNewEventRow();

                    var sInputTemplate = this.getFieldTemplate(field);

                    var template = _.template($("#" + sInputTemplate).html(), {
                        attributes: field,
                        sShowText: sFieldText,
                        sValue: sValue
                    });
                    $('#idBktDefaultSignUpRow-' + this.iRowsCount).append(template);

                    this.checkAndDrawSelectOptions(field);

                    if (typeof bkt_init_widget.fields !== 'undefined') {
                        if (typeof bkt_init_widget.fields[field.input_text] !== 'undefined') {
                            $('#idIptBkt' + field.input_text).val(bkt_init_widget.fields[field.input_text]);
                        }
                    }

                    this.iShowedEventFieldsCount++;
                }
            },
            calculateCreateNewEventRow: function() {
                if (this.iShowedEventFieldsCount === 0) {
                    this.iRowsCount++;

                    var template = _.template($("#idTemSignupInputFieldsRowContainer").html(), {
                        iRow: this.iRowsCount,
                        sClass: 'clsDivBktDefaultSignUpRow'
                    });
                    this.$el.append(template);
                }
            },
            getFieldTemplate: function(field) {
                var sInputTemplate = 'idTemSignupInputFieldsText';

                if (field.input_text === 'password') {
                    sInputTemplate = 'idTemSignupInputFieldsPassword';
                }

                if (parseInt(field.type) === this.field.iTypeCheckbox) {
                    sInputTemplate = 'idTemSignupInputFieldsCheckBox';
                } else if (parseInt(field.type) === this.field.iTypeDrop) {
                    sInputTemplate = 'idTemSignupInputFieldsDrop';
                } else if (parseInt(field.type) === this.field.iTypeDropAndText) {
                    sInputTemplate = 'idTemSignupInputFieldsDropAndText';
                }

                return sInputTemplate;
            },
            checkAndDrawSelectOptions: function(field) {
                var that = this;

                if (parseInt(field.type) === this.field.iTypeDrop) {
                    var iSelectList = parseInt(field.custom_fields_select_lists_id);

                    if (iSelectList > 0) {
                        for (var i = 0; i < this.SelectOptions.length; i++) {
                            if (parseInt(this.SelectOptions[i].custom_fields_select_lists_id) === iSelectList) {
                                var template = _.template($("#idTemSignupInputSelectOption").html(), {
                                    iOptionValue: this.SelectOptions[i].value,
                                    sOptionText: this.SelectOptions[i].option_text,
                                    bOptionSelected: false
                                });
                                $('#idIptBkt' + field.input_text).append(template);
                            }
                        }
                    }
                } else if (parseInt(field.type) === this.field.iTypeDropAndText) {
                    _.each(this.CountriesData, function(country) {

                        var sCountryText = "+" + country.international_code + ' - ' + country.name;

                        var bSelected = false;

                        if (country.id === that.UserCountry[0].countries_id) {
                            bSelected = true;
                        }

                        var template = _.template($("#idTemSignupInputSelectOption").html(), {
                            iOptionValue: country.id,
                            sOptionText: sCountryText,
                            bOptionSelected: bSelected
                        });
                        $('#idIptBktInternationalCode' + field.input_text).append(template);
                    });
                }
            },
            hideFieldError: function(event) {
                var eventId = event.target.id;

                if (eventId.length > 0) {
                    var sName = $('#' + event.target.id).attr('name');

                    if ($('#idDivBktFieldError' + sName).is(':visible')) {
                        $('#' + event.target.id).removeClass('clsDivBktDefaultInputError');
                        $('#idDivBktFieldError' + sName).hide();
                    } else if ($('#' + event.target.id).is(':visible')) {
                        $('#' + event.target.id).removeClass('clsDivBktDefaultInputError');
                    }
                }
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
            checkAndDrawVoucherInputField: function(field) {
                if (field === true) {
                    var template = _.template($("#idTemSignupVoucherInputField").html(), {});
                    $('#idBktDefaultSignUpContainerFields').append(template);
                }
            },
            onlynumbers: function(event) {
                var val = $('#idIptBktcellphone').val();
                val = val.replace(/[^0-9]+/g, '');
                $('#idIptBktcellphone').val(val);
            },
            getPassFieldText: function() {
                var text = [];
                text['en'] = 'Create your password';
                text['pt'] = 'Crie sua senha';
                text['ca'] = 'Crea la teva contrasenya';
                text['es'] = 'Crea tu contraseña';
                text['it'] = 'crea la tua password';
                text['du'] = 'Maak je wachtwoord aan';
                text['uk'] = 'Створіть свій пароль';
                text['de'] = 'Erstelle dein Passwort';
                text['ko'] = '비밀번호 만들기';
                text['fr'] = 'Créez votre mot de passe';
                text['eu'] = 'Sortu zure pasahitza';

                return text[bkt_init_widget.lang];
            }
        });

        return SignupFieldsList;
    });