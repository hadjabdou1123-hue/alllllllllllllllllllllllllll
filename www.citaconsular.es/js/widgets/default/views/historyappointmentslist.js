define(['jquery', 'underscore', 'backbone', 'widgets/default/collections/events', 'widgets/utils', 'widgets/default/views/footer', 'widgets/default/models/eventhistory',
        'widgets/default/views/ticket'
    ],
    function($, _, Backbone, Events, Utils, Footer, EventHistory, TicketView) {
        var HistoryAppointmentsList = Backbone.View.extend({
            el: $("#idDivBktAccountHistoryContent"),
            template: _.template($("#idTemEventData").html()),
            loaded: true,
            events: {
                'click .clsDivBktAccountHistoryContentDataPrintIcon': 'printTicket',
                'click .clsDivBktAccountHistoryContentDataDeleteIcon': 'confirmEvent',
                'click .clsDivCancelButton': 'cancelEvent',
                'click .clsDivBackButton': 'cancelEvent',
                'click .clsDivContinueButton': 'deleteEvent',
                'click': 'stopPropagation'
            },
            initialize: function(options) {
                this.parentView = options.parentView;
                this.identifier = new Date().getTime();
                this.footer = new Footer();
                this.eventHistory = new EventHistory();
            },
            start: function() {
                $("#idDivBktAccountHistoryContentNoEvents").hide();
                $('#idDivBktAccountHistoryCancelAppointmentContainer').hide();
                $('#idDivBktAccountHistoryCancelAppointmentConfirmContainer').hide();
                $('#idDivBktAccountHistoryCancelAppointmentErrorContainer').hide();

                this.showLoading();
                this.loadEvents();
            },
            loadEvents: function() {
                $('.clsDivBktAccountHistoryContainerDataRow').remove();

                var that = this;
                this.events = new Events();

                this.listenTo(this.events, "reset", function() {
                    this.doRender();
                });

                var data = $.extend(true, {}, bkt_init_widget);
                data.signedin = oClientValues_248295.signedInData.signedin;
                data.bktToken = oClientValues_248295.bktToken;

                this.events.fetch({
                    data: data,
                    error: (function() {
                        that.loadDataError();
                    })
                });
            },
            doRender: function() {
                if (this.checkEmptyEvents() === true) {
                    this.showNoEvents();
                } else {
                    this.render();
                }
            },
            checkEmptyEvents: function() {
                if (this.events.models.length <= 0) {
                    return true;
                }

                if (typeof this.events.models[0].attributes.errors !== 'undefined') {
                    return true;
                }

                return false;
            },
            showNoEvents: function() {
                $("#idDivBktAccountHistoryContentNoEvents").show();
                this.$el.hide();

                this.hideLoading();
            },
            render: function() {
                if (this.events.length > 0 && typeof this.events.models[0].attributes.block !== 'undefined') {
                    for (var i = 0; i < this.events.length; i++) {
                        if (this.events.models[i].attributes.block === 'future') {
                            this.fillEventData(this.events.models[i].attributes);
                        }
                    }

                    for (var j = 0; j < this.events.length; j++) {
                        if (this.events.models[j].attributes.block === 'past') {
                            this.fillEventData(this.events.models[j].attributes);
                        }
                    }
                } else {
                    for (var i = 0; i < this.events.length; i++) {
                        this.fillEventData(this.events.models[i].attributes);
                    }
                }

                this.$el.show();
                this.hideLoading();
            },
            fillEventData: function(event) {
                var sState = '';
                var sClass = '';

                if (typeof event.state && event.state === this.eventHistory.iStateCanceled) {
                    sClass = 'clsDivBktAccountHistoryContentDataCanceled';
                    sState = this.getStateCanceledText();
                } else if (typeof event.state && event.state === this.eventHistory.iStatePending) {
                    sClass = 'clsDivBktAccountHistoryContentDataPending';
                    sState = this.getStatePendingText();
                } else if (typeof event.state && event.state === this.eventHistory.iStateRejected) {
                    sClass = 'clsDivBktAccountHistoryContentDataRejected';
                    sState = this.getStateRejectedText();
                } else {
                    sClass = 'clsDivBktAccountHistoryContentDataCompleted';
                    sState = this.getStateConfirmedText();
                }

                var time = event.time;

                if (typeof oClientValues_248295.widgetconfiguration.am_pm_format !== 'undefined' && oClientValues_248295.widgetconfiguration.am_pm_format === true) {
                    time = Utils.timeToAmPm(event.time);
                }

                var parameters = {
                    event: event.id,
                    title: (typeof event.title !== 'undefined' && event.title.length > 0) ? event.title : '',
                    date: event.date,
                    time: time,
                    cancel: (typeof event.cancel !== 'undefined' && event.cancel === true) ? true : false,
                    print: (typeof event.print !== 'undefined' && event.print === true) ? true : false,
                    color: sClass,
                    state: sState,
                    videocall: (typeof event.videocall !== 'undefined' && event.videocall.length > 0) ? event.videocall : '',
                    poll: (typeof event.poll !== 'undefined' && event.poll.length > 0) ? event.poll : '',
                    extraList: event.extraList,
                    eventField: event.eventField
                };

                //            this.$el.append(this.template(parameters)); 

                //            var template = _.template($("#idTemSignupInputFieldsRowContainer").html(), {iRow: this.iRowsCount, sClass: sClass});                
                var template = this.template(parameters);

                if (typeof event.block !== 'undefined' && event.block === 'past') {
                    $('#idDivBktAccountHistoryContentPastTitle').show();
                    $('#idDivBktAccountHistoryContentPast').show();
                    $('#idDivBktAccountHistoryContentPast').css('display', 'table');

                    $('#idDivBktAccountHistoryContentPast').append(template);
                } else {
                    this.$el.append(template);
                }
            },
            loadDataError: function() {
                //            Utils.deleteCookie();
                this.showLoadDataError();
                //            this.footer.doSignOutAccount();
            },
            showLoadDataError: function() {
                this.loaded = false;

                this.$el.hide();

                $(".clsBktDefaultWindow").hide();
                $(".clsDivBktSubHeaderExtra").hide();
                $("#idBktDefaultAccountHistoryErrorContainer").show();

                $(".clsDivBktWidgetDefaultLoadingContainer").remove();

                this.parentView.$el.show();
            },
            showLoading: function() {
                $('#idBktWidgetDefaultBodyContainer').prepend('<div class="clsDivBktWidgetDefaultLoadingContainer clsDivBktLoadingContainer' + this.identifier + '"><div class="clsDivBktWidgetDefaultLoading"></div></div>');
            },
            hideLoading: function() {
                $('.clsDivBktLoadingContainer' + this.identifier).remove();
            },
            getStateCanceledText: function() {
                var textCanceled = [];
                textCanceled['en'] = 'Canceled';
                textCanceled['pt'] = 'Cancelada';
                textCanceled['ca'] = 'Cancel·lada';
                textCanceled['es'] = 'Cancelada';
                textCanceled['it'] = 'Canceled';
                textCanceled['du'] = 'Canceled';
                textCanceled['uk'] = 'скасований';
                textCanceled['de'] = 'Storniert';
                textCanceled['ko'] = '취소';
                textCanceled['fr'] = 'Annulé';
                textCanceled['eu'] = 'Utzita';

                return textCanceled[bkt_init_widget.lang];
            },
            getStateConfirmedText: function() {
                var textConfirmed = [];
                textConfirmed['en'] = 'Confirmed';
                textConfirmed['pt'] = 'Confirmada';
                textConfirmed['ca'] = 'Confirmada';
                textConfirmed['es'] = 'Confirmada';
                textConfirmed['it'] = 'Confirmed';
                textConfirmed['du'] = 'Confirmed';
                textConfirmed['uk'] = 'підтверджений';
                textConfirmed['de'] = 'Bestätigt';
                textConfirmed['ko'] = '확정';
                textConfirmed['fr'] = 'Confirmé';
                textConfirmed['eu'] = 'Berretsita';

                return textConfirmed[bkt_init_widget.lang];
            },
            getStateRejectedText: function() {
                var textRejected = [];
                textRejected['en'] = 'Rejected';
                textRejected['pt'] = 'Rejeitada';
                textRejected['ca'] = 'Rebutjada';
                textRejected['es'] = 'Rechazada';
                textRejected['it'] = 'Rejected';
                textRejected['du'] = 'Rejected';
                textRejected['uk'] = 'відхилено';
                textRejected['de'] = 'Abgelehnt';
                textRejected['ko'] = '승인 거부';
                textRejected['fr'] = 'Refusé';
                textRejected['eu'] = 'Baztertuta';

                return textRejected[bkt_init_widget.lang];
            },
            getStatePendingText: function() {
                var textPending = [];
                textPending['en'] = 'Pending confirmation';
                textPending['pt'] = 'Enquanto se aguarda confirmação';
                textPending['ca'] = 'Confirmació pendent';
                textPending['es'] = 'Confirmación pendiente';
                textPending['it'] = 'Pending confirmation';
                textPending['du'] = 'Pending confirmation';
                textPending['uk'] = 'В очікуванні підтвердження';
                textPending['de'] = 'Ausstehende Buchungsbestätigung';
                textPending['ko'] = '확인 대기 중';
                textPending['fr'] = 'En attente de confirmation';
                textPending['eu'] = 'Berresteke';

                return textPending[bkt_init_widget.lang];
            },
            printTicket: function(ev) {
                var that = this;

                var event = '';

                if ($(ev.target).parent().parent().hasClass('clsDivBktAccountHistoryContentDataMobile')) {
                    event = $(ev.target).parent().parent().parent().parent().attr('id');
                } else {
                    event = $(ev.target).parent().parent().parent().attr('id');
                }

                this.eventsPrint = new Events();

                this.listenTo(this.eventsPrint, "reset", function() {
                    var ticketView = new TicketView(this.eventsPrint);

                    var ticketWindow = window.open();

                    ticketWindow.document.write('<html><head><title>.: Ticket :.</title></head><body>' + $('#idBktDefaultTicketContainer').html() + '</body></html>');

                    ticketWindow.stop();
                    ticketWindow.print();
                    ticketWindow.close();

                    delete ticketView;

                    return true;
                });

                this.eventsPrint.url = Utils.get_server_url() + "geteventhistory/";

                var data = $.extend(true, {}, bkt_init_widget);
                data.event = event;
                data.signedin = oClientValues_248295.signedInData.signedin;
                data.bktToken = oClientValues_248295.bktToken;

                this.eventsPrint.fetch({
                    data: data,
                    error: (function() {
                        that.loadDataError();
                    })
                });
            },
            stopPropagation: function(event) {
                event.stopPropagation();
            },
            cancelEvent: function() {
                this.event = 0;

                $('.clsBktDefaultPopupOverlay').remove();
                $('#idDivBktAccountHistoryCancelAppointmentContainer').hide();
                $('#idDivBktAccountHistoryCancelAppointmentConfirmContainer').hide();
                $('#idDivBktAccountHistoryCancelAppointmentErrorContainer').hide();
            },
            showCancelAppointmentConfirmation: function() {
                $('#idBktWidgetDefaultBodyContainer').append('<div class="clsBktDefaultPopupOverlay" style="display: block;"></div>');
                $('#idDivBktAccountHistoryCancelAppointmentContainer').show();
                $('#idDivBktAccountHistoryCancelAppointmentErrorContainer').hide();
                $('#idDivBktAccountHistoryCancelAppointmentConfirmContainer').show();
            },
            confirmEvent: function(ev) {
                if ($(ev.target).parent().parent().hasClass('clsDivBktAccountHistoryContentDataMobile')) {
                    this.event = $(ev.target).parent().parent().parent().parent().attr('id');
                } else {
                    this.event = $(ev.target).parent().parent().parent().attr('id');
                }

                this.showCancelAppointmentConfirmation();
            },
            deleteEvent: function() {
                $('#idDivBktAccountHistoryCancelAppointmentConfirmContainer').hide();

                this.showLoading();
                var that = this;

                this.eventsDelete = new Events();

                this.listenTo(this.eventsDelete, "reset", function() {
                    if (typeof this.eventsDelete.models[0].attributes.errors !== 'undefined') {
                        that.deleteEventError();
                    } else {
                        if (typeof this.eventsDelete.models[0].attributes.event !== 'undefined') {
                            $('#' + this.eventsDelete.models[0].attributes.event + ' .clsDivBktAccountHistoryContentDataPrintContainer').html('');
                            $('#' + this.eventsDelete.models[0].attributes.event + ' .clsDivBktAccountHistoryContentDataDeleteContainer').html('');

                            $('#' + this.eventsDelete.models[0].attributes.event + ' .clsDivBktAccountHistoryContentDataState').removeClass('clsDivBktAccountHistoryContentDataCompleted');
                            $('#' + this.eventsDelete.models[0].attributes.event + ' .clsDivBktAccountHistoryContentDataState').removeClass('clsDivBktAccountHistoryContentDataPending');
                            $('#' + this.eventsDelete.models[0].attributes.event + ' .clsDivBktAccountHistoryContentDataState').addClass('clsDivBktAccountHistoryContentDataCanceled');
                            $('#' + this.eventsDelete.models[0].attributes.event + ' .clsDivBktAccountHistoryContentDataState').html(that.getStateCanceledText());
                        }

                        that.cancelEvent();
                    }

                    that.hideLoading();
                });

                this.eventsDelete.url = Utils.get_server_url() + "deleteeventhistory/";

                var data = $.extend(true, {}, bkt_init_widget);
                data.event = this.event;
                data.signedin = oClientValues_248295.signedInData.signedin;
                data.bktToken = oClientValues_248295.bktToken;

                this.eventsDelete.fetch({
                    data: data,
                    error: (function() {
                        that.deleteEventError();
                    })
                });
            },
            deleteEventError: function() {
                $('#idDivBktAccountHistoryCancelAppointmentConfirmContainer').hide();
                $('#idDivBktAccountHistoryCancelAppointmentErrorContainer').show();

                this.hideLoading();
            }
        });

        return HistoryAppointmentsList;
    });