define(['jquery', 'underscore', 'backbone', 'widgets/default/models/client', 'widgets/utils', 'widgets/default/models/widgetconfiguration'],
    function($, _, Backbone, Client, Utils, WidgetConfiguration) {
        var AccountContainer = Backbone.View.extend({
            el: $("#idBktWidgetDefaultFooterAccount"),
            events: {
                'click #idBktWidgetDefaultFooterAccountSignOutAccount': 'doSignOutAccount'
            },
            initialize: function() {
                $(this.el).off();
                this.identifier = new Date().getTime();
            },
            signInAccountShow: function() {
                $('#idBktWidgetDefaultFooterAccountSignInAccountContainer').hide();
                $('#idBktWidgetDefaultFooterAccountSignOutAccountContainer').show();

                //            var sName = $.trim(oClientValues_248295.signedInData.name);
                //            
                //            $('#idBktWidgetDefaultFooterAccountSignOutAccountName').html(sName);
            },
            signOutAccountShow: function() {
                $('#idBktWidgetDefaultFooterAccountSignOutAccountContainer').hide();
                $('#idBktWidgetDefaultFooterAccountSignInAccountContainer').show();
            },
            doSignOutAccount: function() {
                this.client = new Client();

                this.client.url = Utils.get_server_url() + "signoutaccount/";

                var data = $.extend(true, {}, bkt_init_widget);
                data.bktToken = oClientValues_248295.bktToken;

                this.client.fetch({
                    data: data
                });

                //            Utils.deleteCookie();
                this.signOutAccountClientData();

                Backbone.history.navigate('signinaccount', {
                    trigger: true,
                    replace: true
                });
            },
            signOutAccountClientData: function() {
                delete oClientValues_248295.signedInData;
                delete oClientValues_248295.bktToken;

                this.signOutAccountShow();
            },
            checkSignedIn: function() {
                if (typeof oClientValues_248295.signedInData !== 'undefined') {
                    return true;
                }

                return false;
            },
            checkShowFooter: function() {
                this.widgetconfiguration = new WidgetConfiguration();

                var bFirstAppointment = (typeof oClientValues_248295.widgetconfiguration.registration_type !== 'undefined' && parseInt(oClientValues_248295.widgetconfiguration.registration_type) === this.widgetconfiguration.iFirstAppointment) ? true : false;

                if (bFirstAppointment) {
                    this.$el.hide();
                }
            }
        });

        return AccountContainer;
    });