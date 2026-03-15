define(['jquery', 'underscore', 'backbone', 'widgets/default/views/creditcardcapturestr', 'widgets/default/collections/services', 'widgets/utils', 'widgets/default/views/breadcrumb', 'widgets/default/models/redsys', 'widgets/default/models/niubiz'],
    function($, _, Backbone, CreditCardCaptureStr, Services, Utils, BreadCrumb, Redsys, Niubiz) {
        var CreditCardCapture = Backbone.View.extend({
            el: $("#idBktDefaultCCCStrContainer"),
            initialize: function() {
                if (!this.isWaitingList()) {
                    return;
                }

                this.identifier = new Date().getTime();
                this.oServices = new Services();

                this.oCreditCardCapture = new CreditCardCaptureStr();
                this.oRedsys = new Redsys();
                this.oNiubiz = new Niubiz();

                this.bStripeActive = oClientValues_248295.widgetconfiguration.payments_gateways.stripe;
                this.bPaypalActive = oClientValues_248295.widgetconfiguration.payments_gateways.paypal;
                this.bRedsysActive = oClientValues_248295.widgetconfiguration.payments_gateways.redsys;
                this.bNiubizActive = oClientValues_248295.widgetconfiguration.payments_gateways.niubiz;

                this.iCountActivegateways = 0;

                if (this.bStripeActive === true) {
                    this.iCountActivegateways++;
                }
                if (this.bPaypalActive === true) {
                    this.iCountActivegateways++;
                }
                if (this.bRedsysActive === true) {
                    this.iCountActivegateways++;
                }
                if (this.bNiubizActive === true) {
                    this.iCountActivegateways++;
                }

                if (!this.arePaymentServices()) {
                    return;
                }
            },
            events: {
                'click #idBktDefaultCCCBackButton': 'backButton',
                'click #idDivBktPaymentsGatewaysStripe': 'usePaymentGatewayStripe',
                'click #idDivBktPaymentsGatewaysPaypal': 'usePaymentGatewayPaypal',
                'click #idDivBktPaymentsGatewaysRedsys': 'usePaymentGatewayRedsys',
                'click #idDivBktPaymentsGatewaysNiubiz': 'usePaymentGatewayNiubiz',
                'click #idDivBktPaymentsGatewaysBackContainer': 'backToPaymentsGateways',
                'click #idNiubizPayButton': 'sendNiubizPayment'
            },
            start: function() {
                if (!this.isWaitingList()) {
                    return;
                }
                if (!this.arePaymentServices()) {
                    return;
                }

                if (typeof oClientValues_248295.priceData === 'undefined') {
                    return;
                }

                var online = String(parseFloat(oClientValues_248295.priceData.online).toFixed(2)).replace('.', ',');
                var offline = String((parseFloat(oClientValues_248295.priceData.offline) - parseFloat(oClientValues_248295.priceData.online)).toFixed(2)).replace('.', ',');
                var total = String(parseFloat(oClientValues_248295.priceData.offline).toFixed(2)).replace('.', ',');
                var currency = String(oClientValues_248295.priceData.currency);

                //            $('#idDivBktCCCStrAmountOnline').text(online + currency);
                //            $('#idDivBktCCCStrAmountOffline').text(offline + currency);
                //            $('#idDivBktCCCStrAmountTotal').text(total + currency);

                $('#idDivBktCCCStrAmountOnline').text(oClientValues_248295.priceData.onlineString);
                $('#idDivBktCCCStrAmountOffline').text(oClientValues_248295.priceData.offlineString);
                $('#idDivBktCCCStrAmountTotal').text(oClientValues_248295.priceData.totalString);

                $('.clsBktWidgetDefaultLoading').remove();
                $('#idBktWidgetDefaultBodyContainer').show();
                $('.clsDivBktWidgetDefaultLoadingContainer').remove();

                this.render();
            },
            isWaitingList: function() {
                if (typeof oClientValues_248295.waitingListData !== 'undefined') {
                    Backbone.history.navigate('waitinglistsummary', {
                        trigger: true,
                        replace: true
                    });
                    return false;
                }

                return true;
            },
            arePaymentServices: function() {
                if (!this.oServices.arePaymentServices()) {
                    Backbone.history.navigate('summary', {
                        trigger: true,
                        replace: true
                    });
                    return false;
                }

                return true;
            },
            backButton: function() {
                if (typeof oClientValues_248295.clientData.attributes.login === 'undefined') {
                    Backbone.history.navigate('signup', {
                        trigger: true,
                        replace: true
                    });
                } else {
                    Backbone.history.navigate('signin', {
                        trigger: true,
                        replace: true
                    });
                }
            },
            startView: function() {
                $('#idDivBktBanksErrorContainer').hide();

                $('#idDivBktPaymentsGatewaysContainer').hide();

                $('#idDivBktPaymentsGatewaysStripe').hide();
                $('#idDivBktPaymentsGatewaysRedsys').hide();
                $('#idDivBktPaymentsGatewaysPaypal').hide();
                $('#idDivBktPaymentsGatewaysNiubiz').hide();

                $('#idDivBktPaymentsGatewaysBackContainer').hide();

                $('#idDivBktPaymentGatewayStripeContainer').hide();
                $('#idDivBktPaymentGatewayPaypalContainer').hide();
                $('#idDivBktPaymentGatewayRedsysContainer').hide();
                $('#idDivBktPaymentGatewayNiubizContainer').hide();

                $('#idDivBktPaypalErrorContainer').hide();
                $('#idDivBktRedsysErrorContainer').hide();
                $('#idDivBktNiubizErrorContainer').hide();

                $('#idDivBktPaypalButtonContainer').show();
            },
            render: function() {
                this.startView();

                $(".clsBktDefaultWindow").hide();
                $("#idBktDefaultCCCStrContainer").show();

                var breadCrumb = new BreadCrumb();
                breadCrumb.show('#idBktDefaultCCCStrContainer .clsDivSubHeaderBreadcrumbsText');

                this.checkActivePaymentsGateways();
            },
            checkActivePaymentsGateways: function() {
                if (this.iCountActivegateways <= 0) {
                    $('#idDivBktBanksErrorContainer').show();
                    return true;
                }

                if (this.iCountActivegateways > 1) {
                    $('#idDivBktPaymentsGatewaysContainer').show();

                    if (this.bRedsysActive === true) {
                        $("#idDivBktPaymentsGatewaysRedsys").show();
                    } else if (this.bNiubizActive === true) {
                        $("#idDivBktPaymentsGatewaysNiubiz").show();
                    } else if (this.bStripeActive === true) {
                        $("#idDivBktPaymentsGatewaysStripe").show();
                    }

                    if (this.bPaypalActive === true) {
                        $("#idDivBktPaymentsGatewaysPaypal").show();
                    }
                } else {
                    if (this.bRedsysActive === true) {
                        $('#idDivBktPaymentsGatewaysContainer').show();
                        $("#idDivBktPaymentsGatewaysRedsys").show();

                        return true;
                    }

                    if (this.bStripeActive === true) {
                        this.oCreditCardCapture.start();
                        $('#idDivBktPaymentGatewayStripeContainer').show();

                        return true;
                    }

                    if (this.bPaypalActive === true) {
                        $("#idDivBktPaymentGatewayPaypalContainer").show();
                        this.renderPaypalCheckoutButton();

                        return true;
                    }

                    if (this.bNiubizActive === true) {
                        // this.oCreditCardCapture.start();
                        $('#idDivBktPaymentGatewayNiubizContainer').show();
                        this.renderNiubizCardForm();

                        return true;
                    }
                }

                return true;
            },
            renderPaypalCheckoutButton: function() {
                if ($('#idDivBktPaypalButtonContainer').html().length > 0) {
                    return true;
                }

                var that = this;

                require(['https://www.paypalobjects.com/api/checkout.js'], function(Str) {
                    that.showLoading();

                    paypal.Button.render({
                        env: sPaypalGatewayEnv,
                        locale: that.setPaypalgatewayLocale(),
                        style: {
                            layout: 'vertical',
                            size: 'large',
                            shape: 'rect',
                            color: 'black'
                        },
                        funding: {
                            allowed: [paypal.FUNDING.CARD, paypal.FUNDING.CREDIT, paypal.FUNDING.ELV],
                            disallowed: []
                        },
                        commit: true,
                        payment: function() {
                            var CREATE_URL = Utils.get_server_url() + 'paypalcreatepayment/';

                            var bktToken = oClientValues_248295.bktToken;
                            var sLogin = (typeof oClientValues_248295.clientData.attributes.logintype !== 'undefined') ? oClientValues_248295.clientData.attributes.login : oClientValues_248295.clientData.attributes.email;

                            var data = {
                                bankType: 'paypal',
                                bktToken: bktToken,
                                email: sLogin
                            };

                            return paypal.request.post(CREATE_URL, data).then(function(res) {
                                if (typeof res.paymentID !== 'undefined') {
                                    return res.paymentID;
                                } else {
                                    that.showPaypalError();
                                }
                            });
                        },
                        onAuthorize: function(data, actions) {
                            var EXECUTE_URL = Utils.get_server_url() + 'paypalexecutepayment/';

                            var bktToken = oClientValues_248295.bktToken;

                            var data = {
                                paymentID: data.paymentID,
                                payerID: data.payerID,
                                bktToken: bktToken
                            };

                            return paypal.request.post(EXECUTE_URL, data).then(function(res) {
                                if (typeof res.id !== 'undefined') {

                                    Backbone.history.navigate('summary', {
                                        trigger: true,
                                        replace: true
                                    });
                                } else {
                                    that.showPaypalError();
                                }
                            });
                        }
                    }, '#idDivBktPaypalButtonContainer');

                    that.hideLoading();
                });
            },
            showLoading: function() {
                $('#idBktDefaultCCCStrContainer').prepend('<div class="clsDivBktWidgetDefaultLoadingContainer clsDivBktLoadingContainer' + this.identifier + '"><div class="clsDivBktWidgetDefaultLoading"></div></div>');
            },
            hideLoading: function() {
                $('.clsDivBktLoadingContainer' + this.identifier).remove();
            },
            setPaypalgatewayLocale: function() {
                var translateMonthNames = [];
                translateMonthNames['en'] = 'en_US';
                translateMonthNames['es'] = 'es_ES';
                translateMonthNames['pt'] = 'pt_PT';
                translateMonthNames['ca'] = 'es_ES';
                translateMonthNames['uk'] = 'en_US';
                translateMonthNames['de'] = 'de_DE';
                translateMonthNames['ko'] = 'ko_KR';
                translateMonthNames['fr'] = 'fr_FR';
                translateMonthNames['eu'] = 'es_ES';

                return translateMonthNames[bkt_init_widget.lang];
            },
            showPaypalError: function() {
                $('#idDivBktPaymentsGatewaysContainer').hide();
                $('#idDivBktPaypalErrorContainer').show();
                $('#idDivBktPaypalButtonContainer').hide();

                if (this.iCountActivegateways > 1) {
                    $("#idDivBktPaymentsGatewaysBackContainer").show();
                }
            },
            renderRedsysCheckoutButton: function() {
                var that = this;

                this.oRedsys.create();
                this.listenTo(this.oRedsys, "change", function(response) {
                    if (typeof this.oRedsys.attributes.params !== 'undefined' && typeof this.oRedsys.attributes.signature !== 'undefined') {
                        $('#idDsMerchantParameters').val(this.oRedsys.attributes.params);
                        $('#idDsSignature').val(this.oRedsys.attributes.signature);

                        $('#idFormBktRedsys').submit();
                    }
                });

                var data = $.extend(true, {}, bkt_init_widget);
                data.bktToken = oClientValues_248295.bktToken;
                data.bktclient = {
                    'clientData': JSON.stringify(oClientValues_248295.clientData),
                    'priceData': JSON.stringify(oClientValues_248295.priceData),
                    'selectedDate': JSON.stringify(oClientValues_248295.selectedDate),
                    'selectedTime': JSON.stringify(oClientValues_248295.selectedTime),
                    'selectedServices': JSON.stringify(oClientValues_248295.selectedServices),
                    'selectedAgendas': JSON.stringify(oClientValues_248295.selectedAgendas),
                    'signedInData': JSON.stringify(oClientValues_248295.signedInData)
                }

                this.oRedsys.fetch({
                    data: data,
                    error: (function() {
                        that.showRedsysError();
                    })
                });
            },
            showRedsysError: function() {
                $('#idDivBktPaymentsGatewaysContainer').hide();
                $('#idDivBktPaymentGatewayRedsysContainer').show();
                $('#idDivBktRedsysErrorContainer').show();

                if (this.iCountActivegateways > 1) {
                    $("#idDivBktPaymentsGatewaysBackContainer").show();
                }

                this.hideLoading();
            },
            backToPaymentsGateways: function() {
                this.startView();

                this.checkActivePaymentsGateways();
            },
            usePaymentGatewayStripe: function() {
                $("#idDivBktPaymentsGatewaysContainer").hide();

                $("#idDivBktPaymentGatewayStripeContainer").show();

                if (this.iCountActivegateways > 1) {
                    $("#idDivBktPaymentsGatewaysBackContainer").show();
                }

                this.oCreditCardCapture.start();
            },
            usePaymentGatewayPaypal: function() {
                $("#idDivBktPaymentsGatewaysContainer").hide();

                this.renderPaypalCheckoutButton();
                $("#idDivBktPaymentGatewayPaypalContainer").show();

                if (this.iCountActivegateways > 1) {
                    $("#idDivBktPaymentsGatewaysBackContainer").show();
                }
            },
            usePaymentGatewayRedsys: function() {
                this.showLoading();
                this.renderRedsysCheckoutButton();
            },
            usePaymentGatewayNiubiz: function() {
                $("#idDivBktPaymentsGatewaysContainer").hide();

                $("#idDivBktPaymentGatewayNiubizContainer").show();

                if (this.iCountActivegateways > 1) {
                    $("#idDivBktPaymentsGatewaysBackContainer").show();
                }

                this.renderNiubizCardForm();
            },
            renderNiubizCardForm: function() {
                this.showLoading();
                var that = this;

                this.oNiubiz = new Niubiz();
                this.oNiubiz.create();

                $('#idBktNiubizCardNumber').empty();
                $('#idBktNiubizCardNumber').removeClass();
                $('#idBktNiubizCardNumber').addClass('form-control');
                $('#idBktNiubizExpirationDate').empty();
                $('#idBktNiubizExpirationDate').removeClass();
                $('#idBktNiubizExpirationDate').addClass('form-control');
                $('#idBktNiubizCvv').empty();
                $('#idBktNiubizCvv').removeClass();
                $('#idBktNiubizCvv').addClass('form-control');

                sessionkey = "";

                require(['https://pocpaymentserve.s3.amazonaws.com/payform.js?bbb=' + (Math.floor(Math.random() * 100))], function(Niu) {
                    that.listenTo(that.oNiubiz, "change", function(response) {
                        if (typeof that.oNiubiz.attributes.error !== 'undefined') {
                            $('#idDivBktNiubizCCCContainer').hide();
                            $('#idDivBktBanksErrorContainer').show();
                            that.hideLoading();
                        } else if (typeof that.oNiubiz.attributes.sessionkey !== 'undefined') {
                            $('#idDivBktNiubizCCCContainer').show();
                            $('#idDivBktBanksErrorContainer').hide();
                            niubizconfiguration = {
                                sessionkey: String(that.oNiubiz.attributes.sessionkey),
                                channel: 'web',
                                merchantid: String(that.oNiubiz.attributes.merchantid),
                                purchasenumber: String(that.oNiubiz.attributes.purchasenumber),
                                amount: String(that.oNiubiz.attributes.amount),
                                language: 'es',
                                font: 'https://fonts.googleapis.com/css?family=Montserrat:400&display=swap',
                                callbackurl: ''
                                // recurrentmaxamount: String(that.oNiubiz.attributes.amount)
                            };

                            other_configuration = {
                                currency: String(that.oNiubiz.attributes.currency)
                            };

                            if (typeof sessionKey === 'undefined' || sessionKey !== that.oNiubiz.attributes.sessionkey) {
                                payform.setConfiguration(niubizconfiguration);
                                sessionKey = that.oNiubiz.attributes.sessionkey;

                                var elementStyles = {
                                    base: {
                                        color: '#666666',
                                        fontWeight: 700,
                                        fontFamily: "'Montserrat', sans-serif",
                                        fontSize: '15px',
                                        fontSmoothing: 'antialiased',
                                        placeholder: {
                                            color: '#999999'
                                        },
                                        autofill: {
                                            color: '#e39f48'
                                        }
                                    },
                                    invalid: {
                                        color: '#dc3545',
                                        '::placeholder': {
                                            color: '#FFCCA5'
                                        }
                                    }
                                };

                                cardNumber = payform.createElement(
                                    'card-number', {
                                        style: elementStyles,
                                        placeholder: 'Número de Tarjeta'
                                    },
                                    'idBktNiubizCardNumber'
                                );

                                // cardNumber.then(element => {
                                //     // element.on('bin', function(data) {
                                //     //     //Tu código aquí
                                //     //     // console.log('bin:'+data);
                                //     //     console.log('bin');
                                //     // });
                                //     // element.on('change', function(cardNumberdata) {
                                //     //     //Tu código aquí
                                //     //     console.log('CardNumberData: ' + JSON.stringify(cardNumberdata));
                                //     //     console.log('change');
                                //     // });
                                //     // element.on('dcc', function(data) {
                                //     //     //Tu código aquí
                                //     //     // console.log(JSON.stringify(data));
                                //     //     console.log('dcc');
                                //     // });
                                //     // element.on('installments', function(data) {
                                //     //     //Tu código aquí
                                //     //     // console.log(JSON.stringify(data));
                                //     //     console.log('installments');
                                //     // });
                                // });

                                cardExpiry = payform.createElement(
                                    'card-expiry', {
                                        style: elementStyles,
                                        placeholder: 'MM/AA'
                                    }, 'idBktNiubizExpirationDate'
                                );

                                // cardExpiry.then(element => { element.on('change', function(cardExpirydata) {
                                //     console.log('CardExpiryData: ' + JSON.stringify(cardExpirydata));
                                // })});

                                cardCvv = payform.createElement(
                                    'card-cvc', {
                                        style: elementStyles,
                                        placeholder: 'CVV'
                                    }, 'idBktNiubizCvv'
                                );

                                // cardCvv.then(element => { element.on('change', function(cardCvvdata) {
                                //     // console.log(event);
                                //     console.log('cardCvvData: ' + JSON.stringify(cardCvvdata));
                                // })});
                            }
                        }
                        that.hideLoading();
                    });
                });

                var data = $.extend(true, {}, bkt_init_widget);
                data.bktToken = oClientValues_248295.bktToken;

                this.oNiubiz.fetch({
                    data: data,
                    error: (function() {
                        that.showNiubizError();
                    })
                });
            },
            showNiubizError: function() {
                $('#idDivBktPaymentsGatewaysContainer').hide();
                $('#idDivBktPaymentGatewayNiubizContainer').show();
                $('#idDivBktNiubizErrorContainer').show();

                if (this.iCountActivegateways > 1) {
                    $("#idDivBktPaymentsGatewaysBackContainer").show();
                }

                this.hideLoading();
            },

            sendNiubizPayment: async function() {
                try {
                    this.showLoading();
                    var data = {
                        name: (typeof this.oNiubiz.attributes.name !== 'undefined') ? this.oNiubiz.attributes.name : "No name",
                        lastName: (typeof this.oNiubiz.attributes.name !== 'undefined') ? this.oNiubiz.attributes.name : "No lastname",
                        email: (typeof this.oNiubiz.attributes.email !== 'undefined') ? this.oNiubiz.attributes.email : "no_email@bookitit.com",
                        alias: (typeof this.oNiubiz.attributes.email !== 'undefined') ? this.oNiubiz.attributes.email : "no_email@bookitit.com",
                        // userBlockId: 'miUserBlockId'
                    };

                    var that = this;

                    var createTokenresponse = await payform.createToken([cardNumber, cardExpiry, cardCvv], data);
                    //console.log('Create Token Response: ' + JSON.stringify(createTokenresponse));
                    //console.log('Create Token-> Transaction Token: ' + createTokenresponse.transactionToken);

                    var cardToken = "";
                    var makeAuthorizationResponse = await this.makeAuthorizationRequest(createTokenresponse.transactionToken, niubizconfiguration, data, other_configuration, cardToken);
                    //console.log('makeAuthorizationResponse: ' + JSON.stringify(makeAuthorizationResponse));
                    this.sendNiubizPaymentState(makeAuthorizationResponse);

                } catch (errorsendNiubizPayment) {
                    this.hideLoading();
                    //console.log('Hubo un problema al realizar el pago' + errorsendNiubizPayment);
                    this.showNiubizError();
                }
            },
            makeAuthorizationRequest: async function(tokenId, niubizconfiguration, data, other_configuration, cardToken) {
                const options = {
                    method: 'POST',
                    headers: {
                        accept: 'application/json',
                        'content-type': 'application/json',
                        Authorization: String(this.oNiubiz.attributes.securitytoken)
                    },
                    body: JSON.stringify({
                        channel: 'web',
                        captureType: 'manual',
                        countable: true,
                        order: {
                            tokenId: tokenId,
                            purchaseNumber: niubizconfiguration.purchasenumber,
                            amount: niubizconfiguration.amount,
                            currency: other_configuration.currency,
                            // externalTransactionId: externalTransactionId,
                            installment: 0
                        }
                    })
                };

                var that = this;
                var authURL = niubizBaseAuthURL + niubizconfiguration.merchantid;
                try {
                    var authResponse = await fetch(authURL, options);
                    var authResponseJson = await authResponse.json();
                    //console.log('Authorization fetch Response: ' + JSON.stringify(authResponseJson));
                    if (authResponse.status === 400) {
                        //console.log("Pago InCorrecto status 400");
                        //console.log("Código de error: " + authResponseJson.errorCode + " - " + authResponseJson.errorMessage + '\r\nCódigo Respuesta: ' + authResponseJson.data.ACTION_CODE + ' - ' + authResponseJson.data.ACTION_DESCRIPTION);
                        this.hideLoading();
                        this.showNiubizError();
                        return authResponseJson;

                    }

                    if (authResponseJson.dataMap.ACTION_CODE !== "000") {
                        //console.log("Pago InCorrecto");
                        //console.log("Código de error: " + authResponseJson.dataMap.ACTION_CODE);
                        this.hideLoading();
                        this.showNiubizError();
                    } else {
                        this.hideLoading();
                        oClientValues_248295.Niubiz = authResponseJson;
                        payform.resetData([cardNumber]);
                        payform.resetData([cardExpiry]);
                        payform.resetData([cardCvv]);
                    }

                    return authResponseJson;

                } catch (makeAuthError) {
                    console.error('Error in makeAuthorizationRequest:', makeAuthError);
                    throw makeAuthError;
                }
            },

            sendNiubizPaymentState: function(result) {
                var that = this;

                if (result.dataMap.ACTION_CODE !== "000") {
                    //console.log ("Pago InCorrecto");
                    //console.log ("Código de error: " + result.dataMap.ACTION_CODE);
                    this.showNiubizError();
                    return true;
                }

                this.listenTo(this.oNiubiz, "change", function() {
                    if (that.oNiubiz.attributes['payment'] === 'Ok') {
                        Backbone.history.navigate('summary', {
                            trigger: true,
                            replace: true
                        });
                    } else {
                        that.showNiubizError();
                        that.hideLoading();
                    }
                });


                this.oNiubiz.executed();

                var oData = $.extend(true, {}, bkt_init_widget);
                oData.niubizresponse = result;
                oData.bktToken = oClientValues_248295.bktToken;

                oData.sLogin = (typeof oClientValues_248295.clientData.attributes.logintype !== 'undefined') ? oClientValues_248295.clientData.attributes.login : oClientValues_248295.clientData.attributes.email;

                this.oNiubiz.fetch({
                    data: oData,
                    error: (function() {
                        that.showNiubizError();
                    })
                });
            },
            getCardToken: function(transactionToken, niubizconfiguration, data, other_configuration) {
                const options = {
                    method: 'GET',
                    headers: {
                        accept: 'application/json',
                        'content-type': 'application/json',
                        Authorization: String(this.oNiubiz.attributes.securitytoken)
                    },
                };

                var cardTokenURL = niubizBaseCardTokenURL + niubizconfiguration.merchantid + '/' + transactionToken;
                fetch(cardTokenURL, options)
                    .then(responseCardToken => responseCardToken.json())
                    //.then(responseCardToken => console.log('responseCardToken: '+responseCardToken))
                    .catch(err => console.error(err));
            },
        });
        return CreditCardCapture;
    });