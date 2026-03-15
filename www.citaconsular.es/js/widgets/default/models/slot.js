define(['jquery', 'underscore', 'backbone'],
    function($, _, Backbone) {
        var Slot = Backbone.Model.extend({
            parse: function(response, options) {
                this.attributes = response;
            }
        });
        return Slot;
    });