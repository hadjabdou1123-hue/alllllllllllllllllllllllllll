define(['jquery', 'underscore', 'backbone'],
    function($, _, Backbone) {
        var Field = Backbone.Model.extend({
            iTypeText: 1,
            iTypeCheckbox: 2,
            iTypeDrop: 3,
            iTypeDropAndText: 4,
            parse: function(response, options) {
                this.attributes = response;
            }
        });
        return Field;
    });