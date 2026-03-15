define(['jquery', 'underscore', 'backbone', 'widgets/default/models/waitinglist', 'widgets/utils', 'widgets/default/views/ticket',
        'widgets/default/models/widgetlabel', 'widgets/default/views/languages', 'widgets/default/models/widgetconfiguration', 'widgets/default/collections/services',
        'widgets/default/views/footer'
    ],
    function($, _, Backbone, WaitingList, Utils, TicketView, WidgetLabel, LanguagesSelector, WidgetConfiguration, Services, Footer) {
        var WaitingListSummaryContainer = Backbone.View.extend({
            el: $("#idBktDefaultWaitingListSummaryContainer"),
            initialize: function() {
                //            this.footer = new Footer();
                this.render();
            },
            events: {
                'click #idDivBktWaitingListSummaryBackButton': 'goToBegin'
            },
            start: function() {
                $("#idDivBktDefaultWaitingListSummaryErrorContainer").hide();
                $("#idDivBktWaitingListSummaryContent").hide();

                this.createWaitingList();
            },
            goToBegin: function() {
                this.resetData();
                Backbone.history.navigate('services', {
                    trigger: true,
                    replace: true
                });
            },
            showLoading: function(p_iIdentifier) {
                $('#idBktWidgetDefaultBodyContainer').prepend('<div class="clsDivBktWidgetDefaultLoadingContainer clsDivBktLoadingContainer' + p_iIdentifier + '"><div class="clsDivBktWidgetDefaultLoading"></div></div>');
            },
            hideLoading: function(p_iIdentifier) {
                $('.clsDivBktLoadingContainer' + p_iIdentifier).remove();
            },
            resetData: function() {
                delete oClientValues_248295.clientData;
                delete oClientValues_248295.selectedAgendas;
                delete oClientValues_248295.selectedDate;
                delete oClientValues_248295.selectedServices;
                delete oClientValues_248295.selectedExtras;
                delete oClientValues_248295.selectedTime;

                if (typeof oClientValues_248295.waitingListData !== 'undefined') {
                    delete oClientValues_248295.waitingListData;
                }

                if (typeof oClientValues_248295.customData !== 'undefined') {
                    delete oClientValues_248295.customData;
                }
            },
            createWaitingList: function() {
                var that = this;
                var identifier = new Date().getTime();

                this.showLoading(identifier);

                var data = {
                    bktToken: oClientValues_248295.bktToken
                };

                this.waitingList = new WaitingList();

                this.listenTo(this.waitingList, 'change', function() {
                    if (this.waitingList.attributes.errors) {
                        that.showLoadDataError();
                    } else {
                        var bIsSignedIn = (typeof oClientValues_248295.signedInData !== 'undefined') ? true : false;

                        $('.clsBktDefaultWindow').hide();

                        $("#idDivBktDefaultWaitingListSummaryErrorContainer").hide();
                        $("#idDivBktWaitingListSummaryContent").show();

                        this.$el.show();

                        if (bIsSignedIn === false) {
                            delete oClientValues_248295.bktToken;
                        }
                    }

                    this.hideLoading(identifier);
                });

                this.waitingList.fetch({
                    data: data,
                    error: (function() {
                        that.showLoadDataError();
                    })
                });
            },
            showLoadDataError: function() {
                $('.clsBktDefaultWindow').hide();

                $("#idDivBktDefaultWaitingListSummaryErrorContainer").show();
                $('.clsDivBktWidgetDefaultLoadingContainer').remove();

                this.$el.show();
            }
        });

        return WaitingListSummaryContainer;
    });