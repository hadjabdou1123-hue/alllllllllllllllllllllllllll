define(['jquery', 'underscore', 'backbone'],
    function($, _, Backbone) {
        var Service = Backbone.Model.extend({
            parse: function(response, options) {
                this.attributes = response;
            }
        });
        return Service;
    });