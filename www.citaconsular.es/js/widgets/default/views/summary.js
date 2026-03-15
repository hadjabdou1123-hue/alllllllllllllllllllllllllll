define(['jquery', 'underscore', 'backbone', 'widgets/default/models/event', 'widgets/utils', 'widgets/default/views/ticket',
        'widgets/default/models/widgetlabel', 'widgets/default/views/languages', 'widgets/default/models/widgetconfiguration', 'widgets/default/collections/services',
        'widgets/default/views/footer'
    ],
    function($, _, Backbone, Event, Utils, TicketView, WidgetLabel, LanguagesSelector, WidgetConfiguration, Services, Footer) {
        var SummaryContainer = Backbone.View.extend({
            el: $("#idBktDefaultSummaryContainer"),
            initialize: function() {
                this.oServices = new Services();
                this.footer = new Footer();
                this.render();
            },
            events: {
                'click #idDivBktSummaryBackButton': 'goToBegin'
                //            'click #idSpanBktSummaryCancelAppointment': 'showCancelAppointment'
            },
            render: function() {
                this.languagesselector = new LanguagesSelector();
                this.widgetconfiguration = new WidgetConfiguration();
                $('#idDivBktSummaryPayment').hide();

                if (typeof oClientValues_248295.priceData !== 'undefined') {
                    var online = String(parseFloat(oClientValues_248295.priceData.online).toFixed(2)).replace('.', ',');
                    var offline = String((parseFloat(oClientValues_248295.priceData.offline) - parseFloat(oClientValues_248295.priceData.online)).toFixed(2)).replace('.', ',');
                    var total = String(parseFloat(oClientValues_248295.priceData.offline).toFixed(2)).replace('.', ',');
                    var currency = String(oClientValues_248295.priceData.currency);

                    //                $('#idDivBktSummaryPaymentContentTotalAmount').text(total + currency);
                    //                $('#idDivBktSummaryPaymentContentPaidAmount').text(online + currency);
                    //                $('#idDivBktSummaryPaymentContentPendingAmount').text(offline + currency);
                    $('#idDivBktSummaryPaymentContentTotalAmount').text(oClientValues_248295.priceData.totalString);
                    $('#idDivBktSummaryPaymentContentPaidAmount').text(oClientValues_248295.priceData.onlineString);
                    $('#idDivBktSummaryPaymentContentPendingAmount').text(oClientValues_248295.priceData.offlineString);
                    $('#idDivBktSummaryPayment').show();
                }

                this.createAppointment();
            },
            handleErrors: function(p_someErrors) {
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
                });
            },
            createAppointment: function() {
                if (!this.AreFieldsSet()) {
                    this.goToBegin();
                    return false;
                }

                var that = this;
                var identifier = new Date().getTime();
                this.showLoading(identifier);

                var data = {
                    services: Utils.obtainObjectsIds(oClientValues_248295.selectedServices),
                    agendas: Utils.obtainObjectsIds(oClientValues_248295.selectedAgendas),
                    date: oClientValues_248295.selectedDate,
                    time: oClientValues_248295.selectedTime,
                    bktToken: oClientValues_248295.bktToken
                }

                if (typeof oClientValues_248295.Niubiz !== 'undefined') {
                    data.Niubiz = oClientValues_248295.Niubiz;
                }

                _.each(oClientValues_248295.clientData.attributes, function(value, key) {
                    data[key] = value;
                });

                this.event = new Event();

                this.listenTo(this.event, "change", function() {
                    if (this.event.attributes.errors) {
                        this.handleErrors(this.event.attributes.errors);
                    } else {
                        this.fillData(this.event);
                        this.show();
                    }

                    this.hideLoading(identifier);
                });

                this.event.fetch({
                    data: data,
                    error: (function() {
                        that.showLoadDataError();
                    })
                });
            },
            show: function() {
                var bIsSignedIn = (typeof oClientValues_248295.signedInData !== 'undefined') ? true : false;

                $(".clsBktDefaultErrorContainer").hide();
                $(".clsBktDefaultWindow").hide();
                $("#idBktDefaultCCCStrContainer").hide();
                $("#idDivBktSummaryContent").show();

                if (bkt_init_widget.publickey === '23d9b76923b741cb4165cb7fadba48129') {
                    $("#idBktWidgetBody #idBktWidgetDefaultBodyContainer div.clsDivBktSummaryAppointmentRow:nth-child(1)").hide();

                    if (oClientValues_248295.selectedServices[0].id === 'bkt291456' ||
                        oClientValues_248295.selectedServices[0].id === 'bkt277420' ||
                        oClientValues_248295.selectedServices[0].id === 'bkt348084' ||
                        oClientValues_248295.selectedServices[0].id === 'bkt414700' ||
                        oClientValues_248295.selectedServices[0].id === 'bkt351571') {
                        $("#idBktWidgetBody #idBktWidgetDefaultBodyContainer div.clsDivBktSummaryAppointmentRow:nth-child(1)").show();
                        $("#idBktWidgetBody #idBktWidgetDefaultBodyContainer #idDivBktSummaryHeader").html('Su reserva se ha realizado correctamente');
                    }
                }

                this.$el.show();

                if (bIsSignedIn === false) {
                    delete oClientValues_248295.bktToken;
                }
            },
            fillData: function(data) {
                this.emptyContainers();

                if (typeof data.attributes.Appointment !== 'undefined') {
                    this.fillSummaryHeader(data.attributes);
                    this.fillSummaryAccess(data.attributes);
                    this.fillSummaryClient(data.attributes);
                    this.fillSummaryAppointment(data.attributes);
                } else {
                    this.fillHeaderData();
                    this.fillAccessData();
                    this.fillClientData(data);
                    this.fillAppointmentData();
                }

                this.printTicket();
                this.printCreatedTime();
                this.fillInfoData();
            },
            emptyContainers: function() {
                this.$('#idDivBktSummaryHeaderContainer').empty();
                this.$('#idDivBktSummaryBodyTop').empty();
                this.$('#idDivBktSummaryClientContent').empty();
                this.$('#idDivBktSummaryAppointmentsContent').empty();
                this.$('#idDivBktSummaryAppointmentsInfoTop').empty();
                this.$('#idDivBktSummaryAppointmentsInfoMiddle').empty();
                this.$('#idDivBktSummaryAppointmentsInfoBottom').empty();
                this.$('#idSpanBktSummaryCreatedTime').remove();
            },
            fillHeaderData: function() {
                var iState = this.event.attributes[0].Event.state;
                sEmail = oClientValues_248295.clientData.attributes.email;

                var template = _.template($("#idTemSummaryHeader").html(), {
                    iState: iState,
                    sEmail: sEmail
                });
                this.$('#idDivBktSummaryHeaderContainer').append(template);
            },
            fillAccessData: function() {
                var sLogin = '';
                var sPassword = '';
                var bFirstAppointment = (typeof oClientValues_248295.widgetconfiguration.registration_type !== 'undefined' && parseInt(oClientValues_248295.widgetconfiguration.registration_type) === this.widgetconfiguration.iFirstAppointment) ? true : false;
                var bIsSignedIn = (typeof oClientValues_248295.signedInData !== 'undefined') ? true : false;
                var bIsSignIn = (oClientValues_248295.clientData && oClientValues_248295.clientData.attributes.logintype && oClientValues_248295.clientData.attributes.client_signin) ? true : false;

                if (bFirstAppointment || bIsSignedIn || bIsSignIn) {
                    this.$('#idDivBktSummaryBodyTop').hide();
                    this.$('#idBktSummaryFooterLeft').hide();

                    return;
                } else {
                    this.$('#idDivBktSummaryBodyTop').show();
                }

                sLogin = oClientValues_248295.clientData.attributes.email;
                sPassword = this.event.attributes[0].Client.password;

                var template = _.template($("#idTemSummaryAccess").html(), {
                    sLogin: sLogin,
                    sPassword: sPassword
                });
                this.$('#idDivBktSummaryBodyTop').append(template);
            },
            fillClientData: function(data) {
                if (typeof oClientValues_248295.clientData.attributes.name !== 'undefined' && oClientValues_248295.clientData.attributes.name.length > 0) {
                    if (typeof data.attributes[0].Client !== 'undefined') {
                        if (typeof data.attributes[0].Client.name !== 'undefined' && data.attributes[0].Client.name.length > 0) {
                            oClientValues_248295.clientData.attributes.name = data.attributes[0].Client.name;
                        }
                    }

                    var attributes = {
                        sName: oClientValues_248295.clientData.attributes.name
                    };

                    if (typeof data.attributes[0].Client !== 'undefined') {
                        if (typeof data.attributes[0].Client.document !== 'undefined' && data.attributes[0].Client.document.length > 0) {
                            oClientValues_248295.clientData.attributes.document = data.attributes[0].Client.document;

                            attributes['sDocument'] = data.attributes[0].Client.document;
                        }
                    }

                    var template = _.template($("#idTemSummaryClient").html(), attributes);
                    this.$('#idDivBktSummaryAppointmentsContent').append(template);
                }
            },
            fillAppointmentData: function() {
                var iCount = 0;
                var that = this;

                _.each(this.event.attributes, function(value, key) {
                    if (isNaN(key)) return;

                    var sFirstClass = '';
                    var sAgenda = value.Event.agenda_name;
                    var sService = value.Event.service;
                    var sPeople = value.Event.people;
                    var sFormatDate = Utils.formatDate(oClientValues_248295.selectedDate, bkt_init_widget.lang);

                    var sDate = sFormatDate + " - " + value.Event.time + " " + that.getHourText();

                    if (typeof oClientValues_248295.widgetconfiguration.am_pm_format !== 'undefined' && oClientValues_248295.widgetconfiguration.am_pm_format === true) {
                        sDate = sFormatDate + " - " + Utils.timeToAmPm(value.Event.time);
                    }

                    //                if(bkt_init_widget.publickey === '26929ed0fc26a5496f732d36fcb7abdae'){
                    //                    var sDate = sFormatDate;
                    //                }

                    var someSoloDate = ['26929ed0fc26a5496f732d36fcb7abdae', '26002d62b670084ca170d027148faabd4', '25059affb98a5550b17c62ddea0ccbc99', '2b29d66d09b71fc5cd7572e4200cb288e'];

                    if (someSoloDate.includes(bkt_init_widget.publickey)) {
                        var sDate = sFormatDate;
                    }

                    if (iCount === 0) {
                        sFirstClass = 'clsDivBktSummaryAppointmentFirst';
                    }

                    var attributes = {
                        sAgenda: sAgenda,
                        sService: sService,
                        sDate: sDate,
                        sLocator: value.Event.locator,
                        sFirstClass: sFirstClass,
                        sPeople: sPeople
                    };

                    if (typeof value.Custom !== 'undefined') {
                        attributes['sCustomList'] = value.Custom;
                    }

                    var template = _.template($("#idTemSummaryAppointment").html(), attributes);

                    $('#idDivBktSummaryAppointmentsContent').append(template);
                    iCount++;
                });
            },
            fillInfoData: function() {
                this.widgetLabel = new WidgetLabel();

                if (oClientValues_248295.widgetlabel.hasOwnProperty('show_extra_info') && parseInt(oClientValues_248295.widgetlabel.show_extra_info) === this.widgetLabel.iShowExtraInfo) {
                    var sInfo = (oClientValues_248295.widgetlabel.hasOwnProperty('extra_info') && oClientValues_248295.widgetlabel.extra_info !== null) ? oClientValues_248295.widgetlabel.extra_info : '';
                    var template = _.template($("#idTemSummaryInfo").html(), {
                        sInfo: sInfo
                    });

                    if (oClientValues_248295.widgetlabel.hasOwnProperty('show_at')) {
                        if (parseInt(oClientValues_248295.widgetlabel.show_at) === this.widgetLabel.iShowatBeforeAccountDetails) {
                            this.$('#idDivBktSummaryAppointmentsInfoTop').append(template);
                            this.$('#idDivBktSummaryAppointmentsInfoTop').show();
                        } else if (parseInt(oClientValues_248295.widgetlabel.show_at) === this.widgetLabel.iShowatBeforeAppointmentSummary) {
                            this.$('#idDivBktSummaryAppointmentsInfoMiddle').append(template);
                            this.$('#idDivBktSummaryAppointmentsInfoMiddle').show();
                        } else {
                            this.$('#idDivBktSummaryAppointmentsInfoBottom').append(template);
                            this.$('#idDivBktSummaryAppointmentsInfoBottom').show();
                        }
                    } else {
                        this.$('#idDivBktSummaryAppointmentsInfoBottom').append(template);
                        this.$('#idDivBktSummaryAppointmentsInfoBottom').show();
                    }
                }
            },
            AreFieldsSet: function() {
                if (typeof oClientValues_248295.selectedServices === 'undefined' ||
                    typeof oClientValues_248295.selectedAgendas === 'undefined' ||
                    typeof oClientValues_248295.selectedDate === 'undefined' ||
                    typeof oClientValues_248295.selectedTime === 'undefined' ||
                    typeof oClientValues_248295.clientData === 'undefined' ||
                    typeof oClientValues_248295.clientData.attributes.event_created === 'undefined') {
                    return false;
                }
                return true;
            },
            printTicket: function() {
                var that = this;

                $("#idDivBktSummaryPrinter").unbind('click').click(function() {
                    var ticketView = new TicketView(that.event, that.oServices);

                    var ticketWindow = window.open();

                    ticketWindow.document.write('<html><head><title>.: Ticket :.</title></head><body>' + $('#idBktDefaultTicketContainer').html() + '</body></html>');

                    ticketWindow.stop();
                    ticketWindow.print();
                    ticketWindow.close();

                    delete ticketView;

                    return true;
                });
            },
            showCancelAppointment: function() {
                $('#idBktDefaultCancelAppointmentContainer').show();

                $('#idBktDefaultCancelAppointmentHeaderClose').click(function() {
                    $('#idBktDefaultCancelAppointmentContainer').hide();
                });
            },
            showLoadDataError: function() {
                this.show();
                $("#idDivBktSummaryContent").hide();

                $("#idDivBktDefaultSummaryErrorContainer").show();
                $('.clsDivBktWidgetDefaultLoadingContainer').remove();
            },
            showLoading: function(p_iIdentifier) {
                $('#idBktWidgetDefaultBodyContainer').prepend('<div class="clsDivBktWidgetDefaultLoadingContainer clsDivBktLoadingContainer' + p_iIdentifier + '"><div class="clsDivBktWidgetDefaultLoading"></div></div>');
            },
            hideLoading: function(p_iIdentifier) {
                $('.clsDivBktLoadingContainer' + p_iIdentifier).remove();
            },
            resetData: function() {
                delete oClientValues_248295.clientData;
                delete oClientValues_248295.selectedAgendas;
                delete oClientValues_248295.selectedDate;
                delete oClientValues_248295.selectedServices;
                delete oClientValues_248295.selectedExtras;
                delete oClientValues_248295.selectedTime;

                if (typeof oClientValues_248295.customData !== 'undefined') {
                    delete oClientValues_248295.customData;
                }

                if (typeof oClientValues_248295.waitingListData !== 'undefined') {
                    delete oClientValues_248295.waitingListData;
                }

                if (typeof oClientValues_248295.Niubiz !== 'undefined') {
                    delete oClientValues_248295.Niubiz;
                }
            },
            goToBegin: function() {
                this.resetData();
                Backbone.history.navigate('services', {
                    trigger: true,
                    replace: true
                });
            },
            getHourText: function() {
                var textHour = [];
                textHour['en'] = 'hours';
                textHour['pt'] = 'horas';
                textHour['ca'] = 'hores';
                textHour['es'] = 'horas';
                textHour['it'] = 'hours';
                textHour['du'] = 'hours';
                textHour['uk'] = 'годин';
                textHour['de'] = 'stunden';
                textHour['ko'] = '시간';
                textHour['fr'] = 'heures';
                textHour['eu'] = 'orduak';

                return textHour[bkt_init_widget.lang];
            },
            printCreatedTime: function() {
                var created = Utils.formatDate(Utils.getDateNow(), bkt_init_widget.lang) + ' ' + Utils.getTimeNow();

                $("#idSpanBktSummaryCancelAppointment").after('<span id="idSpanBktSummaryCreatedTime"> ' + this.getCreatedText() + ' ' + created + '</span>');
            },
            getCreatedText: function() {
                var textCreated = [];
                textCreated['en'] = 'created';
                textCreated['pt'] = 'criado';
                textCreated['ca'] = 'creada el';
                textCreated['es'] = 'creada el';
                textCreated['it'] = 'created';
                textCreated['du'] = 'created';
                textCreated['uk'] = 'створений';
                textCreated['de'] = 'erstellt';
                textCreated['ko'] = '예약완료';
                textCreated['fr'] = 'crée';
                textCreated['eu'] = 'sortuta';

                return textCreated[bkt_init_widget.lang];
            },
            fillSummaryHeader: function(data) {
                var iState = data.Appointment.state;

                var template = _.template($("#idTemSummaryHeader").html(), {
                    iState: iState
                });
                this.$('#idDivBktSummaryHeaderContainer').append(template);
            },
            fillSummaryAccess: function(data) {
                var sLogin = '';
                var sPassword = '';

                var bFirstAppointment = (typeof oClientValues_248295.widgetconfiguration.registration_type !== 'undefined' && parseInt(oClientValues_248295.widgetconfiguration.registration_type) === this.widgetconfiguration.iFirstAppointment) ? true : false;
                var bIsSignedIn = (typeof oClientValues_248295.signedInData !== 'undefined') ? true : false;
                var bIsSignIn = (oClientValues_248295.clientData && oClientValues_248295.clientData.attributes.logintype && oClientValues_248295.clientData.attributes.client_signin) ? true : false;

                if (bFirstAppointment || bIsSignedIn || bIsSignIn) {
                    this.$('#idDivBktSummaryBodyTop').hide();
                    this.$('#idBktSummaryFooterLeft').hide();

                    return;
                }

                this.$('#idDivBktSummaryBodyTop').show();

                sLogin = (data.Customer.email !== null) ? data.Customer.email : '';
                sPassword = (data.Customer.password !== null) ? data.Customer.password : '';

                var template = _.template($("#idTemSummaryAccess").html(), {
                    sLogin: sLogin,
                    sPassword: sPassword
                });
                this.$('#idDivBktSummaryBodyTop').append(template);
            },
            fillSummaryClient: function(data) {
                var attributes = {
                    sName: (data.Customer.name !== null) ? data.Customer.name : '',
                    sDocument: (data.Customer.document !== null) ? data.Customer.document : ''
                };

                var template = _.template($("#idTemSummaryClient").html(), attributes);
                this.$('#idDivBktSummaryAppointmentsContent').append(template);
            },
            fillSummaryAppointment: function(data) {
                var sFormatDate = Utils.formatDate(data.Appointment.date, bkt_init_widget.lang);

                var sDate = sFormatDate;

                //            if(bkt_init_widget.publickey === '26929ed0fc26a5496f732d36fcb7abdae'){
                //                var sDate = sFormatDate;
                //            }            

                var someSoloDate = ['26929ed0fc26a5496f732d36fcb7abdae', '26002d62b670084ca170d027148faabd4', '25059affb98a5550b17c62ddea0ccbc99', '2b29d66d09b71fc5cd7572e4200cb288e'];

                if (someSoloDate.includes(bkt_init_widget.publickey)) {
                    var sDate = sFormatDate;
                }

                var template = _.template($("#idTemSummaryMultiselectAppointment").html(), {
                    sDate: sDate,
                    sTime: data.Appointment.time,
                    sAgenda: data.Appointment.agenda,
                    sLocator: data.Appointment.locator,
                    sPeople: data.Appointment.people,
                    serviceList: data.Appointment.serviceList
                });

                this.$('#idDivBktSummaryAppointmentsContent').append(template);
            }
        });

        return SummaryContainer;
    });