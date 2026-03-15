define(['jquery', 'underscore', 'backbone'],
    function($, _, Backbone) {
        var ExtraServicesMainContainer = Backbone.View.extend({
            el: $("#idBktDefaultExtraServicesContainer"),
            template: _.template($("#idTemSelectExtraServices").html()),
            initialize: function() {
                this.identifier = new Date().getTime();
            },
            events: {
                'click #idBktExtraServicesBackButtonContainer': 'backToServices',
                'click #idBktExtraServicesContinueButton': 'nextStep'
            },
            start: function() {
                this.clear();

                this.render();
            },
            clear: function() {
                this.$('#idBktExtraServiceSelectedServiceInfo').empty();

                this.$('#idBktExtraServiceSelectedExtraInfo').empty();
                this.$('#idBktExtraServiceSelectedExtrasContainer').hide();

                this.$('#idBktExtraServiceSelectedTotal').empty();
                this.$('#idBktExtraServicesTotalContainer').hide();

                this.$('#idListExtraServices').empty();
            },
            render: function() {
                this.showLoading();

                this.renderExtraServicesList();
                this.renderSummary();

                this.show();

                this.hideLoading();
            },
            renderExtraServicesList: function() {
                var that = this;

                for (var j = 0; j < oClientValues_248295.selectedServices.length; j++) {
                    var service = oClientValues_248295.selectedServices[j].id;

                    $.each(oClientValues_248295.someExtraServices[service], function(index, value) {
                        var parameters = {
                            attributes: value
                        };

                        parameters.attributes['service'] = service;

                        var template = _.template($("#idTemSelectExtraServices").html(), parameters);
                        that.$('#idListExtraServices').append(template);
                    });
                }

                $('#idListExtraServices .clsBktExtraServiceCheckboxContainer input[type="checkbox"]').unbind('click').click(function(event) {
                    that.extraMultiselectSelected(event);
                });

                $('#idListExtraServices .clsBktExtraServiceInfoContainer, #idListExtraServices .clsBktExtraServiceDescription').unbind('click').click(function(event) {
                    if ($(this).closest('.clsBktExtraServiceContainer').find('.clsBktExtraServiceCheckboxContainer input[type="checkbox"]').length) {
                        $(this).closest('.clsBktExtraServiceContainer').find('.clsBktExtraServiceCheckboxContainer input[type="checkbox"]').prop('checked', !($(this).closest('.clsBktExtraServiceContainer').find('.clsBktExtraServiceCheckboxContainer input[type="checkbox"]').is(':checked')));

                        that.extraMultiselectSelected(event);

                        return;
                    }

                    that.extraSelected(event);
                });
            },
            renderSummary: function() {
                this.renderServiceInfo();
                this.refreshExtraServiceInfo();
                this.refreshTotalInfo();
            },
            renderServiceInfo: function() {
                this.$('#idBktExtraServiceSelectedServiceInfo').empty();

                for (var i = 0; i < oClientValues_248295.selectedServices.length; i++) {
                    var service = oClientValues_248295.selectedServices[i].id;

                    for (var j = 0; j < oClientValues_248295.someServices.length; j++) {
                        if (oClientValues_248295.someServices[j].attributes.id !== service) {
                            continue;
                        }

                        var parameters = {
                            attributes: {
                                name: oClientValues_248295.someServices[j].attributes.name,
                                price: oClientValues_248295.someServices[j].attributes.price_no_prepay
                            }
                        };

                        var template = _.template($("#idTemSelectSelectedService").html(), parameters);
                        this.$('#idBktExtraServiceSelectedServiceInfo').append(template);
                    }
                }
            },
            refreshExtraServiceInfo: function() {
                this.$('#idBktExtraServiceSelectedExtraInfo').empty();
                this.$('#idBktExtraServiceSelectedExtrasContainer').hide();

                var that = this;
                var count = 0;

                $.each(oClientValues_248295.selectedExtras, function(serviceIndex, extras) {
                    $.each(extras, function(extraIndex, value) {
                        var parameters = {
                            attributes: {
                                name: value.name,
                                price: (typeof value.price !== 'undefined') ? value.price : null,
                                separator: (count > 0) ? true : false
                            }
                        };

                        var template = _.template($("#idTemSelectSelectedService").html(), parameters);
                        that.$('#idBktExtraServiceSelectedExtraInfo').append(template);

                        count++;
                    });
                });

                if ($('#idBktExtraServiceSelectedExtraInfo').is(':empty') === false) {
                    this.$('#idBktExtraServiceSelectedExtrasContainer').show();
                }
            },
            refreshTotalInfo: function() {
                this.$('#idBktExtraServiceSelectedTotal').empty();
                this.$('#idBktExtraServicesTotalContainer').hide();

                var total = 0.0;

                for (var i = 0; i < oClientValues_248295.selectedServices.length; i++) {
                    var service = oClientValues_248295.selectedServices[i].id;

                    for (var j = 0; j < oClientValues_248295.someServices.length; j++) {
                        if (oClientValues_248295.someServices[j].attributes.id !== service) {
                            continue;
                        }
                        if (typeof oClientValues_248295.someServices[j].attributes.base_price_no_prepay === 'undefined') {
                            continue;
                        }

                        var price = parseFloat(oClientValues_248295.someServices[j].attributes.base_price_no_prepay.replace(',', '.'));

                        if (price > 0) {
                            total = ((total * 100) + (price * 100)) / 100;
                        }
                    }

                    if (typeof oClientValues_248295.selectedExtras[service] !== 'undefined') {
                        $.each(oClientValues_248295.selectedExtras[service], function(extraIndex, value) {
                            if (typeof oClientValues_248295.someExtraServices[service][extraIndex].base_price === 'undefined') {
                                return;
                            }

                            var price = parseFloat(oClientValues_248295.someExtraServices[service][extraIndex].base_price.replace(',', '.'));

                            if (price > 0) {
                                total = ((total * 100) + (price * 100)) / 100;
                            }
                        });
                    }
                }

                if (total > 0) {
                    var summaryTotal = total.toFixed(2).toString().replace('.', ',');

                    this.$('#idBktExtraServiceSelectedTotal').html(summaryTotal + oClientValues_248295.someServices[0].attributes.symbol);
                    this.$('#idBktExtraServicesTotalContainer').show();
                }
            },
            show: function() {
                $('#idBktWidgetBody #idBktDefaultServicesContainer').hide();
                $('#idBktWidgetBody #idBktDefaultExtraServicesContainer').show();
            },
            backToServices: function() {
                $('#idBktWidgetBody #idBktDefaultExtraServicesContainer').hide();
                $('#idBktWidgetBody #idBktDefaultServicesContainer').show();
            },
            showLoading: function() {
                $('#idBktWidgetDefaultBodyContainer').prepend('<div class="clsDivBktWidgetDefaultLoadingContainer clsDivBktLoadingContainer' + this.identifier + '"><div class="clsDivBktWidgetDefaultLoading"></div></div>');
            },
            hideLoading: function() {
                $('.clsDivBktLoadingContainer' + this.identifier).remove();
            },
            refreshExtraList: function() {
                $('#idListExtraServices .clsBktExtraServiceContainer').show();

                if ($('#idListExtraServices .clsBktExtraServiceContainer .clsBktExtraServiceCheckboxContainer input[type="checkbox"]:checked').length > 0) {
                    $('#idListExtraServices .clsBktExtraServiceContainer').hide();

                    $('#idListExtraServices .clsBktExtraServiceContainer').each(function(i, e) {
                        if ($(this).find('.clsBktExtraServiceCheckboxContainer').length) {
                            $(this).show();
                        }
                    });
                }
            },
            extraMultiselectSelected: function(event) {
                this.showLoading();

                var service = $(event.target).closest('.clsBktExtraServiceContainer').attr('data-service');
                var extra = $(event.target).closest('.clsBktExtraServiceContainer').attr('data-extra');

                this.manageSelectedExtra(service, extra);

                this.refreshExtraServiceInfo();
                this.refreshTotalInfo();
                this.refreshExtraList();

                this.hideLoading();
            },
            extraSelected: function(event) {
                event.stopPropagation();

                var service = $(event.target).closest('.clsBktExtraServiceContainer').attr('data-service');
                var extra = $(event.target).closest('.clsBktExtraServiceContainer').attr('data-extra');

                oClientValues_248295.selectedExtras = {};

                this.manageSelectedExtra(service, extra);

                this.nextStep();
            },
            manageSelectedExtra: function(service, extra) {
                if (typeof oClientValues_248295.selectedExtras[service] === 'undefined') {
                    oClientValues_248295.selectedExtras[service] = {};
                }

                if (typeof oClientValues_248295.selectedExtras[service][extra] === 'undefined') {
                    oClientValues_248295.selectedExtras[service][extra] = {
                        id: extra,
                        name: oClientValues_248295.someExtraServices[service][extra].name
                    };

                    if (typeof oClientValues_248295.someExtraServices[service][extra].price !== 'undefined') {
                        oClientValues_248295.selectedExtras[service][extra]['price'] = oClientValues_248295.someExtraServices[service][extra].price;
                    }
                } else {
                    delete oClientValues_248295.selectedExtras[service][extra];
                }
            },
            nextStep: function() {
                Backbone.history.navigate('agendas', {
                    trigger: true,
                    replace: true
                });
            }
        });

        return ExtraServicesMainContainer;
    });