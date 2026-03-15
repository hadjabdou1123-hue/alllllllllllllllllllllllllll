define(['jquery', 'underscore', 'backbone', 'widgets/default/collections/agendas', 'widgets/utils', 'widgets/default/models/widgetconfiguration'],
    function($, _, Backbone, Agendas, Utils, WidgetConfiguration) {
        var AgendasList = Backbone.View.extend({
            el: $("#idListAgendas"),
            template: _.template($("#idTemSelectAgendas").html()),
            loaded: true,
            initialize: function(options) {
                this.parentView = options.parentView;
                this.identifier = new Date().getTime();
                this.oWidgetConfiguration = new WidgetConfiguration();
            },
            start: function() {
                this.showLoading();
                this.loadAgendas();
            },
            loadAgendas: function() {
                this.$el.empty();

                this.agendas = new Agendas();
                that = this;

                this.listenTo(this.agendas, "reset", function() {
                    oClientValues_248295.someAgendas = that.agendas.models;

                    this.doRender();
                });

                var dataToSend = $.extend({}, bkt_init_widget);
                dataToSend.services = Utils.obtainObjectsIds(oClientValues_248295.selectedServices);
                dataToSend.selectedPeople = oClientValues_248295.selectedPeople;

                this.agendas.fetch({
                    data: dataToSend,
                    error: (function() {
                        that.showLoadDataError();
                    })
                });
            },
            doRender: function() {
                if (this.checkEmptyAgendas() === true) {
                    this.showLoadDataError();
                } else if (this.checkSetSelected() === true) {
                    oClientValues_248295.backToAgendas = false;
                } else {
                    oClientValues_248295.backToAgendas = true;
                    this.render();
                }
            },
            render: function() {
                var sAgendasIds = "";

                for (var i = 0; i < oClientValues_248295.someAgendas.length; i++) {
                    if (parseInt(oClientValues_248295.widgetconfiguration.any_agenda) !== this.oWidgetConfiguration.iAnyAgendaShowAuto) {
                        var sAgendaPhoto = oClientValues_248295.someAgendas[i].attributes.photo;

                        if (sAgendaPhoto.indexOf("/global/add_photo.png") >= 0) {
                            oClientValues_248295.someAgendas[i].attributes.photo = sAgendaPhoto.replace("/global/add_photo.png", "/widgets/default/agendas/agenda_no_foto.svg");
                        }

                        var parameters = {
                            attributes: oClientValues_248295.someAgendas[i].attributes
                        }

                        this.$el.append(this.template(parameters));
                    }

                    sAgendasIds += oClientValues_248295.someAgendas[i].attributes.id + "-";
                }

                sAgendasIds = sAgendasIds.substr(0, (sAgendasIds.length - 1));

                if (typeof oClientValues_248295.widgetconfiguration.any_agenda !== 'undefined' &&
                    parseInt(oClientValues_248295.widgetconfiguration.any_agenda) !== this.oWidgetConfiguration.iAnyAgendaShowAgendas &&
                    parseInt(oClientValues_248295.widgetconfiguration.any_agenda) !== this.oWidgetConfiguration.iAnyAgendaShowAnyway) {

                    var parameters = {
                        attributes: {
                            id: sAgendasIds,
                            name: this.getAgendaAutoText(),
                            photo: bkt_init_widget.srvsrc + "/images/widgets/default/agendas/agenda_no_foto.svg",
                            cls: 'clsDivBktAgendaFirstAvailable'
                        }
                    }
                    this.$el.prepend(this.template(parameters));
                }

                this.hideLoading();
            },
            showNoAgendas: function() {
                $('#idDivBktDefaultErrorAgendasLoadingData').hide();
                $('#idDivBktDefaultErrorAgendasNoAvailable').show();
            },
            showLoadDataError: function() {
                oClientValues_248295.someAgendas = [];
                this.loaded = false;

                $(".clsBktDefaultWindow").hide();
                $("#idBktDefaultAgendasErrorContainer").show();

                $(".clsDivBktWidgetDefaultLoadingContainer").remove();
                this.parentView.$el.show();
            },
            showLoading: function() {
                $('#idBktWidgetDefaultBodyContainer').prepend('<div class="clsDivBktWidgetDefaultLoadingContainer clsDivBktLoadingContainer' + this.identifier + '"><div class="clsDivBktWidgetDefaultLoading"></div></div>');
            },
            hideLoading: function() {
                $('.clsDivBktLoadingContainer' + this.identifier).remove();
            },
            getAgendaAutoText: function() {
                var textAgendaAuto = [];
                textAgendaAuto['en'] = 'First appointment available';
                textAgendaAuto['pt'] = 'Primeira consulta disponível';
                textAgendaAuto['ca'] = 'Primera cita disponible';
                textAgendaAuto['es'] = 'Primera cita disponible';
                textAgendaAuto['it'] = 'First appointment available';
                textAgendaAuto['du'] = 'First appointment available';
                textAgendaAuto['uk'] = 'перший доступний';
                textAgendaAuto['de'] = 'Zuerst verfügbar';
                textAgendaAuto['ko'] = '가장 먼저 가능한 스케줄';
                textAgendaAuto['fr'] = 'Premier disponible';
                textAgendaAuto['eu'] = 'Erabilgarri dagoen lehenengoa';

                return textAgendaAuto[bkt_init_widget.lang];
            },
            checkSetSelected: function() {
                var bShowAgendasAnyway = (parseInt(oClientValues_248295.widgetconfiguration.any_agenda) === this.oWidgetConfiguration.iAnyAgendaShowAnyway);
                var bAnyAgendaAuto = (parseInt(oClientValues_248295.widgetconfiguration.any_agenda) === this.oWidgetConfiguration.iAnyAgendaShowAuto);
                var bAnyAgendaShowAndAuto = (parseInt(oClientValues_248295.widgetconfiguration.any_agenda) === this.oWidgetConfiguration.iAnyAgendaShowAgendasAndAuto);
                var someAgendas = [];

                if (bShowAgendasAnyway) {
                    return false;
                } else if (bAnyAgendaShowAndAuto) {
                    return false;
                } else if (this.checkOneAgenda() === true) {
                    someAgendas = [this.agendas.models[0].attributes.id];
                } else if (bAnyAgendaAuto) {
                    for (var i = 0; i < oClientValues_248295.someAgendas.length; i++) {
                        someAgendas[i] = oClientValues_248295.someAgendas[i].attributes.id;
                    }
                } else if (typeof bkt_init_widget.agendas !== 'undefined' && bkt_init_widget.agendas.length > 0) {
                    someAgendas = bkt_init_widget.agendas;
                }

                var bDefinedServices = (typeof bkt_init_widget.services !== 'undefined');
                var iDefinedServicesLength = (bDefinedServices) ? bkt_init_widget.services.length : 0;

                var bDefinedAgendas = (typeof bkt_init_widget.agendas !== 'undefined');
                var iDefinedAgendasLength = (bDefinedAgendas) ? bkt_init_widget.agendas.length : 0;

                if ((bDefinedServices === false && iDefinedAgendasLength > 1) ||
                    (bDefinedServices === true && iDefinedServicesLength <= 0 && iDefinedAgendasLength > 1)) {
                    if (parseInt(oClientValues_248295.widgetconfiguration.any_agenda) !== this.oWidgetConfiguration.iAnyAgendaShowAuto) {
                        return false;
                    }
                }

                if (someAgendas.length > 0) {
                    return this.parentView.setSelected(someAgendas);
                }

                return false;
            },
            checkEmptyAgendas: function() {
                if (this.agendas.models.length <= 0) {
                    this.showNoAgendas();
                    return true;
                }

                if (typeof this.agendas.models[0].attributes.errors !== 'undefined') {
                    return true;
                }

                return false;
            },
            checkOneAgenda: function() {
                if (this.agendas.models.length === 1) {
                    return true;
                }
            }
        });

        return AgendasList;
    });