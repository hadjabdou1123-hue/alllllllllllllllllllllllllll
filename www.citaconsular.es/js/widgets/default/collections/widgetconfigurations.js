 define(['jquery', 'underscore', 'backbone', 'widgets/utils', 'widgets/default/models/widgetconfiguration'],
     function($, _, Backbone, Utils, WidgetConfiguration) {
         var WidgetConfigurations = Backbone.Collection.extend({
             url: Utils.get_server_url(),
             model: WidgetConfiguration,
             initialize: function() {
                 this.url += "getwidgetconfigurations/";
             },
             // Overwrite the sync method to pass over the Same Origin Policy
             sync: function(method, model, options) {
                 //options.timeout = 10000;  
                 options.dataType = "jsonp";
                 return Backbone.sync(method, model, options);
             },
             parse: function(response) {
                 return response;
             }
         });

         return WidgetConfigurations;
     });