define(['jquery', 'underscore', 'backbone', 'widgets/default/collections/signinaccountfields'],
    function($, _, Backbone, SignInAccountFields) {
        var AccountLoginFieldsList = Backbone.View.extend({
            el: $("#idDivBktAccountLoginContent"),
            loaded: true,
            initialize: function(options) {
                this.parentView = options.parentView;
                this.identifier = new Date().getTime();
            },
            start: function() {
                this.showLoading();
                this.loadFields();
            },
            loadFields: function() {
                var that = this;
                this.fields = new SignInAccountFields();

                this.listenTo(this.fields, "reset", function() {
                    this.$('#idSelBktAccountLoginType').empty();
                    this.doRender();
                });

                this.fields.fetch({
                    data: bkt_init_widget,
                    error: (function() {
                        that.showLoadDataError();
                    })
                });
            },
            doRender: function() {
                if (this.checkEmptyFields() === true) {
                    this.showLoadDataError();
                } else {
                    this.render();
                }
            },
            checkEmptyFields: function() {
                if (this.fields.models.length <= 0) {
                    return true;
                }

                if (typeof this.fields.models[0].attributes.errors !== 'undefined') {
                    return true;
                }

                return false;
            },
            events: {
                'change #idSelBktAccountLoginType': 'changeLoginType',
                'click input': 'hideFieldError',
                'focus input': 'hideFieldError'
            },
            render: function() {
                this.emptyFields();

                var someSiginAccountFields = this.fields.models[0].attributes.Clients;

                for (var i = 0; i < someSiginAccountFields.length; i++) {
                    this.drawClientInputField(someSiginAccountFields[i]);
                }

                this.changeLoginType();

                this.hideLoading();
            },
            emptyFields: function() {
                this.$('#idIptBktAccountLoginlogin').removeClass('clsDivBktDefaultInputError');
                this.$('#idIptBktAccountLoginpassword').removeClass('clsDivBktDefaultInputError');

                this.$('#idIptBktAccountLoginlogin').val('');
                this.$('#idIptBktAccountLoginpassword').val('');
            },
            drawClientInputField: function(field) {
                if (parseInt(field.show_widget) === 1 && parseInt(field.validate) === 1) {
                    var template = _.template($("#idTemAccountLoginInputSelectOption").html(), {
                        iOptionValue: field.input_text,
                        sOptionText: field.field_text
                    });
                    this.$('#idSelBktAccountLoginType').append(template);
                }
            },
            changeLoginType: function() {
                this.$('#idIptBktAccountLoginlogin').attr('placeholder', '* ' + this.$('#idSelBktAccountLoginType :selected').text());
            },
            hideFieldError: function(event) {
                var eventId = event.target.id;

                if (eventId.length > 0) {
                    var sName = this.$('#' + event.target.id).attr('name');

                    if (this.$('#idDivBktFieldError' + sName).is(':visible')) {
                        this.$('#' + event.target.id).removeClass('clsDivBktDefaultInputError');
                        this.$('#idDivBktFieldError' + sName).hide();
                    } else if (this.$('#' + event.target.id).is(':visible')) {
                        this.$('#' + event.target.id).removeClass('clsDivBktDefaultInputError');
                    }
                }
            },
            showLoadDataError: function() {
                this.loaded = false;

                this.$el.hide();

                $(".clsBktDefaultWindow").hide();
                $("#idBktDefaultAccountLoginErrorContainer").show();

                $(".clsDivBktWidgetDefaultLoadingContainer").remove();

                this.parentView.$el.show();
            },
            showLoading: function() {
                $('#idBktWidgetDefaultBodyContainer').prepend('<div class="clsDivBktWidgetDefaultLoadingContainer clsDivBktLoadingContainer' + this.identifier + '"><div class="clsDivBktWidgetDefaultLoading"></div></div>');
            },
            hideLoading: function() {
                $('.clsDivBktLoadingContainer' + this.identifier).remove();
            }
        });

        return AccountLoginFieldsList;
    });