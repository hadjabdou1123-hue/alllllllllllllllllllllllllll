define(['jquery', 'underscore', 'backbone'],
    function($, _, Backbone) {
        var ServicesButtonContinue = Backbone.View.extend({
            el: $("#idDivBktButtonContinueContainer"),
            initialize: function(services) {
                this.services = services;
                this.render();
            },
            template: _.template($("#idTemContinue").html()),
            render: function() {
                this.showOrHide();
            },
            showOrHide: function() {
                this.$el.empty();

                for (var i = 0; i < this.services.length; i++) {
                    if (parseInt(this.services.models[i].get('multiselect')) > 0) {
                        this.$el.append(this.template());

                        this.$el.show();
                        return "show";
                    }
                }

                this.$el.hide();
                return "hide";
            }
        });

        return ServicesButtonContinue;
    });