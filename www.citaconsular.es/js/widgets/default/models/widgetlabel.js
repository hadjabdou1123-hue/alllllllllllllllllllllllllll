define(['jquery', 'underscore', 'backbone'],
    function($, _, Backbone) {
        var WidgetLabel = Backbone.Model.extend({
            iShowExtraInfo: 1,
            iShowatBeforeAccountDetails: 2,
            iShowatBeforeAppointmentSummary: 1,
            iShowatAfterAppointmentSummary: 0,
            iShowWhenFirstAppointment: 1,
            iShowWhenSecondAppointment: 2,
            parse: function(response, options) {
                this.attributes = response;
            },
            setDefaultValues: function() {
                this.show_extra_info = 0;
                this.show_at = 0;
                this.show_when = 0;
                this.extra_info = '';
                this.label_users_comments = '';
            }
        });

        return WidgetLabel;
    });