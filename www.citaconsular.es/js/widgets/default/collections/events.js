define(['jquery', 'underscore', 'backbone', 'widgets/utils', 'widgets/default/models/eventhistory'],
    function($, _, Backbone, Utils, EventHistory) {
        var Events = Backbone.Collection.extend({
            url: Utils.get_server_url(),
            model: EventHistory,
            initialize: function() {
                this.url += "gethistory/";
            },
            // Overwrite the sync method to pass over the Same Origin Policy
            sync: function(method, model, options) {
                //options.timeout = 10000;  
                options.dataType = "jsonp";
                return Backbone.sync(method, model, options);
            },
            parse: function(response) {
                if (typeof response.Exception !== 'undefined') {
                    return response.Exception;
                } else {
                    if (typeof response.Customer !== 'undefined') {
                        oClientValues_248295.signedInData.name = response.Customer.name;
                        oClientValues_248295.signedInData.document = response.Customer.document;
                    }

                    return response.Events;
                }
            }
        });

        return Events;
    });