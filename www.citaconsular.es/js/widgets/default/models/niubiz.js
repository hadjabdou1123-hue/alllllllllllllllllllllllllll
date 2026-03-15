define(['jquery', 'underscore', 'backbone', 'widgets/utils'],
    function($, _, Backbone, Utils) {
        var Niubiz = Backbone.Model.extend({
            url: Utils.get_server_url(),
            initialize: function() {

            },
            create: function() {
                this.url = Utils.get_server_url() + "niubizcreatepayment/";
            },
            executed: function() {
                this.url = Utils.get_server_url() + "niubizexecutedpayment/";
            },
            sync: function(method, model, options) {
                options.dataType = "jsonp";
                return Backbone.sync(method, model, options);
            },
            parse: function(response) {
                if (typeof response.Exception !== 'undefined') {
                    return response.Exception;
                } else {
                    return response.Niubiz;
                }
            }
        });

        return Niubiz;
    });