define(['jquery', 'underscore', 'backbone', 'widgets/utils', 'widgets/default/models/slot'],
    function($, _, Backbone, Utils, Slot) {
        var Slots = Backbone.Collection.extend({
            url: Utils.get_server_url(),
            model: Slot,
            initialize: function() {
                this.url += "datetime/";
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
                    oClientValues_248295.max = response.maxDays;

                    return response.Slots;
                }
            }
        });

        return Slots;
    });