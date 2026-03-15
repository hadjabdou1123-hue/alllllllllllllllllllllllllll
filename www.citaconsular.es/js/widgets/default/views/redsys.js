define(['jquery', 'underscore', 'backbone', 'widgets/utils', 'widgets/default/models/redsys'],
    function($, _, Backbone, Utils, Redsys) {
        var RedsysContainer = Backbone.View.extend({
            el: $("#idBktDefaultRedsysContainer"),
            initialize: function() {
                this.identifier = new Date().getTime();
                this.oRedsys = new Redsys();
            },
            show: function() {

            },
            ko: function() {
                $(".clsBktDefaultErrorContainer").hide();
                $(".clsBktDefaultWindow").hide();

                $('#idDivBktDefaultRedsysErrorContainer').show();
                this.$el.show();

                $('.clsBktWidgetDefaultLoading').remove();
                $('#idBktWidgetDefaultBodyContainer').show();
                $('.clsDivBktWidgetDefaultLoadingContainer').remove();
            },
            ok: function(p_sToken) {
                $(".clsBktDefaultErrorContainer").hide();
                $(".clsBktDefaultWindow").hide();

                $('#idDivBktDefaultRedsysOkContainer').show();
                this.$el.show();

                $('.clsBktWidgetDefaultLoading').remove();
                $('#idBktWidgetDefaultBodyContainer').show();
                $('.clsDivBktWidgetDefaultLoadingContainer').remove();

                var that = this;

                this.oRedsys.executed();
                this.listenTo(this.oRedsys, "change", function(response) {
                    if (typeof this.oRedsys.attributes.clientData !== 'undefined') {
                        oClientValues_248295.clientData = this.oRedsys.attributes.clientData;
                    }
                    if (typeof this.oRedsys.attributes.priceData !== 'undefined') {
                        oClientValues_248295.priceData = this.oRedsys.attributes.priceData;
                    }
                    if (typeof this.oRedsys.attributes.selectedAgendas !== 'undefined') {
                        oClientValues_248295.selectedAgendas = this.oRedsys.attributes.selectedAgendas;
                    }
                    if (typeof this.oRedsys.attributes.selectedDate !== 'undefined') {
                        oClientValues_248295.selectedDate = this.oRedsys.attributes.selectedDate;
                    }
                    if (typeof this.oRedsys.attributes.selectedServices !== 'undefined') {
                        oClientValues_248295.selectedServices = this.oRedsys.attributes.selectedServices;
                    }
                    if (typeof this.oRedsys.attributes.selectedTime !== 'undefined') {
                        oClientValues_248295.selectedTime = this.oRedsys.attributes.selectedTime;
                    }

                    oClientValues_248295.bktToken = p_sToken;

                    Backbone.history.navigate('summary', {
                        trigger: true,
                        replace: true
                    });
                    return false;
                });

                var data = $.extend(true, {}, bkt_init_widget);
                data.bktToken = p_sToken;

                this.oRedsys.fetch({
                    data: data,
                    error: (function() {
                        that.showRedsysError();
                    })
                });
            },
            showRedsysError: function() {


            },
            showLoading: function() {
                $('#idBktDefaultRedsysContainer').prepend('<div class="clsDivBktWidgetDefaultLoadingContainer clsDivBktLoadingContainer' + this.identifier + '"><div class="clsDivBktWidgetDefaultLoading"></div></div>');
            },
            hideLoading: function() {
                $('.clsDivBktLoadingContainer' + this.identifier).remove();
            }
        });

        return RedsysContainer;
    });