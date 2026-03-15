define(['jquery', 'underscore', 'backbone', 'widgets/default/views/breadcrumb', 'widgets/default/models/creditcard'],
    function($, _, Backbone, BreadCrumb, CreditCard) {
        var CreditCardCaptureStr = Backbone.View.extend({
            el: $("#idDivBktPaymentGatewayStripeContainer"),
            events: {
                'click #idBktDefaultCCCStrSubmitButton': 'sendCreditCardDataV3',
                'click #idDivBktCCCStrWhatsThis': 'showWhatsThis',
                'click #idDivBktCCCStrCardClose': 'closeWhatsThis',
                'click #idDivBktCCCStrErrorClose': 'closeError'
            },
            initialize: function() {
                $(this.el).off();
                this.publickey = this.$el.find("#idBktDefaultCCCStrKey").text();
                this.errorMessage = this.$el.find("#idDivBktCCCStrError").text();
                this.identifier = new Date().getTime();
            },
            show: function() {

            },
            start: function() {
                this.emptyContainers();

                if (!$('#idStripeCreditCardContainer').hasClass('StripeElement')) {
                    var that = this;

                    that.showLoading();

                    require(['https://js.stripe.com/v3/'], function(Str) {
                        oStripe = Stripe(that.publickey);
                        var elements = oStripe.elements();

                        var elementStyles = {
                            base: {
                                color: '#666666',
                                fontFamily: 'Arial,Helvetica,Verdana',
                                fontSize: '1em',
                                '::placeholder': {
                                    color: '#B7ADAD',
                                    fontSize: '1em',
                                },
                            },
                        };

                        cardNumber = elements.create('cardNumber', {
                            style: elementStyles,
                        });
                        cardNumber.mount('#idStripeCreditCardContainer');

                        cardExpiry = elements.create('cardExpiry', {
                            style: elementStyles,
                        });
                        cardExpiry.mount('#idStripeExpiryContainer');

                        cardCvc = elements.create('cardCvc', {
                            style: elementStyles,
                        });
                        cardCvc.mount('#idStripeCvcContainer');

                        cardCvc.on('ready', function() {
                            that.hideLoading();
                        });
                        //                    that.hideLoading();
                    });
                } else {
                    $('#idDivBktStripeError').html('');

                    cardNumber.clear();
                    cardExpiry.clear();
                    cardCvc.clear();
                }
            },
            emptyContainers: function() {
                var someFields = ['#idInpExpiryYear', '#idInpExpiryMonth', '#idInpCreditCard', '#idInpHolderName', '#idInpCvc'];

                for (var i = 0; i < someFields.length; i++) {
                    this.$(someFields[i]).val("");
                    this.$(someFields[i]).removeClass('clsDivBktDefaultInputError');
                }

                this.$('#idDivBktCCCStrCardInfo').hide();
                this.$('#idDivBktCCCStrError').hide();
            },
            sendCreditCardData: function() {
                var that = this;

                this.oCreditCard = new CreditCard();

                var someIdsOfEmptyFields = this.oCreditCard.getEmptyFields();

                if (someIdsOfEmptyFields.length > 0) {
                    for (var i = 0; i < someIdsOfEmptyFields.length; i++) {
                        $(someIdsOfEmptyFields[i]).addClass('clsDivBktDefaultInputError');
                    }

                    return;
                }

                this.showLoading();
                this.$el.find('.clsBktDefaultCCCStrErrorMessage').remove();

                require(['https://js.stripe.com/v2/'], function(Str) {
                    Stripe.setPublishableKey(that.publickey);
                    Stripe.card.createToken($('#idFrmBktCCCStr'), that.stripeResponseHandler.bind(that));
                });
            },
            stripeResponseHandler: function(status, response) {
                var $form = $('#idFrmBktCCCStr');

                if (response.error) {
                    this.reportError(response);
                    this.hideLoading();
                } else {
                    var token = response.id;

                    $form.append($('<input type="hidden" id="idBktStripeToken" name="stripeToken" />').val(token));

                    var bktToken = oClientValues_248295.bktToken;
                    var sLogin = (typeof oClientValues_248295.clientData.attributes.logintype !== 'undefined') ? oClientValues_248295.clientData.attributes.login : oClientValues_248295.clientData.attributes.email;

                    this.oCreditCard.set({
                        stripeToken: token,
                        bankType: 'stripe',
                        name: this.$el.find("#idInpHolderName").val(),
                        email: sLogin,
                        bktToken: bktToken
                    });

                    var that = this;

                    this.listenTo(this.oCreditCard, "change", function() {
                        if (that.oCreditCard.attributes['payment_done'] === true) {
                            Backbone.history.navigate('summary', {
                                trigger: true,
                                replace: true
                            });
                        } else {
                            that.showLoadDataError();
                        }

                        this.hideLoading();
                    });

                    this.oCreditCard.fetch({
                        data: this.oCreditCard.attributes,
                        error: (function() {
                            that.showLoadDataError();
                        })
                    });
                }
            },
            reportError: function(response) {
                this.showLoadDataError();

                return false;
            },
            showWhatsThis: function() {
                $('#idDivBktCCCStrCardInfo').show();
            },
            closeWhatsThis: function() {
                $('#idDivBktCCCStrCardInfo').hide();
            },
            closeError: function() {
                $("#idDivBktCCCStrError").hide();
            },
            showLoadDataError: function() {
                //            $(".clsBktDefaultWindow").hide();  
                $(".clsDivBktWidgetDefaultLoadingContainer").remove();
                this.$el.show();
                $("#idDivBktCCCStrError").show();
            },
            showLoading: function() {
                $('#idBktDefaultCCCStrContainer').prepend('<div class="clsDivBktWidgetDefaultLoadingContainer clsDivBktLoadingContainer' + this.identifier + '"><div class="clsDivBktWidgetDefaultLoading"></div></div>');
            },
            hideLoading: function() {
                $('.clsDivBktLoadingContainer' + this.identifier).remove();
            },


            sendCreditCardDataV3: function() {
                var that = this;

                this.oCreditCard = new CreditCard();

                var someIdsOfEmptyFields = this.oCreditCard.getEmptyFields();

                if (someIdsOfEmptyFields.length > 0) {
                    for (var i = 0; i < someIdsOfEmptyFields.length; i++) {
                        $(someIdsOfEmptyFields[i]).addClass('clsDivBktDefaultInputError');
                    }

                    return;
                }

                this.showLoading();
                this.$el.find('.clsBktDefaultCCCStrErrorMessage').remove();

                oStripe.createPaymentMethod('card', cardNumber).then(function(result) {
                    if (result.error) { // Show error in payment form
                        $('#idDivBktStripeError').html(result.error.message);
                        that.hideLoading();
                    } else { // Send paymentMethod.id to server
                        that.sendPaymentMethodV3(result);
                    }
                });
            },
            sendPaymentMethodV3: function(result) {
                var that = this;

                var token = (typeof result.paymentMethod !== 'undefined') ? result.paymentMethod.id : result.paymentIntent.id;

                var bktToken = oClientValues_248295.bktToken;
                var sLogin = (typeof oClientValues_248295.clientData.attributes.logintype !== 'undefined') ? oClientValues_248295.clientData.attributes.login : oClientValues_248295.clientData.attributes.email;

                this.oCreditCard.set({
                    stripeToken: token,
                    bankType: 'stripe',
                    name: this.$el.find("#idInpHolderName").val(),
                    email: sLogin,
                    bktToken: bktToken
                });

                this.listenTo(this.oCreditCard, "change", function() {
                    if (that.oCreditCard.attributes['payment_done'] === true) {
                        Backbone.history.navigate('summary', {
                            trigger: true,
                            replace: true
                        });
                    } else if (that.oCreditCard.attributes['requires_action'] === true) {
                        that.handleCardActionV3(that.oCreditCard.attributes['payment_intent']);
                    } else {
                        that.showLoadDataError();
                        this.hideLoading();
                    }
                });

                this.oCreditCard.fetch({
                    data: this.oCreditCard.attributes,
                    error: (function() {
                        that.showLoadDataError();
                    })
                });
            },
            handleCardActionV3: function(paymentIndent) {
                var that = this;

                oStripe.handleCardAction(paymentIndent).then(function(result) {
                    if (result.error) {
                        $('#idDivBktStripeError').html(result.error.message);
                        that.hideLoading();
                    } else {
                        that.sendPaymentMethodV3(result);
                    }
                });

            }
        });

        return CreditCardCaptureStr;
    });