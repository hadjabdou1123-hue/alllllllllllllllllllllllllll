define(['jquery', 'underscore', 'backbone', 'widgets/utils'],
    function($, _, Backbone, Utils) {
        var DateTimeSlideDate = Backbone.View.extend({
            el: $("#idDivBktDatetimeSelectedDateContainer"),
            initialize: function(options) {
                this.parentView = options.parentView;
            },
            events: {
                'click #idDivBktDatetimeSelectedDateLeft': 'slideDateLeft',
                'click #idDivBktDatetimeSelectedDateRight': 'slideDateRight'
            },
            slideDateLeft: function() {
                var prevDate = Utils.plainDateToObject(this.parentView.selectedDate);
                prevDate.setDate(prevDate.getDate() - 1);

                var plainDate = Utils.dateJsToPlain(prevDate);

                this.checkDateAndDiplaySlots(plainDate);

                $('.clsBktDefaultPopupOverlay').hide();
                this.parentView.datetimedatepicker.hideDatepicker();
            },
            slideDateRight: function() {
                var nextDate = Utils.plainDateToObject(this.parentView.selectedDate);
                nextDate.setDate(nextDate.getDate() + 1);

                var plainDate = Utils.dateJsToPlain(nextDate);

                this.checkDateAndDiplaySlots(plainDate);

                $('.clsBktDefaultPopupOverlay').hide();
                this.parentView.datetimedatepicker.hideDatepicker();
            },
            displayDateText: function() {
                this.$('#idDivBktDatetimeSelectedDate').html(Utils.formatDate(this.parentView.selectedDate, bkt_init_widget.lang));
            },
            checkDateAndDiplaySlots: function(date) {
                var newDate = Utils.plainDateToObject(date);
                var firstAvailableDate = Utils.plainDateToObject(this.parentView.firstAvailableDate);
                var lastAvailableDate = Utils.plainDateToObject(oClientValues_248295.max);

                if (newDate < firstAvailableDate) {
                    return false;
                } else if (newDate > lastAvailableDate) {
                    return false;
                }
                //            else if(typeof oClientValues_248295.widgetconfiguration.waiting_list !== 'undefined' && parseInt(oClientValues_248295.widgetconfiguration.waiting_list) === 1){
                //                var asd = $('#idDivBktDatetimeDatePicker').datepicker('option', 'minDate');
                //                
                //                if(newDate < Utils.plainDateToObject($('#idDivBktDatetimeDatePicker').datepicker('option', 'minDate'))){
                //                    return false;
                //                }
                //            }

                this.parentView.selectedDate = date;

                if (this.parentView.selectedDate in this.parentView.datetimedatepicker.monthAvailableDays) {
                    this.parentView.datetimelist.$el.empty();
                    this.parentView.datetimelist.showAvailableHours();

                    if ($("#idDivBktDatetimeDatePicker").is(":visible")) {
                        $("#idDivBktDatetimeDatePicker").datepicker("setDate", this.parentView.selectedDate);
                    }
                } else {
                    this.parentView.datetimelist.slideDateChangeMonth(newDate);
                }

            }
        });

        return DateTimeSlideDate;
    });