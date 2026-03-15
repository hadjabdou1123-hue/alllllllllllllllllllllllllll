define(['jquery', 'underscore', 'backbone', 'widgets/default/views/serviceslist', 'widgets/default/views/servicespeople',
        'widgets/default/views/servicesbuttoncontinue', 'widgets/default/views/languages', 'widgets/default/models/service', 'widgets/utils'
    ],
    function($, _, Backbone, ServicesList, ServicesPeople, ServicesButtonContinue, LanguagesSelector, Event, Utils) {
        var ServicesMainContainer = Backbone.View.extend({
            el: $("#idBktDefaultServicesContainer"),
            initialize: function() {
                this.identifier = new Date().getTime();
            },
            start: function() {
                this.checkTempEvent();

                this.resetData();
                oClientValues_248295.selectedPeople = (oClientValues_248295.hasOwnProperty('customData') && oClientValues_248295.customData.hasOwnProperty('customSelectedPeople')) ? oClientValues_248295.customData.customSelectedPeople : 1;

                $('.clsBktWidgetDefaultLoading').remove();
                $('#idBktWidgetDefaultBodyContainer').show();
                $('.clsDivBktWidgetDefaultLoadingContainer').remove();

                $('#idBktServicesBackToCustomContainer').remove();

                this.showLoading();
                this.loadServices();
            },
            loadServices: function() {
                if (this.services_list) {
                    delete this.services_list;
                }
                this.services_list = new ServicesList({
                    parentView: this
                });
                this.services_list.start();

                this.listenTo(this.services_list.services, "reset", function() {
                    this.checkSkipServices();
                });
            },
            checkSkipServices: function() {
                var bAreServicesPreSelected = (typeof oClientValues_248295.selectedServices !== 'undefined') ? true : false;
                //            var bSkipServices = (typeof oClientValues_248295.widgetconfiguration.skip_services !== 'undefined') ? true : false;
                var bIsRestaurant = (typeof oClientValues_248295.widgetconfiguration.widget_restaurant !== 'undefined') ? true : false;
                var bShownCustom = (oClientValues_248295.hasOwnProperty('customData') && oClientValues_248295.customData.hasOwnProperty('customSelectedPeople') && oClientValues_248295.customData.backToCustom === true) ? true : false;

                if (bShownCustom) {
                    if (bAreServicesPreSelected && oClientValues_248295.selectedServices.length > 0 && bkt_init_widget.services.length === 1) {
                        Backbone.history.navigate('agendas', {
                            trigger: true,
                            replace: false
                        });
                    } else if (this.services_list.loaded) {
                        this.render();
                        this.show();
                    }
                } else {
                    if (bAreServicesPreSelected && oClientValues_248295.selectedServices.length > 0) {
                        if (bIsRestaurant) {
                            this.people = new ServicesPeople(this.services_list.services);

                            if ($('#idSelNumberOfPeopleDatime option').size() > 1) {
                                $('#idDivBktNumberOfPeopleContainerDatetime').show();
                            }
                        }

                        Backbone.history.navigate('agendas', {
                            trigger: true,
                            replace: false
                        });
                    } else if (this.services_list.loaded) {
                        this.render();
                        this.show();
                    }
                }

                this.hideLoading();
            },
            render: function() {
                this.languagesselector = new LanguagesSelector();

                if (!oClientValues_248295.hasOwnProperty('customData') || (oClientValues_248295.hasOwnProperty('customData') && !oClientValues_248295.customData.hasOwnProperty('customSelectedPeople'))) {
                    this.people = new ServicesPeople(this.services_list.services);
                }

                this.continue = new ServicesButtonContinue(this.services_list.services);
            },
            show: function() {
                $(".clsBktDefaultErrorContainer").hide();
                $(".clsBktDefaultWindow").hide();

                this.showBackToCustom();

                $("#idBktDefaultServicesContent").show();

                this.$el.show();

                if ($.isFunction(Utils.resizeWidgetIframe)) {
                    Utils.resizeWidgetIframe();
                }
            },
            setSelected: function(p_someServices) {
                oClientValues_248295.selectedServices = [];
                oClientValues_248295.selectedExtras = {};

                var someServicesIndex = {};

                for (var i = 0; i < oClientValues_248295.someServices.length; i++) {
                    someServicesIndex[oClientValues_248295.someServices[i].attributes.id] = oClientValues_248295.someServices[i].attributes;
                }

                for (var i = 0; i < p_someServices.length; i++) {
                    if (typeof someServicesIndex[p_someServices[i]] === 'undefined') {
                        return false;
                    }

                    oClientValues_248295.selectedServices.push({
                        id: p_someServices[i],
                        name: someServicesIndex[p_someServices[i]].name
                    });
                }

                return true;
            },
            setMultiSelect: function() {
                var that = this;
                var someServices = [];

                $.each(that.$("#idListServices input[name='services[]']:checked"), function() {
                    someServices.push(that.$(this).val());
                });

                this.setSelected(someServices);
            },
            showLoading: function() {
                $('#idBktWidgetDefaultBodyContainer').prepend('<div class="clsDivBktWidgetDefaultLoadingContainer clsDivBktLoadingContainer' + this.identifier + '"><div class="clsDivBktWidgetDefaultLoading"></div></div>');
            },
            hideLoading: function() {
                $('.clsDivBktLoadingContainer' + this.identifier).remove();
            },
            resetData: function() {
                if (typeof oClientValues_248295.widgetcustom === 'undefined') {
                    for (attribute in oClientValues_248295) {
                        if (attribute !== 'widgetconfiguration' && attribute !== 'widgetlabel' && attribute !== 'widgetcustom' &&
                            attribute !== 'someServices' && attribute !== 'someAgendaServices' && attribute !== 'someExtraServices' &&
                            attribute !== 'signedInData' && attribute !== 'bktToken') {
                            delete oClientValues_248295[attribute];
                        }
                    }

                    $('input:checkbox').removeAttr('checked');
                } else {
                    if (typeof oClientValues_248295.backToAgendas !== 'undefined') {
                        delete oClientValues_248295.backToAgendas;
                    }
                }
            },
            showBackToCustom: function() {
                if (typeof oClientValues_248295.widgetcustom !== 'undefined') {
                    var template = _.template($("#idTemBackToCustom").html());
                    $('#idDivBktDefaultServicesMainContent').prepend(template);
                }
            },
            checkTempEvent: function() {
                if (typeof oClientValues_248295.clientData !== 'undefined' && typeof oClientValues_248295.clientData.attributes !== 'undefined' && oClientValues_248295.clientData.attributes.event_created === true) {
                    var oTempEvent = new Event();
                    oTempEvent.url = Utils.get_server_url() + "freetempevent/";

                    var data = {
                        bktToken: oClientValues_248295.bktToken
                    };

                    oTempEvent.fetch({
                        data: data
                    });

                    delete oTempEvent;
                }
            }
        });

        return ServicesMainContainer;
    });