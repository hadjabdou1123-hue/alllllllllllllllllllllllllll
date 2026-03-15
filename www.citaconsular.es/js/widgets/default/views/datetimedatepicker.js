define(['jquery', 'underscore', 'backbone', 'widgets/utils', 'jqueryui'],
    function($, _, Backbone, Utils) {
        var DateTimeDatePicker = Backbone.View.extend({
            el: $("#idDivBktDatetimeDatepickerContainer"),
            initialize: function(options) {
                this.parentView = options.parentView;
                this.monthAvailableDays = {};
            },
            events: {
                'click #idDivBktDatetimeDatePickerContent': 'showOrHideDatepicker',
                'click #idDivBktDatetimeDatePicker': 'stopPropagation',
                'click': 'stopPropagation'
            },
            drawDatepicker: function() {
                this.prepareMonthDaysSlots();

                var minDate = this.parentView.selectedDate;

                //            if(typeof oClientValues_248295.widgetconfiguration.waiting_list !== 'undefined' && parseInt(oClientValues_248295.widgetconfiguration.waiting_list) === 1){
                ////                minDate = Utils.dateJsToPlain(new Date());
                //
                //                $.each(this.monthAvailableDays, function(key, value){
                //                    var oCurrentDate = new Date();
                //                    var oPlainDate = Utils.plainDateToObject(key);
                //                    
                //                    if(oPlainDate >= oCurrentDate){
                //                        minDate = Utils.dateJsToPlain(oPlainDate);
                //                        return false;
                //                    }
                //                });
                //            }                      

                if ($('#idDivBktDatetimeDatePicker').hasClass('hasDatepicker')) {
                    $('#idDivBktDatetimeDatePicker').datepicker('option', 'minDate', minDate);
                    $('#idDivBktDatetimeDatePicker').datepicker('option', 'maxDate', oClientValues_248295.max);
                    $('#idDivBktDatetimeDatePicker').datepicker('refresh');
                } else {
                    var that = this;

                    var monthNames = this.getMonthNames();
                    var dayNames = this.getDayNames();
                    var dayNamesMin = this.getDayNamesMin();

                    $("#idDivBktDatetimeDatePicker").datepicker({
                        showOn: "buttom",
                        monthNames: monthNames,
                        dayNamesMin: dayNamesMin,
                        dayNames: dayNames,
                        firstDay: 1,
                        dateFormat: 'yy-mm-dd',
                        minDate: minDate,
                        maxDate: oClientValues_248295.max,
                        beforeShowDay: function(date) {
                            return that.setMonthDaysClass(date);
                        },
                        onSelect: function(date) {
                            that.parentView.selectedDate = date;
                            that.parentView.datetimelist.$el.empty();
                            that.parentView.datetimelist.showAvailableHours();
                            $('.clsBktDefaultPopupOverlay').hide();
                            that.hideDatepicker();
                        },
                        onChangeMonthYear: function(year, month, inst) {
                            var formatedDate = new Date(year, month - 1, 1);

                            that.parentView.datetimelist.datepickerChangeMonth(formatedDate);
                        }
                    });

                    $('.clsBktDefaultPopupOverlay').hide();
                    this.hideDatepicker();

                    $("html").click(function() {
                        if ($("#idDivBktDatetimeDatePicker").is(":visible")) {
                            $('.clsBktDefaultPopupOverlay').hide();
                            that.hideDatepicker();
                        }
                    });

                    $("#idDivBktDatetimeContainer").scroll(function() {
                        if ($("#idDivBktDatetimeDatePicker").is(":visible")) {
                            $('.clsBktDefaultPopupOverlay').hide();
                            that.hideDatepicker();
                        }
                    });
                }
            },
            prepareMonthDaysSlots: function() {
                var that = this;
                this.monthAvailableDays = {};

                this.parentView.slots.each(function(slot) {
                    if (typeof that.monthAvailableDays[slot.attributes.date] === 'undefined') {
                        var slots = ($.isEmptyObject(slot.attributes.times) === false) ? 1 : 0;

                        that.monthAvailableDays[slot.attributes.date] = {
                            slots: slots,
                            state: slot.attributes.state
                        };
                    }
                    //                else if(slot.attributes.times.length > that.monthAvailableDays[slot.attributes.date].slots){
                    else {
                        var slots = ($.isEmptyObject(slot.attributes.times) === false) ? 1 : 0;

                        if (slots === 1) {
                            that.monthAvailableDays[slot.attributes.date] = {
                                slots: slots,
                                state: slot.attributes.state
                            };
                        }
                    }
                });
            },
            setMonthDaysClass: function(date) {
                var plainDate = Utils.dateJsToPlain(date);

                var textBusy = [];
                textBusy['en'] = 'NOT AVAILABLE';
                textBusy['pt'] = 'ÑAO DISPONÍVEL';
                textBusy['ca'] = 'NO DISPONIBLE';
                textBusy['es'] = 'NO DISPONIBLE';
                textBusy['it'] = 'NOT AVAILABLE';
                textBusy['du'] = 'NOT AVAILABLE';
                textBusy['uk'] = 'НЕДОСТУПНИЙ';
                textBusy['de'] = 'NICHT VERFÜGBAR';
                textBusy['ko'] = '불가';
                textBusy['fr'] = 'INDISPONIBLE';
                textBusy['eu'] = 'EZ DAGO ERABILGARRI';

                var textAvailable = [];
                textAvailable['en'] = 'AVAILABLE';
                textAvailable['pt'] = 'DISPONÍVEL';
                textAvailable['ca'] = 'DISPONIBLE';
                textAvailable['es'] = 'DISPONIBLE';
                textAvailable['it'] = 'AVAILABLE';
                textAvailable['du'] = 'AVAILABLE';
                textAvailable['uk'] = 'доступний';
                textAvailable['de'] = 'VERFÜGBAR';
                textAvailable['ko'] = '가능';
                textAvailable['fr'] = 'DISPONIBLE';
                textAvailable['eu'] = 'ERABILGARRI';

                var textClosed = [];
                textClosed['en'] = 'CLOSED';
                textClosed['pt'] = 'FECHADO';
                textClosed['ca'] = 'TANCAT';
                textClosed['es'] = 'CERRADO';
                textClosed['it'] = 'CLOSED';
                textClosed['du'] = 'CLOSED';
                textClosed['uk'] = 'ЗАЧИНЕНО';
                textClosed['de'] = 'GESCHLOSSEN';
                textClosed['ko'] = '업무시간이 아님';
                textClosed['fr'] = 'FERMÉ';
                textClosed['eu'] = 'ITXITA';

                var textMaxDate = [];
                textMaxDate['en'] = 'SOON';
                textMaxDate['pt'] = 'EM BREVE';
                textMaxDate['ca'] = 'PRÒXIMAMENT';
                textMaxDate['es'] = 'PRÓXIMAMENTE';
                textMaxDate['it'] = 'PRESTO DISPONIBILE';
                textMaxDate['du'] = 'BINNENKORT';
                textMaxDate['uk'] = 'Скоро';
                textMaxDate['de'] = 'BALD KOMMEN';
                textMaxDate['ko'] = '곧 출시 예정';
                textMaxDate['fr'] = 'À VENIR';
                textMaxDate['eu'] = 'LASTER';

                var maxDate = $("#idDivBktDatetimeDatePicker").datepicker("option", "maxDate");
                var oMaxDate = Utils.plainDateToObject(maxDate);

                if (plainDate in this.monthAvailableDays) {
                    var oPlainDate = Utils.plainDateToObject(plainDate);

                    if (parseInt(this.monthAvailableDays[plainDate].state) === 1) {
                        if (oPlainDate >= oMaxDate) {
                            return [false, "clsSlotMaxDate", textMaxDate[bkt_init_widget.lang]];
                        }

                        if (parseInt(this.monthAvailableDays[plainDate].slots) > 0) {
                            return [true, "clsAvailableSlotsDate", textAvailable[bkt_init_widget.lang]];
                        } else {
                            return [true, "clsFullSlotsDate", textBusy[bkt_init_widget.lang]];
                        }
                    } else if (parseInt(this.monthAvailableDays[plainDate].state) === 4) {
                        return [true, "clsFullSlotsDate", textBusy[bkt_init_widget.lang]];
                    }
                }

                return [false, "", textClosed[bkt_init_widget.lang]];
            },
            showOrHideDatepicker: function(event) {
                var that = this;

                if ($("#idDivBktDatetimeDatePicker").is(":visible")) {
                    $('.clsBktDefaultPopupOverlay').hide();
                    this.hideDatepicker();
                } else {
                    $('#idBktWidgetDefaultBodyContainer').append('<div class="clsBktDefaultPopupOverlay" style="display: block;"></div>');
                    this.displayDatepicker();
                    $("#idDivBktDatetimeDatePicker").datepicker("setDate", this.parentView.selectedDate);

                    $(".clsBktDefaultPopupOverlay").click(function() {
                        if ($("#idDivBktDatetimeDatePicker").is(":visible")) {
                            $('.clsBktDefaultPopupOverlay').hide();
                            that.hideDatepicker();
                        }
                    });
                }

                this.stopPropagation(event);
            },
            stopPropagation: function(event) {
                event.stopPropagation();
            },
            displayDatepicker: function() {
                $('#idDivBktDatetimeDatePicker').datepicker('refresh');
                $("#idDivBktDatetimeDatePicker").datepicker().show();

                this.$("#idDivBktDatetimeDatePickerIcon").removeClass('clsBktDatePickerNotVisible');
                this.$("#idDivBktDatetimeDatePickerIcon").addClass('clsBktDatePickerVisible');
            },
            hideDatepicker: function() {
                if ($("#idDivBktDatetimeDatePicker").is(":visible")) {
                    $("#idDivBktDatetimeDatePicker").datepicker().hide();

                    this.$("#idDivBktDatetimeDatePickerIcon").removeClass('clsBktDatePickerVisible');
                    this.$("#idDivBktDatetimeDatePickerIcon").addClass('clsBktDatePickerNotVisible');
                }
            },
            getMonthNames: function() {
                var translateMonthNames = [];
                translateMonthNames['en'] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                translateMonthNames['es'] = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
                translateMonthNames['pt'] = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
                translateMonthNames['ca'] = ['Gener', 'Febrer', 'Març', 'Abril', 'Maig', 'Juny', 'Juliol', 'Agost', 'Setembre', 'Octubre', 'Novembre', 'Desembre'];
                translateMonthNames['uk'] = ['січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень', 'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'];
                translateMonthNames['de'] = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
                translateMonthNames['ko'] = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
                translateMonthNames['fr'] = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
                translateMonthNames['eu'] = ['Urtarrila', 'Otsaila', 'Martxoa', 'Apirila', 'Maiatza', 'Ekaina', 'Uztaila', 'Abuztua', 'Iraila', 'Urria', 'Azaroa', 'Abendua'];

                var monthNames = [];
                if (typeof translateMonthNames[bkt_init_widget.lang] === 'undefined') {
                    monthNames = translateMonthNames['en'];
                } else {
                    monthNames = translateMonthNames[bkt_init_widget.lang];
                }
                return monthNames;
            },
            getDayNames: function() {
                var translateDayNames = [];
                translateDayNames['en'] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                translateDayNames['es'] = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
                translateDayNames['pt'] = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
                translateDayNames['ca'] = ['Diumenge', 'Dilluns', 'Dimarts', 'Dimecres', 'Dijous', 'Divendres', 'Dissabte'];
                translateDayNames['uk'] = ['Неділя', 'Понеділок', 'Вівторок', 'Середа', 'Четвер', 'ятниця', 'Субота'];
                translateDayNames['de'] = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
                translateDayNames['ko'] = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
                translateDayNames['fr'] = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Verndredi', 'Samedi'];
                translateDayNames['eu'] = ['Igandea', 'Astelehena', 'Asteartea', 'Asteazkena', 'Osteguna', 'Ostirala', 'Larunbata'];

                var dayNames = [];
                if (typeof translateDayNames[bkt_init_widget.lang] === 'undefined') {
                    dayNames = translateDayNames['en'];
                } else {
                    dayNames = translateDayNames[bkt_init_widget.lang]
                }

                return dayNames;
            },
            getDayNamesMin: function() {
                var translateDayNamesMin = [];
                translateDayNamesMin['en'] = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
                translateDayNamesMin['es'] = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];
                translateDayNamesMin['pt'] = ['Do', 'Se', 'Te', 'Qu', 'Qu', 'Se', 'Sa'];
                translateDayNamesMin['ca'] = ['dG', 'dL', 'dM', 'dC', 'dJ', 'dV', 'dS'];
                translateDayNamesMin['uk'] = ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
                translateDayNamesMin['de'] = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
                translateDayNamesMin['ko'] = ['일', '월', '화', '수', '목', '금', '토'];
                translateDayNamesMin['fr'] = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
                translateDayNamesMin['eu'] = ['Ig.', 'Al.', 'As.', 'Az.', 'Og.', 'Or.', 'Lr.'];

                var dayNamesMin;
                if (typeof translateDayNamesMin[bkt_init_widget.lang] === 'undefined') {
                    dayNamesMin = dayNamesMin['en'];
                } else {
                    dayNamesMin = translateDayNamesMin[bkt_init_widget.lang]
                }

                return dayNamesMin;
            }
        });

        return DateTimeDatePicker;
    });