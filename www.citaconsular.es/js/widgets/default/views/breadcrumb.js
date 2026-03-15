define(['jquery', 'underscore', 'backbone', 'widgets/utils'],
    function($, _, Backbone, Utils) {
        var BreadCrumbContainer = Backbone.View.extend({
            initialize: function() {

            },
            show: function(p_sSelector) {
                var sBreadCrumb = "";

                if (oClientValues_248295.selectedDate && (p_sSelector.indexOf('idBktDefaultSignUpContainer') >= 0 || p_sSelector.indexOf('idBktDefaultSignInContainer') >= 0 ||
                        p_sSelector.indexOf('idBktDefaultCCCStrContainer') >= 0 || p_sSelector.indexOf('idBktDefaultConfirmClientContainer') >= 0)) {
                    var sFormatDate = Utils.formatDate(oClientValues_248295.selectedDate, bkt_init_widget.lang);

                    var time = oClientValues_248295.selectedTime + "h";

                    if (typeof oClientValues_248295.widgetconfiguration.am_pm_format !== 'undefined' && oClientValues_248295.widgetconfiguration.am_pm_format === true) {
                        time = Utils.timeToAmPm(time);
                    }

                    sBreadCrumb += sFormatDate + "<span class='clsDivBreadcrumbTime'> - " + time + "</span>";

                    sBreadCrumb += " · ";
                }

                if (oClientValues_248295.selectedAgendas && oClientValues_248295.selectedAgendas.length === 1 && p_sSelector.indexOf('idBktDefaultAgendasContainer') < 0) {
                    for (var i = 0; i < oClientValues_248295.selectedAgendas.length; i++) {
                        var agendaName = oClientValues_248295.selectedAgendas[i].name.replace(/<br\s*[\/]?>/gi, "");

                        sBreadCrumb += agendaName + ", ";
                    }

                    sBreadCrumb = sBreadCrumb.substr(0, (sBreadCrumb.length - 2));

                    sBreadCrumb += " · ";
                }

                if (oClientValues_248295.selectedServices && oClientValues_248295.selectedServices.length > 0) {
                    for (var i = 0; i < oClientValues_248295.selectedServices.length; i++) {
                        var serviceName = oClientValues_248295.selectedServices[i].name.replace(/<br\s*[\/]?>/gi, "");

                        sBreadCrumb += serviceName + ", ";
                    }

                    sBreadCrumb = sBreadCrumb.substr(0, (sBreadCrumb.length - 2));
                }

                $(p_sSelector).html(sBreadCrumb);
                $(p_sSelector).attr('title', sBreadCrumb);

                if (bkt_init_widget.publickey === '23d9b76923b741cb4165cb7fadba48129') {
                    $("#idBktWidgetBody #idBktWidgetDefaultBodyContainer .clsDivSubHeaderBreadcrumbsText").hide();

                    if (oClientValues_248295.selectedServices[0].id === 'bkt291456' ||
                        oClientValues_248295.selectedServices[0].id === 'bkt277420' ||
                        oClientValues_248295.selectedServices[0].id === 'bkt348084' ||
                        oClientValues_248295.selectedServices[0].id === 'bkt414700' ||
                        oClientValues_248295.selectedServices[0].id === 'bkt351571') {
                        $("#idBktWidgetBody #idBktWidgetDefaultBodyContainer .clsDivSubHeaderBreadcrumbsText").show();
                    }
                }

            }
        });

        return BreadCrumbContainer;
    });