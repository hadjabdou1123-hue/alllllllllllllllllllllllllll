define(['jquery', 'underscore', 'backbone', 'widgets/default/views/agendaslist', 'widgets/default/views/breadcrumb', 'widgets/default/views/languages'],
    function($, _, Backbone, AgendasList, BreadCrumb, LanguagesSelector) {
        var AgendasMainContainer = Backbone.View.extend({
            el: $("#idBktDefaultAgendasContainer"),
            initialize: function() {
                this.identifier = new Date().getTime();
            },
            start: function() {
                oClientValues_248295.selectedAgendas = [];
                $('.clsDivBktWidgetDefaultLoadingContainer').remove();

                this.showLoading();
                this.loadAgendas();
            },
            loadAgendas: function() {
                if (this.agendas_list) {
                    delete this.agendas_list;
                }
                this.agendas_list = new AgendasList({
                    parentView: this
                });
                this.agendas_list.start();

                this.listenTo(this.agendas_list.agendas, "reset", function() {
                    this.checkSkipAgendas();
                });
            },
            checkSkipAgendas: function() {
                var bAreServicesPreSelected = (typeof oClientValues_248295.selectedServices !== 'undefined') ? true : false;
                var bAreAgendasPreSelected = (typeof oClientValues_248295.selectedAgendas !== 'undefined') ? true : false;

                var bArePreselected = (bAreServicesPreSelected && bAreAgendasPreSelected && oClientValues_248295.selectedAgendas.length > 0) ? true : false;

                var bShownCustom = (oClientValues_248295.hasOwnProperty('customData') && oClientValues_248295.customData.hasOwnProperty('customSelectedPeople') && oClientValues_248295.customData.backToCustom === true) ? true : false;

                if ((typeof oClientValues_248295.backToServices !== 'undefined' && oClientValues_248295.backToServices === true) || bShownCustom) {
                    var elmnt = document.getElementById("idBktWidgetBody");
                    elmnt.scrollIntoView();
                }

                if (bArePreselected) {
                    Backbone.history.navigate('datetime', {
                        trigger: true,
                        replace: true
                    });
                } else if (this.agendas_list.loaded) {
                    this.render();
                    this.show();
                }

                this.hideLoading();
            },
            render: function() {
                this.languagesselector = new LanguagesSelector();
            },
            show: function() {
                $(".clsDivBktWidgetDefaultLoadingContainer").hide();

                this.showBackToServices();

                var breadCrumb = new BreadCrumb();
                breadCrumb.show('#idBktDefaultAgendasContainer .clsDivSubHeaderBreadcrumbsText');
                $(".clsBktDefaultErrorContainer").hide();
                $(".clsBktDefaultWindow").hide();

                if (typeof oClientValues_248295.backToAgendas === 'undefined' || (typeof oClientValues_248295.backToAgendas !== 'undefined' && oClientValues_248295.backToAgendas === true)) {
                    this.$el.show();

                    //                var elmnt = document.getElementById("idBktWidgetBody");
                    //                elmnt.scrollIntoView();
                }
            },
            setSelected: function(p_someAgendas) {
                var someAgendasIndex = {};

                for (var i = 0; i < oClientValues_248295.someAgendas.length; i++) {
                    someAgendasIndex[oClientValues_248295.someAgendas[i].attributes.id] = oClientValues_248295.someAgendas[i].attributes;
                }

                for (var i = 0; i < p_someAgendas.length; i++) {
                    if (typeof someAgendasIndex[p_someAgendas[i]] === 'undefined') {
                        return false;
                    }

                    oClientValues_248295.selectedAgendas.push({
                        id: p_someAgendas[i],
                        name: someAgendasIndex[p_someAgendas[i]].name
                    });
                }

                return true;
            },
            showLoading: function() {
                $('#idBktWidgetDefaultBodyContainer').prepend('<div class="clsDivBktWidgetDefaultLoadingContainer clsDivBktLoadingContainer' + this.identifier + '"><div class="clsDivBktWidgetDefaultLoading"></div></div>');
            },
            hideLoading: function() {
                $('.clsDivBktLoadingContainer' + this.identifier).remove();
            },
            showBackToServices: function() {
                var bShownCustom = (oClientValues_248295.hasOwnProperty('customData') && oClientValues_248295.customData.hasOwnProperty('customSelectedPeople') && oClientValues_248295.customData.backToCustom === true) ? true : false;

                if ((typeof oClientValues_248295.backToServices !== 'undefined' && oClientValues_248295.backToServices === true) || bShownCustom) {
                    this.$('.clsDivSubHeaderBackButton').remove();

                    var template = _.template($("#idTemBackToServices").html());
                    this.$('.clsDivSubHeaderBreadcrumbs').prepend(template);
                }
            }
        });

        return AgendasMainContainer;
    });