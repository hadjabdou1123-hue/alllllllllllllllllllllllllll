define(['jquery', 'underscore', 'backbone', 'widgets/default/views/signin', 'widgets/utils', 'widgets/default/models/widgetconfiguration'],
    function($, _, Backbone, SignInContainer, Utils, WidgetConfiguration) {
        var SignUpSecondAppointmentContainer = SignInContainer.extend({
            initialize: function() {
                this.widgetconfiguration = new WidgetConfiguration();
                this.checkSecondAppointment();

                SignUpSecondAppointmentContainer.__super__.initialize();
            },
            checkSecondAppointment: function() {
                if (typeof oClientValues_248295.widgetconfiguration.registration_type !== 'undefined' && parseInt(oClientValues_248295.widgetconfiguration.registration_type) === this.widgetconfiguration.iSecondAppointment) {
                    $('#idDivBktSignInSubHeader').remove();
                }
            }
        });

        return SignUpSecondAppointmentContainer;
    });