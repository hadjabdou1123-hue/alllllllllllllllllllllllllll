define(['jquery', 'underscore', 'backbone', 'widgets/default/views/historyappointmentslist'],
    function($, _, Backbone, HistoryAppointmentsList) {
        var HistoryContainer = Backbone.View.extend({
            events: {
                'click #idDivBktAccountHistorySubHeaderChangePassword': 'showChangePassword'
            },
            el: $("#idBktDefaultAccountHistoryContainer"),
            initialize: function() {
                this.identifier = new Date().getTime();
            },
            start: function() {
                $('.clsBktWidgetDefaultLoading').remove();
                $('#idBktWidgetDefaultBodyContainer').show();
                $('.clsDivBktWidgetDefaultLoadingContainer').remove();

                this.showLoading();
                this.loadAppointments();
            },
            loadAppointments: function() {
                if (this.appointments_list) {
                    $(this.appointments_list.el).off();
                    delete this.appointments_list;
                }
                this.appointments_list = new HistoryAppointmentsList({
                    parentView: this
                });
                this.appointments_list.start();

                this.listenTo(this.appointments_list.events, "reset", function() {
                    if (this.appointments_list.loaded) {
                        this.render();
                        this.show();
                    }

                    this.hideLoading();
                });
            },
            render: function() {

            },
            showChangePassword: function() {
                Backbone.history.navigate('changepassword', {
                    trigger: true,
                    replace: true
                });
            },
            show: function() {
                $(".clsDivBktWidgetDefaultLoadingContainer").hide();
                $(".clsBktDefaultErrorContainer").hide();
                $(".clsBktDefaultWindow").hide();

                $(".clsDivBktSubHeaderExtra").show();

                this.$el.show();
            },
            showLoading: function() {
                $('#idBktWidgetDefaultBodyContainer').prepend('<div class="clsDivBktWidgetDefaultLoadingContainer clsDivBktLoadingContainer' + this.identifier + '"><div class="clsDivBktWidgetDefaultLoading"></div></div>');
            },
            hideLoading: function() {
                $('.clsDivBktLoadingContainer' + this.identifier).remove();
            }
        });

        return HistoryContainer;
    });