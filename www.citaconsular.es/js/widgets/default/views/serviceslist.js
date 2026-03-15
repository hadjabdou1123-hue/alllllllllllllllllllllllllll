define(['jquery', 'underscore', 'backbone', 'widgets/default/collections/services', 'widgets/default/views/extraservices'],
    function($, _, Backbone, Services, ExtraServices) {
        var ServicesList = Backbone.View.extend({
            el: $("#idListServices"),
            template: _.template($("#idTemSelectServices").html()),
            loaded: true,
            events: {
                //            'click input[type="checkbox"]': 'refreshServices',
                //            'click .clsBktServiceDataContainer': 'serviceClicked'
                'click a.clsBktServiceHasExtraService': 'showExtraServices'
            },
            initialize: function(options) {
                this.parentView = options.parentView;
                this.identifier = new Date().getTime();
                this.extraservices = new ExtraServices();
            },
            start: function() {
                this.showLoading();
                this.loadServices();
            },
            loadServices: function() {
                this.$el.empty();

                this.services = new Services();
                var that = this;

                this.listenTo(this.services, "reset", function() {
                    if (typeof oClientValues_248295.someAllowAppointment !== 'undefined' && oClientValues_248295.someAllowAppointment === false) {
                        this.hideLoading();

                        return true;
                    }

                    this.filterVisibleServices(that.services.models);

                    $('#idListServices input[type="checkbox"]').click(function(event) {
                        that.refreshServices(event);
                    });

                    $('#idListServices .clsBktServiceDataContainer').click(function(event) {
                        that.serviceClicked(event);
                    });

                    $('#idListServices a').click(function(event) {
                        if ($(this).hasClass('clsBktServiceDisabled')) {
                            event.preventDefault();
                        }
                    });
                });

                this.services.fetch({
                    data: bkt_init_widget,
                    error: (function() {
                        that.showLoadDataError();
                    })
                });
            },
            filterVisibleServices: function(p_someServices) {
                oClientValues_248295.someServices = [];

                if (typeof bkt_init_widget.services !== 'undefined') {
                    var iIndexOf = bkt_init_widget.services.indexOf('1');
                    if (iIndexOf > -1) {
                        bkt_init_widget.services.splice(iIndexOf, 1);
                    }
                }

                for (var i = 0; i < p_someServices.length; i++) {
                    var bVisibleService = ((typeof bkt_init_widget.services === 'undefined' || bkt_init_widget.services.length === 0) ||
                        (bkt_init_widget.services.length > 0 && bkt_init_widget.services.indexOf(p_someServices[i].attributes.id) > -1)) ? true : false;

                    if (bVisibleService) {
                        oClientValues_248295.someServices.push(p_someServices[i]);
                    }
                }

                this.doRender();
            },
            doRender: function() {
                var bHasExtraService = (typeof oClientValues_248295.someExtraServices !== 'undefined' && $.isEmptyObject(oClientValues_248295.someExtraServices) === false) ? true : false;

                if (this.checkEmptyServices() === true) {
                    this.showLoadDataError();
                } else if (bHasExtraService) {
                    oClientValues_248295.backToServices = true;
                    this.render();
                } else if (this.checkSetSelected() === true) {
                    oClientValues_248295.backToServices = false;
                } else {
                    oClientValues_248295.backToServices = true;
                    this.render();
                }
            },
            render: function() {
                var bShowDescription = false;

                for (var j = 0; j < oClientValues_248295.someServices.length; j++) {
                    if (oClientValues_248295.someServices[j].attributes.description !== null && oClientValues_248295.someServices[j].attributes.description.length > 0) {
                        bShowDescription = true;
                    }
                }

                var iLastGroup = 0;

                for (var i = 0; i < oClientValues_248295.someServices.length; i++) {
                    if (oClientValues_248295.someServices[i].attributes.name == "<span style='display:none;'></span>") {
                        continue;
                    }

                    var showGroup = false;
                    var bHasExtraService = false;

                    if (oClientValues_248295.someServices[i].attributes.groups_id && oClientValues_248295.someServices[i].attributes.groups_id !== iLastGroup) {
                        iLastGroup = oClientValues_248295.someServices[i].attributes.groups_id;
                        showGroup = true;
                    }

                    if (typeof oClientValues_248295.someExtraServices[oClientValues_248295.someServices[i].attributes.id] !== 'undefined') {
                        bHasExtraService = true;
                    }

                    var parameters = {
                        attributes: oClientValues_248295.someServices[i].attributes,
                        showGroup: showGroup
                    };

                    //                parameters.attributes.price = parseFloat(String(parameters.attributes.price)).toFixed(2).replace(".", ",");

                    //                if(bkt_init_widget.publickey !== '2b4d94343aa76c8e69dc809dde73ed1be'){
                    //                    parameters.attributes.price_no_prepay = parseFloat(String(parameters.attributes.price_no_prepay)).toFixed(2).replace(".", ",");
                    //                }

                    //                if(parameters.attributes.min_price !== null){
                    //                    parameters.attributes.min_price = parseFloat(String(parameters.attributes.min_price)).toFixed(2).replace(".", ",");
                    //                }

                    parameters.attributes.show_description_class = (bShowDescription) ? 'clsBktServiceHasDescription' : '';
                    parameters.attributes.show_extraservice_class = (bHasExtraService) ? 'clsBktServiceHasExtraService' : '';

                    this.$el.append(this.template(parameters));
                }

                this.setAccordionServiceGroup();

                this.hideLoading();
            },
            showLoadDataError: function() {
                oClientValues_248295.someServices = [];
                this.loaded = false;

                $(".clsBktDefaultWindow").hide();
                $("#idBktDefaultServicesContent").hide();
                $("#idBktDefaultServicesErrorContainer").show();

                $(".clsDivBktWidgetDefaultLoadingContainer").remove();
                this.parentView.$el.show();
            },
            showLoading: function() {
                $('#idBktWidgetDefaultBodyContainer').prepend('<div class="clsDivBktWidgetDefaultLoadingContainer clsDivBktLoadingContainer' + this.identifier + '"><div class="clsDivBktWidgetDefaultLoading"></div></div>');
            },
            hideLoading: function() {
                $('.clsDivBktLoadingContainer' + this.identifier).remove();
            },
            checkSetSelected: function() {
                var someServices = [];

                if (this.checkOneService() === true) {
                    someServices = [this.services.models[0].attributes.id];
                } else if (typeof bkt_init_widget.services !== 'undefined' && bkt_init_widget.services.length === 1) {
                    someServices = bkt_init_widget.services;
                } else if (typeof oClientValues_248295.widgetconfiguration.widget_restaurant !== 'undefined') {
                    someServices = [this.services.models[0].attributes.id];
                }
                //            else if(typeof oClientValues_248295.widgetconfiguration.skip_services !== 'undefined'){
                //                someServices = [this.services.models[0].attributes.id];
                //            }

                if (someServices.length > 0) {
                    return this.parentView.setSelected(someServices);
                }

                return false;
            },
            checkEmptyServices: function() {
                if (this.services.models.length <= 0) {
                    return true;
                }

                if (typeof this.services.models[0].attributes.errors !== 'undefined') {
                    return true;
                }

                if (oClientValues_248295.someServices.length <= 0) {
                    return true;
                }

                return false;
            },
            checkOneService: function() {
                if (this.services.models.length === 1) {
                    if (parseInt(this.services.models[0].attributes.multiservice) === 0) {
                        return true;
                    } else if (parseInt(this.services.models[0].attributes.multiservice) !== 0 && parseInt(this.services.models[0].attributes.multiservice_number) === 1) {
                        return true;
                    }
                }
            },
            refreshServices: function(event) {
                this.showLoading();

                if ($(event.target).parent().parent().hasClass('clsBktServiceAttMultiservice-2')) {
                    if ($(event.target).is(':checked')) {
                        //                    $('.clsBktServiceAttMultiservice-2').hide();
                        //                    $(event.target).parent().parent().show();
                        $('.clsBktServiceAttMultiservice-2').addClass('clsBktMultiserviceServiceHide');
                        $(event.target).parent().parent().removeClass('clsBktMultiserviceServiceHide');
                    } else {
                        //                    $('.clsBktServiceAttMultiservice-2').show();
                        $('.clsBktServiceAttMultiservice-2').removeClass('clsBktMultiserviceServiceHide');
                    }
                }

                var someCheckedServices = [];

                $('#idListServices input:checked').each(function() {
                    someCheckedServices.push($(this).val());
                });

                var someOthersServices = [];

                $.each(oClientValues_248295.someAgendaServices, function(key, value) {
                    var bGroup = true;

                    for (var i = 0; i < someCheckedServices.length; i++) {
                        if (oClientValues_248295.someAgendaServices[key].indexOf(someCheckedServices[i]) === -1) {
                            bGroup = false;
                            break;
                        }
                    }

                    if (bGroup === true) {
                        for (var j = 0; j < oClientValues_248295.someAgendaServices[key].length; j++) {
                            if (someOthersServices.indexOf(oClientValues_248295.someAgendaServices[key][j]) === -1) {
                                someOthersServices.push(oClientValues_248295.someAgendaServices[key][j]);
                            }
                        }
                    }
                });

                //            if($('#idSelNumberOfPeople').is(':visible') && $("#idSelNumberOfPeople").length > 0){
                //                this.parentView.people.select_people.showOrHideServices();
                //            }    

                if ($('.clsBktServiceCheckbox input[type="checkbox"]:checked').length > 0) {
                    //                $('.clsBktServiceDataContainer').hide();
                    $('.clsBktServiceDataContainer').addClass('clsBktMultiserviceServiceHide');

                    for (var k = 0; k < someOthersServices.length; k++) {
                        //                    $('#idCheckBox'+someOthersServices[k]).closest('.clsBktServiceDataContainer').show();
                        $('#idCheckBox' + someOthersServices[k]).closest('.clsBktServiceDataContainer').removeClass('clsBktMultiserviceServiceHide');
                    }
                } else {
                    //                $('.clsBktServiceDataContainer').show();
                    $('.clsBktServiceDataContainer').removeClass('clsBktMultiserviceServiceHide');
                }

                this.showOrHideGroupsNames();

                this.hideLoading();
            },
            showOrHideGroupsNames: function() {
                $('div.clsBktServiceGroupName').each(function() {
                    var serviceGroupNameContainer = this;
                    //                var classes = this.className.split(' ');
                    var group = $(this).attr('data-service-group');

                    var bHideGroup = true;

                    $('.clsBktServiceAttParentGroup-' + group).each(function() {
                        if ($(this).hasClass('clsBktMultiserviceServiceHide')) {
                            return;
                        }

                        bHideGroup = false;

                        return false;
                    });

                    $(serviceGroupNameContainer).show();

                    if (bHideGroup) {
                        $(serviceGroupNameContainer).hide();
                    }

                    //                $(classes).each(function(){
                    //                    if(this.match('^clsBktServiceAttGroup-')){
                    //                        var sGroup = this.replace('clsBktServiceAttGroup-', '');
                    //                    
                    //                        var iVisibleGroupServices = parseInt($('div.clsBktServiceAttParentGroup-' + sGroup + ':visible').length);
                    //                        
                    //                        if(iVisibleGroupServices <= 0){
                    //                            $(serviceGroupNameContainer).hide();
                    //                        }
                    //                        else{
                    //                            $(serviceGroupNameContainer).show();
                    //                        }
                    //                    }
                    //                });    
                });
            },
            serviceClicked: function(event) {
                var widgetTemplate = parseInt($('#idBktWidgetDefaultBodyContainer').attr('data-template'));

                if (widgetTemplate !== 1) {
                    return false;
                }

                if ($(event.target).hasClass('clsBktServiceHasDescription') === true) {
                    return false;
                }

                if ($(event.target).hasClass('clsBktServiceDataContainer') === true && $(event.target).parent().hasClass('clsBktServiceHasDescription') === false) {
                    $(event.target).find('a')[0].click();

                    return true;
                }

                if ($(event.target).hasClass('clsBktServiceName') === true && $(event.target).parent().hasClass('clsBktServiceHasDescription') === false) {
                    $(event.target).find('a')[0].click();

                    return true;
                }

                if ($(event.target).hasClass('clsBktServicePublicPrice') === true && $(event.target).parent().hasClass('clsBktServiceHasDescription') === false) {
                    $(event.target).parent().find('a')[0].click();

                    return true;
                }

                return true;
            },
            setAccordionServiceGroup: function() {
                if (typeof oClientValues_248295.widgetconfiguration.min_service_to_enable_dropdown === 'undefined') {
                    return true;
                }
                if (parseInt(oClientValues_248295.widgetconfiguration.min_service_to_enable_dropdown) <= 0) {
                    return true;
                }

                var iMaxGroupService = 0;

                $('.clsBktServiceGroupName').each(function() {
                    var sGroup = $('.clsBktServiceGroupName').attr('data-service-group');

                    var iCountGroupService = $('.clsBktServiceAttParentGroup-' + sGroup).length;

                    if (iCountGroupService > iMaxGroupService) {
                        iMaxGroupService = iCountGroupService;
                    }
                });

                if (iMaxGroupService < oClientValues_248295.widgetconfiguration.min_service_to_enable_dropdown) {
                    return true;
                }

                $('.clsBktServiceGroupName').each(function(index, element) {
                    var group = $(element).attr('data-service-group');

                    if (group === 'bkt77') {
                        return;
                    }

                    $(element).addClass('clsBktAccordionServiceGroup');

                    $(element).append('<div class="clsBktAccordionServiceGroupIcon"></div>');

                    $(element).after('<div class="clsBktAccordionServiceGroupContainer" data-service-group="' + group + '"></div>');

                    $('.clsBktServiceAttParentGroup-' + group).each(function(i, e) {
                        if ($(e).hasClass('clsBktServiceHasDescription') === true) {
                            $(e).closest('a').appendTo($('.clsBktAccordionServiceGroupContainer[data-service-group="' + group + '"]'));
                        } else {
                            $(e).appendTo($('.clsBktAccordionServiceGroupContainer[data-service-group="' + group + '"]'));
                        }
                    });

                    $('.clsBktAccordionServiceGroupContainer').hide();
                });

                $('.clsBktServiceGroupName').click(function(event) {
                    var group = $(event.target).attr('data-service-group');

                    if (group === 'bkt77') {
                        return;
                    }

                    if ($(event.target).hasClass('clsBktAccordionServiceGroupActive') === false) {
                        $(event.target).addClass('clsBktAccordionServiceGroupActive');

                        $('.clsBktAccordionServiceGroupContainer[data-service-group="' + group + '"]').show(250);
                    } else {
                        $(event.target).removeClass('clsBktAccordionServiceGroupActive');

                        $('.clsBktAccordionServiceGroupContainer[data-service-group="' + group + '"]').hide();
                    }
                });

                $('.clsBktAccordionServiceGroupIcon').click(function(event) {
                    $(event.target).closest('.clsBktServiceGroupName').click();
                });
            },
            showExtraServices: function(event) {
                event.preventDefault();

                var target = $(event.currentTarget).attr('href');
                var service = target.replace("#selectservice/", "");

                this.parentView.setSelected([service]);
                this.extraservices.start();

                return false;
            }
        });

        return ServicesList;
    });