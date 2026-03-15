define([
    'jquery',
    'underscore',
    'backbone',
    'widgets/default/router',
    'widgets/default/collections/widgetconfigurations',
    'widgets/default/models/widgetconfiguration',
    'widgets/default/models/widgetlabel',
    'widgets/utils',
    'widgets/default/views/footer',
], function($, _, Backbone, AppRouter, WidgetConfigurations, WidgetConfiguration, WidgetLabel, Utils, Footer) {

    var initialize = function() {
        this.footer = new Footer();
        this.widgetconfigurations = new WidgetConfigurations();
        var that = this;

        this.widgetconfigurations.listenTo(this.widgetconfigurations, "reset", function() {
            oClientValues_248295.widgetconfiguration = new WidgetConfiguration();
            oClientValues_248295.widgetlabel = new WidgetLabel();

            oClientValues_248295.widgetconfiguration.setDefaultValues();
            oClientValues_248295.widgetlabel.setDefaultValues();

            if (typeof that.widgetconfigurations.models[0].attributes.WidgetConfiguration !== 'undefined' && $.isEmptyObject(that.widgetconfigurations.models[0].attributes.WidgetConfiguration) === false) {
                oClientValues_248295.widgetconfiguration = that.widgetconfigurations.models[0].attributes.WidgetConfiguration;
            }

            if (typeof that.widgetconfigurations.models[0].attributes.WidgetLabel !== 'undefined' && $.isEmptyObject(that.widgetconfigurations.models[0].attributes.WidgetLabel) === false) {
                oClientValues_248295.widgetlabel = that.widgetconfigurations.models[0].attributes.WidgetLabel;
            }

            if (typeof that.widgetconfigurations.models[0].attributes.WidgetCustom !== 'undefined' && $.isEmptyObject(that.widgetconfigurations.models[0].attributes.WidgetCustom) === false) {
                oClientValues_248295.widgetcustom = that.widgetconfigurations.models[0].attributes.WidgetCustom;
            }

            if (typeof that.widgetconfigurations.models[0].attributes.bktToken !== 'undefined' && $.isEmptyObject(that.widgetconfigurations.models[0].attributes.bktToken) === false) {
                oClientValues_248295.bktToken = that.widgetconfigurations.models[0].attributes.bktToken;
            }

            if (typeof that.widgetconfigurations.models[0].attributes.signedInData !== 'undefined' && $.isEmptyObject(that.widgetconfigurations.models[0].attributes.signedInData) === false) {
                oClientValues_248295.signedInData = that.widgetconfigurations.models[0].attributes.signedInData;
                that.footer.signInAccountShow();
            }

            that.footer.checkShowFooter();

            //            var cookie = Utils.readCookie();

            //            if(cookie !== null){
            //                oClientValues_248295.signedInData = {name: cookie.name, signedin: cookie.signedin};   
            //                oClientValues_248295.bktToken = cookie.bktToken;
            //                that.footer.signInAccountShow();
            //            }

            var start = new AppRouter;
            // Listen for history changes
            Backbone.history.start();
            //start.navigate(oStartingValues_248295.step, {trigger: true});
        });

        this.widgetconfigurations.fetch({
            data: bkt_init_widget
        });

        return true;
    };

    return {
        initialize: initialize
    };
});