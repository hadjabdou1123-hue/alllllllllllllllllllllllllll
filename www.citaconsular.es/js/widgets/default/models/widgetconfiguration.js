define(['jquery', 'underscore', 'backbone'],
    function($, _, Backbone) {
        var WidgetConfiguration = Backbone.Model.extend({
            iAnyAgendaShowAgendas: 0,
            iAnyAgendaShowAgendasAndAuto: 1,
            iAnyAgendaShowAuto: 2,
            iAnyAgendaShowAnyway: 3,
            iFirstAppointment: 1,
            iSecondAppointment: 2,
            iShowSignInStep: 3,
            parse: function(response, options) {
                this.attributes = response;
            },
            setDefaultValues: function() {
                this.any_agenda = 0;
            }
        });

        return WidgetConfiguration;
    });