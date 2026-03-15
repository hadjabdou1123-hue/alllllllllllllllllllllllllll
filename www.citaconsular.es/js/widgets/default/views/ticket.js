define(['jquery', 'underscore', 'backbone', 'widgets/utils', 'widgets/default/models/widgetconfiguration'],
    function($, _, Backbone, Utils, WidgetConfiguration) {
        var TicketContainer = Backbone.View.extend({
            el: $("#idBktDefaultTicketContainer"),
            initialize: function(p_oEvent, p_oServices) {
                this.event = p_oEvent;
                this.oServices = p_oServices;
                this.render();
            },
            render: function() {
                this.widgetconfiguration = new WidgetConfiguration();

                if (this.oServices) {
                    if (typeof this.event.attributes.Appointment !== 'undefined') {
                        this.fillSummaryTicketClientData(this.event.attributes);
                        this.fillSummaryTicketAppointmentData(this.event.attributes);
                    } else {
                        this.fillClientData();
                        this.fillTicketData();
                    }
                } else {
                    this.fillSummaryTicketClientData(this.event.models[0].attributes);
                    this.fillSummaryTicketAppointmentData(this.event.models[0].attributes);
                }

                this.fillInfoData();
                this.printCreatedTime();

                if (bkt_init_widget.publickey === '23d9b76923b741cb4165cb7fadba48129') {
                    $("#idDivBktDefaultTicketData > table > tbody > tr:nth-child(1)").hide();

                    if (oClientValues_248295.selectedServices[0].id === 'bkt291456' ||
                        oClientValues_248295.selectedServices[0].id === 'bkt277420' ||
                        oClientValues_248295.selectedServices[0].id === 'bkt348084' ||
                        oClientValues_248295.selectedServices[0].id === 'bkt414700' ||
                        oClientValues_248295.selectedServices[0].id === 'bkt351571') {
                        $("#idDivBktDefaultTicketData > table > tbody > tr:nth-child(1)").show();
                    }
                }

                if (bkt_init_widget.publickey === '25045938c5303178ff3a90919aa2e6946') {
                    $("#idDivBktDefaultTicketData > table > tbody > tr:nth-child(2)").hide();
                }
            },
            fillClientData: function() {
                this.$('#idDivBktDefaultTicketClient').empty();

                if (typeof oClientValues_248295.clientData.attributes.name !== 'undefined' && oClientValues_248295.clientData.attributes.name.length > 0) {
                    var attributes = {
                        sName: oClientValues_248295.clientData.attributes.name
                    };

                    if (typeof oClientValues_248295.clientData.attributes.document !== 'undefined' && oClientValues_248295.clientData.attributes.document.length > 0) {
                        attributes['sDocument'] = oClientValues_248295.clientData.attributes.document;
                    }

                    var template = _.template($("#idTemTicketClient").html(), attributes);
                    this.$('#idDivBktDefaultTicketClient').append(template);
                }
            },
            fillTicketData: function() {
                var that = this;

                this.$('#idDivBktDefaultTicketData').empty();

                _.each(this.event.attributes, function(value, key) {
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

                    var attributes = {
                        sAgenda: sAgenda,
                        sService: sService,
                        sDate: sDate,
                        sLocator: value.Event.locator,
                        sPeople: sPeople
                    };

                    if (typeof value.Custom !== 'undefined') {
                        attributes['sCustomList'] = value.Custom;
                    }

                    var template = _.template($("#idTemTicketAppointment").html(), attributes);
                    $('#idDivBktDefaultTicketData').append(template);

                });

                //            if(that.oServices.arePaymentServices()){
                //                var oPrices = that.oServices.calculatePrices();
                //                
                //                if(typeof oClientValues_248295.clientData.attributes.Prices !== 'undefined'){
                //                    oPrices.online = oClientValues_248295.clientData.attributes.Prices.online;
                //                    oPrices.offline = oClientValues_248295.clientData.attributes.Prices.offline - oClientValues_248295.clientData.attributes.Prices.online;
                //                    oPrices.total = oClientValues_248295.clientData.attributes.Prices.offline;
                //                }
                //                
                //                var template = _.template($("#idTemTicketAppointmentPayment").html(), {sTotal: oPrices.total+oPrices.currency, sPending: (oPrices.total-oPrices.online)+oPrices.currency, sPaid: oPrices.online+oPrices.currency});
                //                this.$('#idDivBktDefaultTicketData').append(template);
                //            }

                if (typeof oClientValues_248295.priceData !== 'undefined') {
                    var online = String(parseFloat(oClientValues_248295.priceData.online).toFixed(2)).replace('.', ',');
                    var offline = String((parseFloat(oClientValues_248295.priceData.offline) - parseFloat(oClientValues_248295.priceData.online)).toFixed(2)).replace('.', ',');
                    var total = String(parseFloat(oClientValues_248295.priceData.offline).toFixed(2)).replace('.', ',');
                    var currency = String(oClientValues_248295.priceData.currency);

                    //                var template = _.template($("#idTemTicketAppointmentPayment").html(), {sTotal: total + currency, sPending: offline + currency, sPaid: online + currency});
                    var template = _.template($("#idTemTicketAppointmentPayment").html(), {
                        sTotal: oClientValues_248295.priceData.totalString,
                        sPending: oClientValues_248295.priceData.offlineString,
                        sPaid: oClientValues_248295.priceData.onlineString
                    });
                    this.$('#idDivBktDefaultTicketData').append(template);
                }

                //            if(bkt_init_widget.publickey === '23d9b76923b741cb4165cb7fadba48129'){
                //                $("#idDivBktDefaultTicketData > table > tbody > tr:nth-child(1)").hide();
                //                
                //                if(oClientValues_248295.selectedServices[0].id === 'bkt291456' || 
                //                        oClientValues_248295.selectedServices[0].id === 'bkt277420' || 
                //                        oClientValues_248295.selectedServices[0].id === 'bkt348084' || 
                //                        oClientValues_248295.selectedServices[0].id === 'bkt414700' ||
                //                        oClientValues_248295.selectedServices[0].id === 'bkt351571'){
                //                    $("#idDivBktDefaultTicketData > table > tbody > tr:nth-child(1)").show();
                //                }     
                //            }
                //            
                //            if(bkt_init_widget.publickey === '25045938c5303178ff3a90919aa2e6946'){
                //                $("#idDivBktDefaultTicketData > table > tbody > tr:nth-child(2)").hide();
                //            }
            },
            fillTicketClientDataHistory: function() {
                this.$('#idDivBktDefaultTicketClient').empty();

                if (typeof oClientValues_248295.signedInData.name !== 'undefined' && oClientValues_248295.signedInData.name.length > 0) {
                    var attributes = {
                        sName: oClientValues_248295.signedInData.name
                    };

                    if (typeof oClientValues_248295.signedInData.document !== 'undefined' && oClientValues_248295.signedInData.document.length > 0) {
                        attributes['sDocument'] = oClientValues_248295.signedInData.document;
                    }

                    var template = _.template($("#idTemTicketClient").html(), attributes);
                    this.$('#idDivBktDefaultTicketClient').append(template);
                }
            },
            fillTicketDataHistory: function() {
                var that = this;

                this.$('#idDivBktDefaultTicketData').empty();

                for (var i = 0; i < this.event.models.length; i++) {
                    var sAgenda = this.event.models[i].attributes.name;
                    var sService = this.event.models[i].attributes.title;
                    var sDate = this.event.models[i].attributes.date;
                    var sLocator = (typeof this.event.models[i].attributes.locator !== 'undefined') ? this.event.models[i].attributes.locator : '';
                    var sTime = this.event.models[i].attributes.time;
                    var sPeople = this.event.models[i].attributes.people;

                    var sFormatDate = Utils.formatDate(sDate, bkt_init_widget.lang);

                    var sDate = sFormatDate + " - " + sTime + " " + that.getHourText();

                    var template = _.template($("#idTemTicketAppointment").html(), {
                        sAgenda: sAgenda,
                        sService: sService,
                        sDate: sDate,
                        sLocator: sLocator,
                        sPeople: sPeople
                    });
                    this.$('#idDivBktDefaultTicketData').append(template);
                }

                if (typeof this.event.models[0].attributes.total !== 'undefined' && parseFloat(this.event.models[0].attributes.online) > 0 && typeof this.event.models[0].attributes.online !== 'undefined') {
                    var sCurrencie = this.event.models[0].attributes.symbol;
                    var sTotal = this.event.models[0].attributes.total + sCurrencie;
                    var sOnline = this.event.models[0].attributes.online + sCurrencie;
                    var sPending = (parseFloat(sTotal) - parseFloat(sOnline)) + sCurrencie;

                    var template = _.template($("#idTemTicketAppointmentPayment").html(), {
                        sTotal: sTotal,
                        sPending: sPending,
                        sPaid: sOnline
                    });
                    this.$('#idDivBktDefaultTicketData').append(template);
                }
            },
            fillInfoData: function() {
                this.$('#idDivBktDefaultTicketInfo').empty();

                var sInfo = (oClientValues_248295.widgetlabel.hasOwnProperty('extra_info') && oClientValues_248295.widgetlabel.extra_info !== null) ? oClientValues_248295.widgetlabel.extra_info : '';

                if (sInfo.length > 0) {
                    var template = _.template($("#idTemTicketInfo").html(), {
                        sInfo: sInfo
                    });
                    this.$('#idDivBktDefaultTicketInfo').append(template);
                }
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

                $("#idSpanBktTicketCreated").html(this.getCreatedText() + ' ' + created);
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
            fillSummaryTicketClientData: function(data) {
                this.$('#idDivBktDefaultTicketClient').empty();

                var attributes = {
                    sName: (data.Customer.name !== null) ? data.Customer.name : '',
                    sDocument: (data.Customer.document !== null) ? data.Customer.document : ''
                };

                var template = _.template($("#idTemSummaryTicketClient").html(), attributes);
                this.$('#idDivBktDefaultTicketClient').append(template);
            },
            fillSummaryTicketAppointmentData: function(data) {
                this.$('#idDivBktDefaultTicketData').empty();

                var sFormatDate = Utils.formatDate(data.Appointment.date, bkt_init_widget.lang);

                var sDate = sFormatDate;

                //            if(bkt_init_widget.publickey === '26929ed0fc26a5496f732d36fcb7abdae'){
                //                var sDate = sFormatDate;
                //            }            

                var someSoloDate = ['26929ed0fc26a5496f732d36fcb7abdae', '26002d62b670084ca170d027148faabd4', '25059affb98a5550b17c62ddea0ccbc99', '2b29d66d09b71fc5cd7572e4200cb288e'];

                if (someSoloDate.includes(bkt_init_widget.publickey)) {
                    var sDate = sFormatDate;
                }

                var sLocator = (data.Appointment.locator !== null) ? data.Appointment.locator : '';

                var attributes = {
                    sDate: sDate,
                    sTime: data.Appointment.time,
                    sAgenda: data.Appointment.agenda,
                    sLocator: sLocator,
                    sPeople: data.Appointment.people,
                    serviceList: data.Appointment.serviceList
                };

                if (typeof data.Custom !== 'undefined') {
                    attributes['sCustomList'] = data.Custom;
                }

                var template = _.template($("#idTemSummaryTicketAppointment").html(), attributes);

                this.$('#idDivBktDefaultTicketData').append(template);

                //            if(typeof oClientValues_248295.priceData !== 'undefined'){ 
                //                var online = String(parseFloat(oClientValues_248295.priceData.online).toFixed(2)).replace('.', ',');
                //                var offline = String((parseFloat(oClientValues_248295.priceData.offline) - parseFloat(oClientValues_248295.priceData.online)).toFixed(2)).replace('.', ',');
                //                var total = String(parseFloat(oClientValues_248295.priceData.offline).toFixed(2)).replace('.', ',');
                //                var currency = String(oClientValues_248295.priceData.currency);          
                //                
                //                var template = _.template($("#idTemTicketAppointmentPayment").html(), {sTotal: oClientValues_248295.priceData.totalString, sPending: oClientValues_248295.priceData.offlineString, sPaid: oClientValues_248295.priceData.onlineString});
                //                this.$('#idDivBktDefaultTicketData').append(template);              
                //            }
            }
        });

        return TicketContainer;
    });