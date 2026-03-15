define(['jquery', 'underscore', 'backbone'],
    function($, _, Backbone) {
        var LanguageContainer = Backbone.View.extend({
            el: $("#idBktWidgetDefaultLanguageSel"),
            events: {
                'change': 'selectLanguage'
            },
            initialize: function() {
                this.$el.find("option[value='" + bkt_init_widget.lang + "']").attr("selected", "selected");
            },
            selectLanguage: function() {
                Backbone.history.navigate('selectlanguage/' + $('#idBktWidgetDefaultLanguageSel').val(), {
                    trigger: true,
                    replace: true
                });
            }
        });

        return LanguageContainer;
    });