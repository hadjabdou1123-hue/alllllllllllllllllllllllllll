define(['jquery', 'underscore', 'backbone', 'widgets/utils'],
    function($, _, Backbone, Utils) {
        var CreditCard = Backbone.Model.extend({
            url: Utils.get_server_url(),
            initialize: function() {
                this.url += "creditcardcapture/";
            },
            sync: function(method, model, options) {
                options.dataType = "jsonp";
                return Backbone.sync(method, model, options);
            },
            parse: function(response) {
                if (typeof response.Exception !== 'undefined') {
                    return response.Exception;
                } else {
                    return response.CreditCard;
                }
            },
            getEmptyFields: function(attrs, options) {
                //            var someFields = ['#idInpHolderName', '#idInpCreditCard', '#idInpExpiryMonth', '#idInpExpiryYear', '#idInpCvc'];
                var someFields = ['#idInpHolderName'];
                var someResult = [];
                for (var i = 0; i < someFields.length; i++) {
                    if ($(someFields[i]).val().trim().length === 0) {
                        someResult.push(someFields[i]);
                    }
                }

                return someResult;
            }


        });
        return CreditCard;
    });