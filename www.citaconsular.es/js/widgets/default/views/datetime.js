define(['jquery', 'underscore', 'backbone', 'widgets/utils',
        'widgets/default/views/datetimelist', 'widgets/default/views/datetimedatepicker', 'widgets/default/views/datetimeslidedate',
        'widgets/default/collections/slots', 'widgets/default/views/breadcrumb', 'widgets/default/views/languages'
    ],
    function($, _, Backbone, Utils, DateTimeList, DateTimeDatePicker, DateTimeSlideDate, Slots, BreadCrumb, LanguagesSelector) {
        var DateMainContainer = Backbone.View.extend({
            el: $("#idBktDefaultDatetimeContainer"),
            initialize: function() {
                this.selectedDate = Utils.dateJsToPlain(new Date());
                this.firstAvailableDate = Utils.dateJsToPlain(new Date());
                this.slots = new Slots();
                this.datetimeslidedate = new DateTimeSlideDate({
                    parentView: this
                });
                this.datetimedatepicker = new DateTimeDatePicker({
                    parentView: this
                });
                this.languagesselector = new LanguagesSelector();

                if ($('#idDivBktWidgetTimezoneSelectorContainer').length) {
                    //                this.lastSelectedTimezone = $('#idDivBktWidgetTimezoneSelector').attr('data-timezone');
                    this.selectedTimezone = false;
                }

                this.render();
            },
            events: {
                'change #idSelNumberOfPeopleDatime': 'refreshSlots',
                'change #idDivBktWidgetTimezoneSelector': 'timezoneChange'
            },
            render: function(p_sError) {
                this.cleanViews();
                this.selectedDate = Utils.dateJsToPlain(new Date());
                this.datetimelist = new DateTimeList({
                    parentView: this
                });
                this.show(p_sError);
            },
            refreshSlots: function() {
                var iSelectedPeople = parseInt($('#idSelNumberOfPeopleDatime').val());
                oClientValues_248295.selectedPeople = iSelectedPeople;
                this.datetimelist = new DateTimeList({
                    parentView: this
                });
            },
            cleanViews: function() {
                if (this.datetimelist) delete this.datetimelist;
            },
            show: function(p_sError) {
                this.showBackToAgendas();

                var breadCrumb = new BreadCrumb();
                breadCrumb.show('#idBktDefaultDatetimeContainer .clsDivSubHeaderBreadcrumbsText');

                $(".clsBktDefaultErrorContainer").hide();
                $(".clsBktDefaultWindow").hide();

                if (typeof p_sError !== 'undefined') {
                    this.fillErrorData(p_sError);
                }

                if ($('#idSelNumberOfPeopleDatime').length > 0) {
                    $('#idSelNumberOfPeopleDatime').val($('#idSelNumberOfPeopleDatime option:first').val());
                }

                if (bkt_init_widget.publickey === '23d9b76923b741cb4165cb7fadba48129') {
                    $("#idBktWidgetBody #idBktWidgetDefaultBodyContainer #idDivBktDatetimeDatepickerContainer").hide();

                    if (oClientValues_248295.selectedServices[0].id === 'bkt291456' ||
                        oClientValues_248295.selectedServices[0].id === 'bkt277420' ||
                        oClientValues_248295.selectedServices[0].id === 'bkt348084' ||
                        oClientValues_248295.selectedServices[0].id === 'bkt414700' ||
                        oClientValues_248295.selectedServices[0].id === 'bkt351571') {
                        $("#idBktWidgetBody #idBktWidgetDefaultBodyContainer #idDivBktDatetimeDatepickerContainer").show();
                    }
                }

                this.$el.show();
            },
            fillErrorData: function(p_sError) {
                var sError = 'There was an error creating the event';

                if (typeof oClientValues_248295.createEventError !== 'undefined') {
                    for (var i = 0; i < oClientValues_248295.createEventError.length; i++) {
                        if (oClientValues_248295.createEventError[i].hasOwnProperty('name') && oClientValues_248295.createEventError[i].name === p_sError) {
                            sError = oClientValues_248295.createEventError[i].message;
                        }
                    }
                }

                delete oClientValues_248295.createEventError;

                $("#idBktDefaultDatetimeDataErrorContainer").html(sError);
                $("#idBktDefaultDatetimeDataErrorContainer").show();
            },
            showBackToAgendas: function() {
                var bShownCustom = (oClientValues_248295.hasOwnProperty('customData') && oClientValues_248295.customData.hasOwnProperty('customSelectedPeople') && oClientValues_248295.customData.backToCustom === true) ? true : false;

                if ((typeof oClientValues_248295.backToServices !== 'undefined' && oClientValues_248295.backToServices === true) ||
                    (typeof oClientValues_248295.backToAgendas !== 'undefined' && oClientValues_248295.backToAgendas === true) ||
                    (bShownCustom)) {
                    this.$('.clsDivSubHeaderBackButton').remove();

                    var template = _.template($("#idTemBackToAgendas").html());
                    this.$('.clsDivSubHeaderBreadcrumbs').prepend(template);
                }
            },
            timezoneChange: function() {
                this.selectedTimezone = true;

                this.refreshSlotTime();
            },
            refreshSlotTime: function() {
                var selectedTimezone = $('#idDivBktWidgetTimezoneSelector').val();

                //            if(selectedTimezone === this.lastSelectedTimezone){
                //                return true;
                //            }

                //            this.lastSelectedTimezone = selectedTimezone;

                var that = this;

                $('.clsDivDatetimeSlot').show();

                $('span.clsDivDatetimeSlotTime').each(function() {
                    var datetime = parseInt($(this).closest('div.clsDivDatetimeSlot').attr('data-datetime'));

                    var selectedDateString = that.selectedDate;
                    var selectedDateStringSplit = selectedDateString.split('-');

                    var dateString = new Date(datetime).toLocaleString("en-EN", {
                        timeZone: selectedTimezone
                    });
                    var date = new Date(dateString);
                    var n = date.getDate();

                    if (n !== parseInt(selectedDateStringSplit[2])) {
                        $(this).closest('.clsDivDatetimeSlot').hide();
                    }

                    var text = new Date(datetime).toLocaleString("no-nb", {
                        timeZone: selectedTimezone,
                        hour: '2-digit',
                        minute: '2-digit'
                    });
                    //                var text = new Date(new Date(datetime)).toLocaleString("en-US", {timeZone: selectedTimezone});

                    $(this).html(text);
                });

                if (this.selectedTimezone === true) {
                    $('#idBktWidgetBody #idBktWidgetDefaultBodyContainer .clsDivSlotColumnContainer, #idBktWidgetBody #idBktWidgetDefaultBodyContainer .clsDivSlotColumnContainerLast').attr("style", "display: block !important");
                }
            }
        });

        return DateMainContainer;
    });