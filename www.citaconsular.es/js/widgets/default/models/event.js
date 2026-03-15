define(['jquery', 'underscore', 'backbone', 'widgets/utils'],
    function($, _, Backbone, Utils) {
        var Event = Backbone.Model.extend({
            url: Utils.get_server_url(),
            initialize: function(attributes, options) {
                this.url += "summary/";
            },
            parse: function(response) {
                if (typeof response.Exception !== 'undefined') {
                    return response.Exception;
                } else {
                    return response.Event;
                }
            },
            sync: function(method, model, options) {
                options.dataType = "jsonp";
                return Backbone.sync(method, model, options);
            }
        });
        return Event;
    });