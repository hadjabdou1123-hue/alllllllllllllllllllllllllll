define(['jquery', 'underscore', 'backbone', 'widgets/utils', 'widgets/default/models/field'],
    function($, _, Backbone, Utils, Field) {
        var SignInAccountFields = Backbone.Collection.extend({
            url: Utils.get_server_url(),
            model: Field,
            initialize: function() {
                this.url += "getsigninaccountfields/";
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
                    return response.CustomFields;
                }
            }
        });

        return SignInAccountFields;
    });