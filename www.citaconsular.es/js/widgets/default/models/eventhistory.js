define(['jquery', 'underscore', 'backbone', 'widgets/utils'],
    function($, _, Backbone, Utils) {
        var EventHistory = Backbone.Model.extend({
            iStateCanceled: 0,
            iStateCompleted: 1,
            iStatePending: 2,
            iStateRejected: 4,
            parse: function(response) {
                this.attributes = response;
            }
        });
        return EventHistory;
    });