define(['jquery', 'underscore', 'backbone', 'widgets/default/collections/slots', 'widgets/utils'],
    function($, _, Backbone, Slots, Utils) {
        var DateTimeList = Backbone.View.extend({
            el: $("#idTimeListTable"),
            template: _.template($("#idTemAvailableTime").html()),
            initialize: function(options) {
                this.parentView = options.parentView;
                this.iMaxSlotsColumns = 5;
                this.iMinSlotsPerColumn = 10;
                this.iMaxAvailableDayMonthsIterations = 9;

                //            if(bkt_init_widget.publickey === '28330379fc95acafd31ee9e8938c278ff'){
                //                this.iMaxAvailableDayMonthsIterations = 2;
                //            }            

                this.render();
            },
            events: {
                'click #idDivWaitingListSubmit': 'waitingListSubmit',
                'click #idSpanWaitingListOtherTime': 'showTimeList',
                'click .clsDivDatetimeSlotWaitingList': 'showWaitingList'
            },
            render: function() {
                $('.clsDivBktWidgetDefaultLoadingContainer').remove();

                if ($('#idDivBktWidgetTimezoneSelectorContainer').length > 0) {
                    $('#idDivBktWidgetTimezoneSelectorContainer').hide();

                    if (typeof Intl == 'object' && typeof Intl.NumberFormat == 'function') {
                        $('#idDivBktWidgetTimezoneSelectorContainer').show();
                    }
                }

                this.firstLoad(this.parentView.selectedDate);
            },
            firstLoad: function(date) {
                this.iAvaiblableDayMonthCount = 1;
                var identifier = new Date().getTime();
                var bAvailableDay = false;

                this.showLoading(identifier);

                this.parentView.slots = new Slots();

                var slotsAux = '';

                this.listenTo(this.parentView.slots, "reset", function() {
                    if (this.iAvaiblableDayMonthCount === 1) {
                        slotsAux = this.parentView.slots.clone();
                    }

                    bAvailableDay = this.dayAvailable();

                    if ($.inArray(bkt_init_widget.publickey, ['25e338cfff8337be8b02e874db94d37a6']) !== -1) {
                        bAvailableDay = true;
                    }

                    if (bkt_init_widget.publickey === '28c50bfc6b73efbf6686c0a9f02040b6c') {
                        bAvailableDay = true;
                    }

                    if ((bAvailableDay === false) && (this.iAvaiblableDayMonthCount < this.iMaxAvailableDayMonthsIterations)) {
                        this.nextMonthSlots();
                    } else {
                        if ((bAvailableDay === false) && (this.iAvaiblableDayMonthCount >= this.iMaxAvailableDayMonthsIterations)) {
                            this.parentView.slots = slotsAux;
                        }

                        this.$el.empty();
                        this.showAvailableHours();
                        this.parentView.datetimedatepicker.drawDatepicker();
                        this.parentView.datetimeslidedate.displayDateText();

                        this.hideLoading(identifier);
                    }
                });

                this.bindSlotsFetch(date);
            },
            dayAvailable: function() {
                var someSlots = this.parentView.slots.models;
                var bStopSearch = false;
                var sInitDate = "9999-12-12";

                for (var i = 0; i < someSlots.length; i++) {
                    if (typeof someSlots[i].attributes.errors !== 'undefined') {
                        this.showLoadDataError();
                        return false;
                    } else if ($.inArray(bkt_init_widget.publickey, ['25e338cfff8337be8b02e874db94d37a6']) !== -1) {
                        var oInitDate = Utils.plainDateToObject(sInitDate);
                        var oIteratedDate = Utils.plainDateToObject(someSlots[i].attributes.date);

                        if (oIteratedDate <= oInitDate) {
                            sInitDate = someSlots[i].attributes.date;
                            bStopSearch = true;
                        }
                    } else {
                        if ($.isEmptyObject(someSlots[i].attributes.times) === false && typeof someSlots[i].attributes.times.length === 'undefined') {
                            var oInitDate = Utils.plainDateToObject(sInitDate);
                            var oIteratedDate = Utils.plainDateToObject(someSlots[i].attributes.date);

                            if (oIteratedDate <= oInitDate) {
                                sInitDate = someSlots[i].attributes.date;
                                bStopSearch = true;
                            }
                        }
                    }
                }

                if (bStopSearch) {
                    this.parentView.selectedDate = sInitDate;
                    this.parentView.firstAvailableDate = sInitDate;
                    return true;
                }

                return false;
            },
            nextMonthSlots: function() {
                var nextDate = Utils.plainDateToObject(Utils.getFirstMonthDay(this.parentView.selectedDate));

                nextDate.setMonth(nextDate.getMonth() + this.iAvaiblableDayMonthCount);

                this.iAvaiblableDayMonthCount++;

                var plainDate = Utils.dateJsToPlain(nextDate);

                this.bindSlotsFetch(plainDate);
            },
            datepickerChangeMonth: function(date) {
                var identifier = new Date().getTime();

                this.parentView.datetimedatepicker.hideDatepicker();
                this.showLoading(identifier);

                this.parentView.slots = new Slots();

                this.listenTo(this.parentView.slots, "reset", function() {
                    this.parentView.datetimedatepicker.prepareMonthDaysSlots();
                    this.parentView.datetimedatepicker.displayDatepicker();

                    this.hideLoading(identifier);
                });

                var plainDate = Utils.dateJsToPlain(date);

                this.bindSlotsFetch(plainDate);
            },
            slideDateChangeMonth: function(date) {
                var identifier = new Date().getTime();

                this.showLoading(identifier);

                this.parentView.slots = new Slots();

                this.listenTo(this.parentView.slots, "reset", function() {
                    this.parentView.datetimedatepicker.prepareMonthDaysSlots();
                    this.$el.empty();
                    this.showAvailableHours();

                    if ($("#idDivBktDatetimeDatePicker").is(":visible")) {
                        $("#idDivBktDatetimeDatePicker").datepicker("setDate", this.parentView.selectedDate);
                    }

                    this.hideLoading(identifier);
                });

                var plainDate = Utils.dateJsToPlain(date);

                this.bindSlotsFetch(plainDate);
            },
            bindSlotsFetch: function(date) {
                var that = this;

                var dataToSend = $.extend(true, {}, bkt_init_widget);
                dataToSend.services = Utils.obtainObjectsIds(oClientValues_248295.selectedServices);
                dataToSend.agendas = Utils.obtainObjectsIds(oClientValues_248295.selectedAgendas);
                dataToSend.start = Utils.getFirstMonthDay(date);
                dataToSend.end = Utils.getLastMonthDay(date);
                dataToSend.selectedPeople = oClientValues_248295.selectedPeople;

                if (typeof oClientValues_248295.selectedExtras !== 'undefined') {
                    dataToSend.extras = Utils.obtainExtrasIds(oClientValues_248295.selectedExtras);
                }

                this.parentView.slots.fetch({
                    data: dataToSend,
                    error: (function() {
                        that.showLoadDataError();
                    })
                });
            },
            showAvailableHours: function() {
                var that = this;

                if (typeof oClientValues_248295.waitingListData !== 'undefined') {
                    delete oClientValues_248295.waitingListData;
                }

                var iSlotsCount = 0;
                var iColumnsCount = 0;

                var someResults = this.preparedSlots();

                this.parentView.datetimeslidedate.displayDateText();

                if (someResults === false) {
                    return false;
                }

                var calculateSlotsPerColumn = that.calculateSlotsPerColumn(someResults.iTotalSlots);

                for (var time in someResults.somePreparedSlots) {
                    if ((iSlotsCount) % calculateSlotsPerColumn.iSlotsPerColum === 0) {
                        var lastColumn = false;

                        iColumnsCount++;

                        if (calculateSlotsPerColumn.iTotalColumns === iColumnsCount) {
                            lastColumn = true;
                        }

                        var template = _.template($("#idTemSlotColumns").html(), {
                            column: iColumnsCount,
                            lastColumn: lastColumn
                        });
                        that.$el.append(template);
                    }

                    var agenda = someResults.somePreparedSlots[time]['agenda'];

                    var parameters = {
                        agenda: agenda,
                        time: time,
                        date: that.parentView.selectedDate
                    };

                    if (typeof someResults.somePreparedSlots[time]['price'] !== 'undefined' && oClientValues_248295.selectedPeople === 1) {
                        //                    parameters['price'] = parseFloat(String(someResults.somePreparedSlots[time]['price'])).toFixed(2).replace(".", ",");
                        parameters['price'] = someResults.somePreparedSlots[time]['price'];
                        parameters['currency'] = someResults.somePreparedSlots[time]['currency'];
                    }

                    if (typeof oClientValues_248295.widgetconfiguration.am_pm_format !== 'undefined' && oClientValues_248295.widgetconfiguration.am_pm_format === true) {
                        parameters['time_text'] = Utils.timeToAmPm(time);
                    }

                    if (typeof someResults.somePreparedSlots[time]['freeslots'] !== 'undefined') {
                        var sSlotText = someResults.somePreparedSlots[time]['freeslots'];

                        if (typeof someResults.somePreparedSlots[time]['totalslots'] !== 'undefined') {
                            sSlotText = sSlotText + ' / ' + someResults.somePreparedSlots[time]['totalslots'];
                        }

                        parameters['freeslots'] = sSlotText;
                    }

                    if ($('#idDivBktWidgetTimezoneSelectorContainer').length > 0) {
                        //                    if(typeof Intl == 'object' && typeof Intl.NumberFormat == 'function'){
                        ////                        var datetime = new Date(parameters['date'] + ' ' +parameters['time']).toLocaleString("en-US", {timeZone: $('#idDivBktWidgetTimezoneSelector').attr('data-merchant-timezone')});
                        //                        var datetime = new Date((parameters['date'] + ' ' +parameters['time']).replace(/-/g, "/"));
                        //                        
                        //                        parameters['timestamp'] = datetime.getTime();
                        //                    }
                        if (typeof someResults.somePreparedSlots[time]['timestamp'] !== 'undefined') {
                            parameters['timestamp'] = someResults.somePreparedSlots[time]['timestamp'];
                        }
                    }

                    if (typeof someResults.somePreparedSlots[time]['waitinglist'] !== 'undefined' && someResults.somePreparedSlots[time]['waitinglist'] === true) {
                        var template = _.template($("#idTemAvailableWaitingList").html(), parameters);
                        this.$('#idDivSlotColumnContainer-' + iColumnsCount).append(template);
                    } else {
                        this.$('#idDivSlotColumnContainer-' + iColumnsCount).append(that.template(parameters));
                    }

                    iSlotsCount++;
                }

                if (iSlotsCount === 0) {
                    var template = _.template($("#idTemNotAvailableSlots").html());

                    //                if(typeof oClientValues_248295.widgetconfiguration.waiting_list !== 'undefined' && parseInt(oClientValues_248295.widgetconfiguration.waiting_list) === 1){
                    //                    $('.clsBktDefaultErrorContainer').hide();
                    //                    
                    //                    if(typeof someResults.bBusyDate !== 'undefined' && someResults.bBusyDate === true){
                    //                        template = _.template($("#idTemNotAvailableSlotsWaitingList").html());
                    //                        
                    //                        var asd = that.waitingListLoad();
                    //                    }                    
                    //                }

                    that.$el.append(template);
                } else {
                    template = _.template($("#idTemNotAvailableSlotsWaitingList").html());
                    that.$el.append(template);
                }

                if ($('#idDivBktWidgetTimezoneSelectorContainer').is(':visible')) {
                    this.parentView.refreshSlotTime();
                }
            },
            calculateSlotsPerColumn: function(slots) {
                var iTotalSlots = slots;
                var iSlotsPerColum = Math.ceil(iTotalSlots / this.iMaxSlotsColumns);

                if (iSlotsPerColum < this.iMinSlotsPerColumn) {
                    iSlotsPerColum = this.iMinSlotsPerColumn;
                }

                var iTotalColumns = Math.ceil(iTotalSlots / iSlotsPerColum);

                var results = {
                    iSlotsPerColum: iSlotsPerColum,
                    iTotalColumns: iTotalColumns
                };

                return results;
            },
            showLoadDataError: function() {
                $("#idBktDefaultDatetimeErrorContainer").show();
                $('.clsDivBktWidgetDefaultLoadingContainer').remove();
            },
            showLoading: function(p_iIdentifier) {
                $('#idBktWidgetDefaultBodyContainer').prepend('<div class="clsDivBktWidgetDefaultLoadingContainer clsDivBktLoadingContainer' + p_iIdentifier + '"><div class="clsDivBktWidgetDefaultLoading"></div></div>');
            },
            hideLoading: function(p_iIdentifier) {
                $('.clsDivBktLoadingContainer' + p_iIdentifier).remove();
            },
            preparedSlots: function() {
                var that = this;

                var someMixedSlots = {};
                var someTimes = [];
                var somePreparedSlots = {};
                var someSlots = this.parentView.slots.models;

                var currency = '$';

                if (oClientValues_248295.selectedServices.length === 1) {
                    for (var j = 0; j < oClientValues_248295.someServices.length; j++) {
                        if (oClientValues_248295.someServices[j].attributes.id === oClientValues_248295.selectedServices[0].id) {
                            currency = oClientValues_248295.someServices[j].attributes['symbol'];
                            break;
                        }
                    }
                }

                var bBusyDate = false;

                for (var i = 0; i < someSlots.length; i++) {
                    if (typeof someSlots[i].attributes.errors !== 'undefined') {
                        that.showLoadDataError();
                        return false;
                    }

                    if (someSlots[i].attributes.date === that.parentView.selectedDate) {
                        _.each(someSlots[i].attributes.times, function(slot, minute) {
                            if (someMixedSlots.hasOwnProperty(slot.time) === false) {
                                someMixedSlots[slot.time] = {};
                                someMixedSlots[slot.time]['agenda'] = someSlots[i].attributes.agenda;

                                if (typeof someSlots[i].attributes.times[minute].price !== 'undefined') {
                                    someMixedSlots[slot.time]['price'] = someSlots[i].attributes.times[minute].price;
                                    someMixedSlots[slot.time]['currency'] = currency;
                                }

                                if (typeof someSlots[i].attributes.times[minute].freeSlots !== 'undefined') {
                                    someMixedSlots[slot.time]['freeslots'] = someSlots[i].attributes.times[minute].freeSlots;
                                }

                                if (typeof someSlots[i].attributes.times[minute].totalSlots !== 'undefined') {
                                    someMixedSlots[slot.time]['totalslots'] = someSlots[i].attributes.times[minute].totalSlots;
                                }

                                if (typeof someSlots[i].attributes.times[minute].waiting_list !== 'undefined') {
                                    someMixedSlots[slot.time]['waitinglist'] = someSlots[i].attributes.times[minute].waiting_list;
                                }

                                if (typeof someSlots[i].attributes.times[minute].timestamp !== 'undefined') {
                                    someMixedSlots[slot.time]['timestamp'] = someSlots[i].attributes.times[minute].timestamp;
                                }

                                someTimes.push(slot.time);
                            }
                        });

                        if (someTimes.length <= 0 && someSlots[i].attributes.state === 1) {
                            bBusyDate = true;
                        }
                    }
                }

                someTimes = someTimes.sort();

                for (var i = 0; i < someTimes.length; i++) {
                    somePreparedSlots[someTimes[i]] = someMixedSlots[someTimes[i]];
                }

                var results = {
                    somePreparedSlots: somePreparedSlots,
                    iTotalSlots: someTimes.length,
                    bBusyDate: bBusyDate
                };

                return results;
            },
            showWaitingList: function(event) {
                event.stopPropagation();
                event.preventDefault();

                var identifier = new Date().getTime();

                this.showLoading(identifier);

                var time = $(event.currentTarget).attr('data-time');
                var date = $(event.currentTarget).attr('data-date');

                oClientValues_248295.waitingListData = {
                    time: time,
                    service: oClientValues_248295.selectedServices[0].id,
                    agenda: oClientValues_248295.selectedAgendas[0].id,
                    date: date
                };

                var sFormatDate = Utils.formatDate(date, bkt_init_widget.lang);

                var sDate = sFormatDate + " - " + time + " " + this.getHourText();

                $('#idDivWaitingListDatetime').text(sDate);
                $('#idDivWaitingListService').text(oClientValues_248295.selectedServices[0].name);
                $('#idDivWaitingListAgenda').text(oClientValues_248295.selectedAgendas[0].name);

                $('.clsDivDatetimeSlot').hide();
                $('#idDivWaitingListContainer').show();

                this.hideLoading(identifier);

                return true;
            },
            showTimeList: function(event) {
                event.stopPropagation();
                event.preventDefault();

                var identifier = new Date().getTime();

                this.showLoading(identifier);

                if (typeof oClientValues_248295.waitingListData !== 'undefined') {
                    delete oClientValues_248295.waitingListData;
                }

                $('#idDivWaitingListContainer').hide();
                $('.clsDivDatetimeSlot').show();

                this.hideLoading(identifier);

                return true;
            },
            waitingListSubmit: function(event) {
                event.stopPropagation();
                event.preventDefault();

                if ($('#idDivWaitingListSubmit').hasClass('clsBktClicked')) {
                    return false;
                }

                $('#idDivWaitingListSubmit').addClass('clsBktClicked');

                var identifier = new Date().getTime();

                this.showLoading(identifier);

                //            oClientValues_248295.waitingListData = {
                //                time: $('#idSelectWaitingListTimes').val(),
                //                service: oClientValues_248295.selectedServices[0].id,
                //                agenda: oClientValues_248295.selectedAgendas[0].id,
                //                date: this.parentView.selectedDate
                //            };

                Backbone.history.navigate('waitinglist', {
                    trigger: true,
                    replace: true
                });

                this.hideLoading(identifier);

                return true;
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
            }
            //        waitingListLoad: function(){
            //            var identifier = new Date().getTime();
            //            
            //            this.showLoading(identifier);
            //            
            //            this.waitingListSlots = new Slots();
            //            
            //            this.listenTo(this.waitingListSlots, "reset", function(){
            //                $('#idSelectWaitingListTimes').empty();
            //                
            //                var someSlots = this.waitingListSlots.models;
            //                
            //                for(var i = 0 ; i < someSlots.length ; i++){
            //                    _.each(someSlots[i].attributes.times, function(slot, minute){
            //                        $('#idSelectWaitingListTimes').append('<option value="'+slot.time+'">'+slot.time+'</option>');
            //                    });
            //                }
            //                    
            //                this.hideLoading(identifier);
            //            });	   
            //            
            //            var that = this;
            //            
            //            var dataToSend = $.extend(true, {}, bkt_init_widget);
            //            dataToSend.services = Utils.obtainObjectsIds(oClientValues_248295.selectedServices);
            //            dataToSend.agendas = Utils.obtainObjectsIds(oClientValues_248295.selectedAgendas);
            //            dataToSend.start = this.parentView.selectedDate;
            //            dataToSend.end = this.parentView.selectedDate;
            //            dataToSend.selectedPeople = oClientValues_248295.selectedPeople;
            //            dataToSend.alltimes = true;
            //            
            //            this.waitingListSlots.fetch({
            //                data: dataToSend,
            //                error: (function(){
            //                    that.showLoadDataError();
            //                })
            //            }); 
            //        }       
        });

        return DateTimeList;
    });