define(['jquery', 'underscore', 'backbone'],
    function($, _, Backbone) {
        var CustomMainContainer = Backbone.View.extend({
            el: $("#idBktDefaultCustomContainer"),
            events: {
                'click #idDivBktCustomContinueButton': 'goToServices'
            },
            initialize: function() {
                this.identifier = new Date().getTime();
            },
            start: function() {
                this.resetData();
                oClientValues_248295.selectedPeople = 1;
                oClientValues_248295.customData = {};

                $('#idDivBktDefaultCustomFieldsContent').empty();

                $('.clsBktWidgetDefaultLoading').remove();
                $('#idBktWidgetDefaultBodyContainer').show();
                $('.clsDivBktWidgetDefaultLoadingContainer').remove();

                this.showLoading();
                this.loadFields();
                this.show();
            },
            loadFields: function() {
                for (var i = 0; i < oClientValues_248295.widgetcustom.length; i++) {
                    if (oClientValues_248295.widgetcustom[i].type === 'select-numeric') {
                        this.drawSelectNumeric(oClientValues_248295.widgetcustom[i]);
                    }
                }
            },
            drawSelectNumeric: function(p_someAttributes) {
                var parameters = {
                    attributes: p_someAttributes
                };
                var template = _.template($("#idTemFieldCustomSelect").html(), parameters);
                this.$('#idDivBktDefaultCustomFieldsContent').append(template);
            },
            show: function() {
                $(".clsBktDefaultWindow").hide();

                this.$el.show();
                this.hideLoading();
            },
            showLoading: function() {
                $('#idBktWidgetDefaultBodyContainer').prepend('<div class="clsDivBktWidgetDefaultLoadingContainer clsDivBktLoadingContainer' + this.identifier + '"><div class="clsDivBktWidgetDefaultLoading"></div></div>');
            },
            hideLoading: function() {
                $('.clsDivBktLoadingContainer' + this.identifier).remove();
            },
            resetData: function() {
                for (attribute in oClientValues_248295) {
                    if (attribute !== 'widgetconfiguration' && attribute !== 'widgetlabel' && attribute !== 'widgetcustom' &&
                        attribute !== 'someServices' && attribute !== 'someAgendaServices' &&
                        attribute !== 'signedInData' && attribute !== 'bktToken') {
                        delete oClientValues_248295[attribute];
                    }
                }

                $('input:checkbox').removeAttr('checked');
            },
            goToServices: function() {
                oClientValues_248295.customData['backToCustom'] = true;

                for (var i = 0; i < oClientValues_248295.widgetcustom.length; i++) {
                    if (typeof oClientValues_248295.widgetcustom[i].sumpeople !== 'undefined' && oClientValues_248295.widgetcustom[i].sumpeople === true) {
                        var iValue = parseInt($('#' + oClientValues_248295.widgetcustom[i].id).val());

                        if (iValue > 0) {
                            oClientValues_248295.customData['customSelectedPeople'] = (typeof oClientValues_248295.customData.customSelectedPeople !== 'undefined') ? oClientValues_248295.customData.customSelectedPeople + iValue : iValue;
                        }
                    }

                    if (typeof oClientValues_248295.widgetcustom[i].custom_field !== 'undefined') {
                        var sValue = $('#' + oClientValues_248295.widgetcustom[i].id).val();

                        if (typeof bkt_init_widget.fields === 'undefined') {
                            bkt_init_widget['fields'] = [];
                        }

                        bkt_init_widget['fields'][oClientValues_248295.widgetcustom[i].custom_field] = sValue;
                    }
                }

                Backbone.history.navigate('services', {
                    trigger: true,
                    replace: true
                });
            }
        });

        return CustomMainContainer;
    });