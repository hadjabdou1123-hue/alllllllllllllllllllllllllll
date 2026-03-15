define(['jquery', 'underscore', 'backbone', 'widgets/default/models/client', 'widgets/utils', 'widgets/default/views/signin'],
    function($, _, Backbone, Client, Utils, SignInContainer) {
        var SignedInContainer = SignInContainer.extend({
            render: function() {
                SignedInContainer.__super__.render();
                this.removeElements();

                this.manageShowAttachFile();

                if (typeof oClientValues_248295.waitingListData !== "undefined") {
                    $('#idBktDefaultSignInConfirmButton').click();
                }
            },
            manageShowAttachFile: function() {
                if ($("#idIptBktSignedInAttachFile").length > 0) {
                    $('#idBktDefaultSignInContainer #idBktDefaultSignedInAttachFileContainer').show();
                    $('#idBktDefaultSignInContainer #idIptBktSignedInAttachFile').val('');

                    $('#idBktDefaultSignInContainer #idIptBktSignedInAttachFile').removeClass('clsDivBktDefaultInputError');
                    $('#idDivBktFieldErrorattach').hide();
                }
            },
            removeElements: function() {
                $('#idBktDefaultSignInContainer .clsDivBktSubHeaderExtra').hide();
                $('#idBktDefaultSignInContainer #idBktDefaultSignInClientFields').hide();
                $('#idBktDefaultSignInContainer #idBktDefaultSignInRecoveryPasswordContainer').hide();
            },
            getFieldsData: function() {
                this.client = new Client({
                    EventFields: this.signin_fields.EventFields
                });
                var clientFormData = {};

                var that = this;

                _.each(this.signin_fields.EventFields, function(field) {
                    clientFormData[field.input_text] = that.getInputValue(field);
                });

                if ($("#idIptBktSignInvoucher").is(':visible')) {
                    clientFormData['voucher'] = $.trim($("#idIptBktSignInvoucher").val());
                }

                clientFormData['comments'] = this.$('#idTxaSignInUserComments').val();

                if (typeof oClientValues_248295.widgetcustom !== 'undefined') {
                    for (var i = 0; i < oClientValues_248295.widgetcustom.length; i++) {
                        if (oClientValues_248295.widgetcustom[i].hasOwnProperty('custom_field')) {
                            if (typeof bkt_init_widget.fields !== 'undefined' && typeof bkt_init_widget.fields[oClientValues_248295.widgetcustom[i].custom_field] !== 'undefined') {
                                clientFormData[oClientValues_248295.widgetcustom[i].custom_field] = bkt_init_widget.fields[oClientValues_248295.widgetcustom[i].custom_field];
                            }
                        }
                    }
                }

                return clientFormData;
            },
            getFieldsErrorsData: function(p_clientFormData) {
                var someErrors = this.client.validate(p_clientFormData, {
                    screen: 'signedin'
                });

                var someFileErrors = this.getFileErrorsData();

                if (someFileErrors.length > 0) {
                    if (someErrors && someErrors.length > 0) {
                        someErrors = someErrors.concat(someFileErrors);
                    } else {
                        someErrors = someFileErrors;
                    }
                }

                return someErrors;
            },
            getFileErrorsData: function() {
                if ($("#idIptBktSignedInAttachFile").is(':visible') === false) {
                    return [];
                }

                var file = $('#idFormSignInAttachFile :input[type="file"]')[0].files[0];
                if (typeof file === 'undefined') {
                    return [];
                }

                var someErrors = [];

                //            var validImageTypes = ["image/gif", "image/jpeg", "image/png"];
                var validImageTypes = ["application/pdf"];
                var maxFileSize = 3 * 1024 * 1024;

                if ($.inArray(file.type, validImageTypes) < 0) {
                    //                someErrors.push({message: textLogin[bkt_init_widget.lang], field: 'file'});
                    someErrors.push({
                        message: 'no valid type',
                        field: 'attach'
                    });
                }

                if (file.size > maxFileSize) {
                    someErrors.push({
                        message: 'no valid size',
                        field: 'attach'
                    });
                }

                return someErrors;
            },
            fetchData: function() {
                var that = this;

                var data = $.extend(true, {}, bkt_init_widget);
                data.services = Utils.obtainObjectsIds(oClientValues_248295.selectedServices);
                data.agendas = Utils.obtainObjectsIds(oClientValues_248295.selectedAgendas);
                data.date = oClientValues_248295.selectedDate;
                data.time = oClientValues_248295.selectedTime;

                if (typeof oClientValues_248295.signedInData !== "undefined") {
                    data.signedin = oClientValues_248295.signedInData.signedin;
                }

                if (typeof oClientValues_248295.bktToken !== "undefined") {
                    data.bktToken = oClientValues_248295.bktToken;
                }

                data.selectedPeople = oClientValues_248295.selectedPeople;

                _.each(this.client.attributes, function(value, key) {
                    data[key] = encodeURIComponent(value);
                });

                if (typeof oClientValues_248295.waitingListData !== "undefined") {
                    data.waitinglist = oClientValues_248295.waitingListData;
                }

                if (typeof oClientValues_248295.selectedExtras !== 'undefined') {
                    data.extras = Utils.obtainExtrasIds(oClientValues_248295.selectedExtras);
                }

                if ($('#idDivReCaptchaSignIn').length) {
                    data.gct = grecaptcha.getResponse(widgetBktReCaptchaSignIn);
                }

                if ($('#idDivHCaptchaSignIn').length) {
                    data.gct = hcaptcha.getResponse(widgetBktHCaptchaSignIn);
                }

                if ($('#idDivCfCaptchaSignIn').length) {
                    data.gct = document.querySelector('#idDivBktSignInContainer input[name="cf-turnstile-response"]') ? .value;
                }

                this.client.url = Utils.get_server_url() + "signedin/";

                this.client.fetch({
                    data: data,
                    error: (function() {
                        that.showLoadDataError();
                    })
                });
            },
            doAttach: function() {
                if ($("#idIptBktSignedInAttachFile").is(':visible') === false) {
                    return true;
                }

                var file = $('#idFormSignInAttachFile :input[type="file"]')[0].files[0];
                if (typeof file === 'undefined') {
                    return true;
                }

                var formData = new FormData();
                formData.append('file', file, file.name);
                formData.append('token', oClientValues_248295.bktToken);

                var attached = false;

                $.ajax({
                    url: $('#idFormSignInAttachFile').attr('data-submit'),
                    data: formData,
                    async: false,
                    type: "post",
                    dataType: 'json',
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function(data) {
                        var ad = 1;
                        attached = true;
                    },
                    error: function(data) {
                        var ad = 1;
                        attached = false;
                    },
                    complete: function(data) {
                        var ad = 1;
                    },
                    beforeSend: function() {
                        var ad = 1;
                    }
                });

                return attached;
            }
        });

        return SignedInContainer;
    });