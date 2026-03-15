define(['jquery', 'underscore', 'backbone', 'widgets/default/views/servicesselectpeople'],
    function($, _, Backbone, SelectPeople) {
        var ServicesPeople = Backbone.View.extend({
            el: $("#idDivBktNumberOfPeopleContainer"),
            initialize: function(options) {
                this.services = options;
                this.render();
            },
            render: function() {
                this.select_people = new SelectPeople(this.services);
                this.showOrHide();
            },
            showOrHide: function() {
                for (var i = 0; i < this.services.length; i++) {
                    if (parseInt(this.services.models[i].get('multiservice')) > 0 && parseInt(this.services.models[i].get('multiservice_number')) > 1) {
                        this.$el.show();
                        return "show";
                    }
                }

                this.$el.hide();
                return "hide";
            }
        });

        return ServicesPeople;
    });