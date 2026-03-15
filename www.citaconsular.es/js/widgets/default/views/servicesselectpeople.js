define(['jquery', 'underscore', 'backbone'],
    function($, _, Backbone) {
        var SelectPeople = Backbone.View.extend({
            el: $("#idSelNumberOfPeople"),
            events: {
                'change': 'refreshServices'
            },
            initialize: function(options) {
                this.services = options;
                this.render();
            },
            template: _.template($("#idTemSelectPeople").html()),
            render: function() {
                //            var people = this.getOptions();                  
                var max = this.getMax();
                var min = this.getMin(max);

                $('#idSelNumberOfPeople').empty();
                $('#idSelNumberOfPeopleDatime').empty();

                //            for(var i = 0 ; i < people.length ; i++){
                //                this.$el.append(this.template(people[i]));
                //                $('#idSelNumberOfPeopleDatime').append(this.template(people[i]));
                //            }           

                for (var i = min; i <= max; i++) {
                    this.$el.append(this.template({
                        value: i,
                        people: i
                    }));
                    $('#idSelNumberOfPeopleDatime').append(this.template({
                        value: i,
                        people: i
                    }));
                }

                var iSelectedPeople = parseInt($(this.$el).val());
                oClientValues_248295.selectedPeople = iSelectedPeople;

                this.refreshServices();
            },
            getMax: function() {
                var iMax = 1;

                for (var i = 0; i < this.services.length; i++) {
                    if (this.services.models[i].get('multiservice_number') > iMax) {
                        iMax = parseInt(this.services.models[i].get('multiservice_number'));
                    }
                }

                return iMax;
            },
            getMin: function(max) {
                var iMin = max;

                for (var i = 0; i < this.services.length; i++) {
                    if (typeof this.services.models[i].get('multiservice_number_min') === 'undefined') {
                        continue;
                    }
                    //                if(parseInt(this.services.models[i].get('multiservice_number_min')) <= 0){ continue; }

                    var mnm = parseInt(this.services.models[i].get('multiservice_number_min'));

                    if (mnm === 0) {
                        mnm = 1;
                    }

                    if (mnm < iMin) {
                        iMin = mnm;
                    }
                }

                //            for(var i = 0 ; i < this.services.length ; i++){                                
                //                if(typeof this.services.models[i].get('multiservice_number_min') === 'undefined'){ continue; }
                //                if(parseInt(this.services.models[i].get('multiservice_number_min')) <= 0){ continue; }
                //                
                //                if(mnm < iMin){
                //                    iMin = mnm;
                //                }
                //            }

                return iMin;
            },
            getOptions: function() {
                this.$el.empty();
                var iMaxPeople = this.getMax();
                var somePeople = [];

                for (var i = 1; i <= iMaxPeople; i++) {
                    somePeople.push({
                        value: i,
                        people: i
                    });
                }

                return somePeople;
            },
            showOrHideServices: function() {
                var iSelectedPeople = parseInt($(this.$el).val());
                oClientValues_248295.selectedPeople = iSelectedPeople;

                $('div.clsBktServiceDataContainer').each(function() {
                    var serviceContainer = this;
                    var classes = this.className.split(' ');

                    $(classes).each(function() {
                        if (this.match('^clsBktServiceAttMultiserviceNumber-')) {
                            var iServiceMultiservice = parseInt(this.replace('clsBktServiceAttMultiserviceNumber-', ''));

                            if (iServiceMultiservice < iSelectedPeople) {
                                $(serviceContainer).hide();
                            } else {
                                $(serviceContainer).show();
                            }
                        }
                    });
                });

                $('div.clsBktServiceDataContainer').removeClass('clsBktServiceDisabled');
                $('#idListServices a').removeClass('clsBktServiceDisabled');

                $('div.clsBktServiceDataContainer').each(function() {
                    var minPeople = parseInt($(this).attr('data-min-people'));

                    if (minPeople > iSelectedPeople) {
                        $(this).addClass('clsBktServiceDisabled');

                        if ($(this).hasClass('clsBktServiceHasDescription')) {
                            $(this).closest('a').addClass('clsBktServiceDisabled');
                        } else {
                            $(this).find('a').addClass('clsBktServiceDisabled');
                        }
                    }
                });

                var iTotalAgendas = 0;

                $.each(oClientValues_248295.someAgendaServices, function(key, value) {
                    iTotalAgendas++;
                });

                if (iSelectedPeople > 1 && iTotalAgendas > 1) {
                    $('div.clsBktServiceAttMultiservice-0').hide();
                    //                $('div.clsBktServiceAttMultiservice-1').hide();

                    $('.clsBktServiceCheckbox').hide();
                } else {
                    $('.clsBktServiceCheckbox').show();
                }
            },
            showOrHideGroupsNames: function() {
                $('div.clsBktServiceGroupName').each(function() {
                    if ($('#idBktDefaultServicesContainer').is(":visible") === false) {
                        return;
                    }

                    var serviceGroupNameContainer = this;
                    var classes = this.className.split(' ');

                    var group = $(this).attr('data-service-group');
                    var collapse = null;

                    if ($(this).hasClass('clsBktAccordionServiceGroup')) {
                        collapse = $('div.clsBktAccordionServiceGroupContainer[data-service-group="' + group + '"]').is(":visible");

                        $('div.clsBktAccordionServiceGroupContainer[data-service-group="' + group + '"]').show();
                    }

                    $(classes).each(function() {
                        if (this.match('^clsBktServiceAttGroup-')) {
                            var sGroup = this.replace('clsBktServiceAttGroup-', '');

                            //                        var iVisibleGroupServices1 = parseInt($('div.clsBktServiceAttParentGroup-' + sGroup + ':visible').length);
                            //                        var bVisibleGroupServices2 = $('div.clsBktServiceAttParentGroup-' + sGroup).css('display') !== 'none';
                            var bVisibleGroupServices = $('div.clsBktServiceAttParentGroup-' + sGroup).is(":visible");

                            //                        if(iVisibleGroupServices <= 0){
                            if (bVisibleGroupServices === false) {
                                $(serviceGroupNameContainer).hide();
                            } else {
                                $(serviceGroupNameContainer).show();
                            }
                        }
                    });

                    if (collapse === false) {
                        $('div.clsBktAccordionServiceGroupContainer[data-service-group="' + group + '"]').hide();
                    }
                });
            },
            refreshServices: function() {
                $('input[type="checkbox"]').prop('checked', false);
                this.showOrHideServices();
                this.showOrHideGroupsNames();
            }
        });

        return SelectPeople;
    });