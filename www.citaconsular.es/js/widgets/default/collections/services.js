define(['jquery', 'underscore', 'backbone', 'widgets/utils', 'widgets/default/models/service'],
    function($, _, Backbone, Utils, Service) {
        var Services = Backbone.Collection.extend({
            url: Utils.get_server_url(),
            model: Service,
            initialize: function() {
                this.url += "getservices/";
            },
            // Overwrite the sync method to pass over the Same Origin Policy
            sync: function(method, model, options) {
                //options.timeout = 10000;
                options.dataType = "jsonp";
                return Backbone.sync(method, model, options);
            },
            parse: function(response) {
                if (typeof response.Exception !== 'undefined') {
                    return response.Exception;
                } else {
                    oClientValues_248295.someAgendaServices = response.Agendas;
                    oClientValues_248295.someExtraServices = response.ExtraServices;

                    if (typeof response.AllowAppointment !== 'undefined') {
                        oClientValues_248295.someAllowAppointment = response.AllowAppointment;
                    }

                    return response.Services;
                }
            },
            arePaymentServices: function() {
                var asd = 1;

                for (var i = 0; i < oClientValues_248295.selectedServices.length; i++) {
                    for (var j = 0; j < oClientValues_248295.someServices.length; j++) {
                        if (this.isServiceSelected(i, j) && this.isPaymentService(j)) {
                            return true;
                        }
                    }

                    if (typeof oClientValues_248295.selectedExtras[oClientValues_248295.selectedServices[i].id] !== 'undefined') {
                        var bIsPaymentExtraService = false;

                        $.each(oClientValues_248295.selectedExtras[oClientValues_248295.selectedServices[i].id], function(index, value) {
                            var sIsPrepay = oClientValues_248295.someExtraServices[oClientValues_248295.selectedServices[i].id][index]['prepay'];

                            if (sIsPrepay === "1") {
                                bIsPaymentExtraService = true;

                                return;
                            }
                        });

                        if (bIsPaymentExtraService === true) {
                            return true;
                        }
                    }
                }

                return false;
            },
            isServiceSelected: function(i, j) {
                if (oClientValues_248295.selectedServices[i].id === oClientValues_248295.someServices[j].attributes['id']) {
                    return true;
                }

                return false;
            },
            isPaymentService: function(j) {
                if (oClientValues_248295.someServices[j].attributes['prepay'] == 1) {
                    return true;
                } //please don't change the equal

                return false;
            },
            calculatePrices: function() {
                var oPrices = {};

                oPrices.total = 0.0;
                oPrices.online = 0.0;
                oPrices.offline = 0.0;
                oPrices.currency = "$";

                for (var i = 0; i < oClientValues_248295.selectedServices.length; i++) {
                    for (var j = 0; j < oClientValues_248295.someServices.length; j++) {
                        if (this.isServiceSelected(i, j) && this.isPaymentService(j)) {
                            oPrices.online += (parseFloat(oClientValues_248295.someServices[j].attributes['price'])) * oClientValues_248295.selectedPeople;
                            oPrices.offline += Math.abs((parseFloat(oClientValues_248295.someServices[j].attributes['price_no_prepay']) - parseFloat(oClientValues_248295.someServices[j].attributes['price'])) * oClientValues_248295.selectedPeople);
                            oPrices.currency = oClientValues_248295.someServices[j].attributes['symbol'];
                        }
                    }
                }

                oPrices.total = oPrices.online + oPrices.offline;

                return oPrices;
            }
        });

        return Services;
    });