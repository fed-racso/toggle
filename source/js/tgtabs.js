var tgTabCount = 1;

jQuery(document).ready(function($) {
    var TgTabs = window.TgTabs || {};

    TgTabs = function(element, settings) {
        var T = this;
        $el = $(element);

        T.$el = $el;
        T.$tabs = $el;
        T.$wrap = $el.find('.tgtabs__wrap');
        T.$row = $el.find('.tgtabs__row');
        T.$tab = $el.find('.tgtab');
        T.$tabTarget = $el.find('.tgtab__target');

        T._settings = {
            activeTab: 0,
            currentRowPos: 0,
            oldEvent: null,
            numTabs: null,
            tabRowWidth: null,
            tabWidth: null,
            tabHeight: null,
            visibleTabIndex: 0,
            wrapwidth: null,
            cssTransitions: null,
            css3dTransforms: null,
            cssTransforms: null,
            prefixes: {},
            isArrowsShown: false,
            animateInit: true
        }

        T.settings = {
            ajaxUrl: null,
            // easing: 'fade',
            // easingDuration: '',
            arrowsAlwaysShown: false,
            prevArrowContents: 'Left',
            nextArrowContents: 'Right',
            tabsPerPage: null,
            tabsToSlide: 1,
            showArrows: 'show', // hide, auto 
            responsive: null,
            onAjaxDone: null,
            onBeforeChange: null,
            onAfterChange: null,
            onBeforeArrowChange: null,
            onAfterArrowChange: null,
        }

        T.settings = $.extend(true, T.settings, settings)

        if (T.settings.startingTab) {
            T._settings.visibleTabIndex = T.settings.startingTab;
        }
        if (typeof T.settings.animateInit != "undefined") {
            T._settings.animateInit = T.settings.animateInit;
        }

        T.initialize();

        return T;
    }

    TgTabs.prototype = {
        constructor: TgTabs,
        initialize: function() {
            var T = this;
            T._settings.wrapWidth = T.$wrap.width();

            this.createPreloader();
            this.getPrefixes();
            this.checkCssTransitions();
            this.buildArrows();
            this.setEventHandlers();
            this.setInitialSettings();
            this.sortResponsive();
            this.checkArrowAppearance();
            this.updateSettings();

            $(window).resize($.debounce(150, false, function() {
                T._settings.tabHeight = null;
                T.$el.find('.tgtab__targets').css('height', 'auto');
                T.checkArrowAppearance();
                T._settings.wrapWidth = T.$wrap.width();
                T.updateSettings();
                T.checkArrowStates();
            }));

            this.initializeStates();
            this.afterInit();
        },

        afterInit: function() {
            this.$el.addClass('has-loaded');
        },

        // ==========
        // buildArrows
        // ==========
        buildArrows: function() {
            var prevArrow = '<a href="#" class="tgtabs__prev">' + this.settings.prevArrowContents + '</a>';
            var nextArrow = '<a href="#" class="tgtabs__next">' + this.settings.nextArrowContents + '</a>';

            // Appends to dom
            this.$wrap.append('<div class="tgtabs__arrows"></div>');

            this.$wrap.find('.tgtabs__arrows').append(prevArrow).append(nextArrow);

            // Sets arrows to Z for easy retrieval
            this.$arrows = this.$el.find('.tgtabs__arrows');
            this.$next = this.$el.find('.tgtabs__next');
            this.$prev = this.$el.find('.tgtabs__prev');
        },

        createPreloader: function() {
            var preloaderId = 'preloader' + tgTabCount
            var preloader = '<div id="' + preloaderId + '" class="preloader"></div>'
            this.$el.append(preloader);
            // if (this.$el.find('#preloader').length) {
            this.$preloader = this.$el.find('#' + preloaderId);
            this.preloader = true;
            // this.preloader = new CanvasLoader(preloaderId);
            // this.preloader.setColor('#999999'); // default is '#000000'
            // this.preloader.setShape('spiral'); // default is 'oval'
            // this.preloader.setDiameter(160); // default is 40
            // this.preloader.setDensity(50); // default is 40
            // this.preloader.setRange(1); // default is 1.3
            // this.preloader.setSpeed(1); // default is 2
            // this.preloader.setFPS(30); // default is 24
            tgTabCount += 1;
            // }
        },

        checkCssTransitions: function() {
            if (Modernizr.csstransitions) {
                this._settings.cssTransitions = true;
                if (this._settings.animateInit) {
                    this.setCss(this.$row[0], 'transition', '0.5s ease-out');
                }
            }

            if (Modernizr.csstransforms3d) {
                this._settings.css3dTransforms = true;
            }

            if (Modernizr.csstransforms) {
                this._settings.cssTransforms = true;
            }
        },

        // ==========
        // Get Prefixes
        // ==========

        getPrefixes: function() {
            var styles = window.getComputedStyle(document.documentElement, ''),
                pre = (Array.prototype.slice
                    .call(styles)
                    .join('')
                    .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
                )[1],
                dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1];

            this._settings.prefixes = {
                dom: dom,
                lowercase: pre,
                css: '-' + pre + '-',
                js: pre[0].toUpperCase() + pre.substr(1)
            };
        },

        // ==========
        // setCss
        // ==========
        setCss: function(elem, property, value) {
            var prefix = this._settings.prefixes.js,
                prefixedProp,
                unprefixedProp;


            // Ensures first property is uppercase to set vendor prefixes    
            prefixedProp = prefix + property.charAt(0).toUpperCase() + property.slice(1);

            // Ensures first letter is lowercase to set prop w/o prefixes 
            unprefixedProp = property.charAt(0).toLowerCase() + property.slice(1)

            // Set styles
            elem.style[prefixedProp] = value;
            elem.style[unprefixedProp] = value;
        },

        // ==========
        // setEventHandlers
        // ==========
        setEventHandlers: function() {
            var T = this;
            T.hammer = new Hammer(T.$row[0]);

            T.$next.on('click', function(event) {
                event.preventDefault();
                event.message = 'next';

                if (!_.isNull(T.settings.onBeforeArrowChange)) {
                    T.settings.onBeforeArrowChange.call(T);
                }

                T.slideTabs(event);
                T.changeShownClasses();

                if (!_.isNull(T.settings.onAfterArrowChange)) {
                    T.settings.onAfterArrowChange.call(T);
                }
            });

            T.$prev.on('click', function(event) {
                event.preventDefault();
                event.message = 'prev';

                if (!_.isNull(T.settings.onBeforeArrowChange)) {
                    T.settings.onBeforeArrowChange.call(T);
                }
                T.slideTabs(event);
                T.changeShownClasses();

                if (!_.isNull(T.settings.onAfterArrowChange)) {
                    T.settings.onAfterArrowChange.call(T);
                }
            });

            T.$tabs.on('click', '.tgtab', function(event) {
                event.preventDefault();
                var index = $(this).index();
                var $tabTarget = T.$tabTarget.eq(index)
                var tabHeight;
                var ww = $(window).width();

                // Gets and sets height of tab before switching to prevent flickering.
                if (!T._settings.tabHeight && ww > 760) {
                    tabHeight = T.$tabTarget.eq(T._settings.activeTab).height()
                    T.$tabTarget.parent().css('height', tabHeight);
                    T._settings.tabHeight = tabHeight
                }


                if (!_.isNull(T.settings.onBeforeChange)) {
                    T.settings.onBeforeChange.call(T, $tabTarget);
                }

                T.ajaxLoadTabs($tabTarget, index);
                T.activateTab(index);
                T.activateTabTarget($tabTarget);

                if (!_.isNull(T.settings.onAfterChange)) {
                    T.settings.onAfterChange.call(T, $tabTarget);
                }

                T.setTabHeight();
            });

            T.$el.on('click', '.collapsible__toggle', function(event) {
                T.checkArrowAppearance();
            });

            // Adds pan,swipe event handlers
            T.hammer.on('panstart panmove panend', function(event) {

                if (T._settings.isArrowsShown) {
                    switch (event.type) {
                        case 'panstart':
                            // console.log('panstart');
                            T._settings.oldEvent = event;

                            if (T._settings.cssTransitions) {
                                T.setCss(T.$row[0], 'transition', 'none');
                            }

                            if (!_.isNull(T.settings.onBeforeArrowChange)) {
                                T.settings.onBeforeArrowChange.call(T);
                            }
                            break;

                        case 'panmove':
                            // console.log('panmove');
                            event.preventDefault;
                            T.panHandler(event);
                            break;

                        case 'panend':
                            // console.log('panend');

                            if (T._settings.cssTransitions) {
                                T.setCss(T.$row[0], 'transition', '0.5s ease-out');
                                // console.log('tgtabs.js:289');
                            }
                            T.snapToNextPage(event);
                            T.changeShownClasses();

                            T._settings.oldEvent = null;

                            if (!_.isNull(T.settings.onAfterArrowChange)) {
                                T.settings.onAfterArrowChange.call(T);
                            }
                            break;
                        default:
                            return false;
                    }
                }
            });
        },

        panHandler: function(event) {
            this.changeLeft(event.deltaX - this._settings.oldEvent.deltaX);
            this._settings.oldEvent = event;
        },

        changeLeft: function(offsetX) {
            var T = this;
            var transformValue;
            var value = this._settings.currentRowPos * -1 + offsetX;

            if (T._settings.cssTransitions) {
                if (T._settings.css3dTransforms) {
                    transformValue = 'translate3d(' + value + 'px, 0, 0)';
                } else {

                    transformValue = 'translate(' + value + 'px, 0)';
                }

                this.setCss(this.$row[0], 'transform', transformValue);

            } else {
                this.$row.animate({
                    marginleft: -rowPos
                }, 500);
            }

            this._settings.currentRowPos = -value;
            // forceRedraw(this.$row);
        },

        // ==========
        // setInitialSettings
        // ==========
        setInitialSettings: function() {
            this._settings.numTabs = this.$tab.length;
        },

        initializeStates: function() {
            this.$tab.eq(0).addClass('is-active');
            this.$tabTarget.eq(0).addClass('is-active');
        },

        // ==========
        // SortResponsive
        // ==========
        sortResponsive: function() {
            if (!_.isNull(this.settings.responsive)) {
                var sortedResponsive = _.sortBy(this.settings.responsive, function(obj) {
                    return obj.breakpoint;
                })
            }

            this.settings.responsive = sortedResponsive;
        },

        // ==========
        // checkResponsive
        // ==========
        checkResponsive: function() {
            var T = this;
            var minBreakpointObj;

            if (!_.isNull(this.settings.responsive)) {
                _.forEach(this.settings.responsive, function(obj, index) {
                    if ($(window).width() >= obj.breakpoint) {

                        _.forEach(obj, function(val, key) {
                            T.settings[key] = val;
                        });

                    }
                });
            }
        },

        // ==========
        // updateSettings
        // ==========
        updateSettings: function() {
            this.checkResponsive();
            this.setTabWidth();
            this.setTabRowWidth();
            this.resetTabHeight();
            this.snapToTab();
        },

        // ==========
        // setTabRowWidth
        // ==========
        setTabRowWidth: function() {
            var rowWidth;

            if (this._settings.tabWidth !== 'auto') {
                rowWidth = this._settings.tabWidth * this._settings.numTabs;
                this.$row.css({
                    width: '9999px'
                })
            } else {

                rowWidth = _.reduce(this.$tab.slice(0, this._settings.numTabs), function(acc, el) {
                    if (isNaN(acc)) {
                        acc = $(acc).outerWidth();
                    }
                    return acc + $(el).outerWidth();
                }, 0);

                this.$row.css({
                    width: '9999px'
                });
            }

            this._settings.rowWidth = rowWidth;
        },

        // ==========
        // setTabWidth
        // ==========
        setTabWidth: function() {

            var tabWidth;

            // Sets tabWidth either to auto or a px value 
            if (_.isNull(this.settings.tabsPerPage)) {
                tabWidth = 'auto';
            } else {
                tabWidth = Math.ceil(parseInt(this._settings.wrapWidth) / this.settings.tabsPerPage);
            }

            this.$el.find('.tgtab').css({
                width: tabWidth,
            });

            this._settings.tabWidth = tabWidth;
        },

        resetTabHeight: function() {
            // this.$tabTarget.parent().css('height', 'auto');
        },

        setTabHeight: function() {
            // var T = this;
            // var targetIndex = this._settings.activeTab;
            // imagesLoaded(T.$tabTarget.eq(targetIndex), function() {
            // var tabHeight = T.$tabTarget.eq(targetIndex).children().height();
            // console.log(tabHeight);
            // T.$tabTarget.parent().css('height', 'auto');
            // })
        },

        // ==========
        // activateTab
        // ==========
        activateTab: function(index) {
            var $clickedTab = this.$tab.eq(index);

            this.$tab.removeClass('is-active');
            $clickedTab.addClass('is-active');

            this._settings.activeTab = index;
        },

        // ==========
        // activateTabTarget
        // ==========
        activateTabTarget: function($tabTarget) {
            this.$tabTarget.removeClass('is-active');
            $tabTarget.addClass('is-active');
        },


        /**
         * ajaxLoadTabs
         */
        ajaxLoadTabs: function($tabTarget, index) {
            var T = this;
            var ajaxUrl = $tabTarget.attr('data-ajax-url');
            var ajaxLoaded = $tabTarget.attr('ajax-loaded') || null;

            // Proceeds only if there is no Ajax url, and if ajax is not already loaded. 
            if (!ajaxUrl || ajaxLoaded) {
                return false;
            }

            if (this.preloader) {
                // this.preloader.show();
                this.$preloader.addClass('is-loading')
            }

            // Ajax GET request
            this.xhr = $.ajax({
                    url: ajaxUrl,
                    dataType: 'html',
                    beforeSend: function(xhr) {
                        $tabTarget.attr('ajax-loaded', 'fetching');
                    }
                })
                .done(function(data) {
                    // Appends megamenu and calls the respective megamenu item to activate 
                    $tabTarget.append(data);

                    if (!_.isNull(T.settings.onAjaxDone)) {
                        // console.log("tgtabs.js:598");
                        T.settings.onAjaxDone.call(T, $tabTarget);
                    }
                    // Set Ajax loaded
                    $tabTarget.attr('ajax-loaded', true);
                    if (T.preloader) {
                        // T.preloader.hide();
                        T.$preloader.removeClass('is-loading')
                    }

                    //$('.megaslider').sliders(phoenixVars.megaSliderConfigurations); This is duplicating the wrapper cutting the   width
                })
                .fail(function(err) {
                    console.log("Error", err.statusText);
                });
        },

        // ==========
        // slideTabs
        // -----
        // Slides tabs into position
        // ==========

        slideTabs: function(event) {
            var slideTarget;

            switch (event.message) {
                case "prev":
                    slideTarget = this._settings.visibleTabIndex - this.settings.tabsToSlide;

                    if (slideTarget - this.settings.tabsToSlide < 0) {
                        slideTarget = 0;
                    }

                    break;
                case "next":

                    slideTarget = this.settings.tabsToSlide + this._settings.visibleTabIndex;
                    // console.log(slideTarget);
                    if (slideTarget + this.settings.tabsToSlide > this._settings.numTabs) {
                        slideTarget = this._settings.numTabs - this.settings.tabsToSlide;
                    }
                    // console.log(slideTarget);
                    // console.log("===========");
                    break;
                default:
                    return false;
            }

            this._settings.visibleTabIndex = slideTarget;
            this.checkArrowStates();
            this.snapToTab();
        },


        // ==========
        // snapToTab
        // ==========
        snapToTab: function() {
            var rowPos = 0;
            var prefix;
            var transformValue;

            if (this._settings.tabWidth !== 'auto') {
                rowPos = this._settings.visibleTabIndex * this._settings.tabWidth;
            } else {
                if (!_.isUndefined(this.$tab.slice(0, this._settings.visibleTabIndex)[0])) {
                    rowPos = _.reduce(this.$tab.slice(0, this._settings.visibleTabIndex), function(acc, el) {
                        if (isNaN(acc)) {
                            acc = $(acc).outerWidth();
                        }

                        return acc + $(el).outerWidth();
                    }, 0);
                }
            }

            // console.log("rowPos: "+ rowPos);

            // if no arrows, visible tab should be #0
            if (!this._settings.isArrowsShown) {
                rowPos = 0;
                visibleTabIndex = 0;
            }

            if (this._settings.cssTransitions) {
                if (this._settings.css3dTransforms) {
                    transformValue = 'translate3d(' + -rowPos + 'px, 0, 0)';
                } else {
                    transformValue = 'translate(' + -rowPos + 'px, 0)';
                }

                this.setCss(this.$row[0], 'transform', transformValue);

            } else {
                this.$row.animate({
                    marginleft: -rowPos
                }, 500);
            }

            this._settings.currentRowPos = rowPos;
        },

        // ==========
        // snapToNextPage
        // ==========
        snapToNextPage: function(event) {
            var direction = event.direction;
            switch (direction) {
                case 2:
                    this._settings.visibleTabIndex = this._settings.visibleTabIndex + this.settings.tabsToSlide;

                    if (this._settings.visibleTabIndex + this.settings.tabsToSlide - 1 > this._settings.numTabs) {
                        this._settings.visibleTabIndex = this._settings.numTabs - this.settings.tabsToSlide;
                    }
                    break;

                case 4:
                    this._settings.visibleTabIndex = this._settings.visibleTabIndex - this.settings.tabsToSlide;

                    if (this._settings.visibleTabIndex < 0) {
                        this._settings.visibleTabIndex = 0
                    }
                    break;

                default:
                    return false
            }
            this.checkArrowStates();
            this.snapToTab();
        },

        // ==========
        // checkArrowAppearance
        // ==========
        checkArrowAppearance: function() {
            var wrapWidth = this.$wrap.width();
            var collapsible = this.$el.hasClass('collapsible') ? true : false;

            var totalWidth

            // Checks if settings has always shown set to true 
            if (!this.settings.arrowsAlwaysShown) {
                if (this._settings.tabWidth !== 'auto' && this._settings.tabWidth !== null) {
                    totalWidth = this._settings.visibleTabIndex * this._settings.tabWidth;
                } else {
                    if (!_.isUndefined(this.$tab.slice(0, this._settings.numTabs)[0])) {
                        totalWidth = _.reduce(this.$tab.slice(0, this._settings.numTabs), function(acc, el) {
                            if (isNaN(acc)) {
                                acc = $(acc).outerWidth();
                            }
                            return acc + $(el).outerWidth();
                        });
                    }
                }

                if (wrapWidth < totalWidth) {
                    this._settings.isArrowsShown = true;
                    this.$el.find('.tgtabs__arrows').show();
                    this.$wrap.css({
                        paddingLeft: 41 + 'px',
                        paddingRight: 41 + 'px'
                    });

                    // Checks if tab arrows are under collapsible element. If yes, react accordingly. 
                    if (collapsible) {
                        if (this.$el.hasClass('is-collapsed')) {
                            this.$arrows.hide();
                        } else {
                            this.$arrows.show();
                        }
                    }
                } else {
                    this._settings.isArrowsShown = false;
                    this.$el.find('.tgtabs__arrows').hide();
                    this.$wrap.css('padding', 0);
                }
            } else {
                this._settings.isArrowsShown = true;
            }
        },

        // Check arrow states
        // ------------------
        checkArrowStates: function() {
            if (this._settings.isArrowsShown === true) {
                if (this._settings.visibleTabIndex === 0) {
                    this.$prev.hide();
                } else {
                    this.$prev.show();
                }

                if (this._settings.visibleTabIndex >= this._settings.numTabs - this.settings.tabsToSlide) {
                    this.$next.hide();
                } else {
                    this.$next.show();
                }
            }
        },

        // shownClasses
        // ------------
        // Change classes for visible items for EPG
        changeShownClasses: function() {
            var firstItem = this._settings.visibleTabIndex,
                lastItem,
                $shownItems;
            if (!_.isNull(this.settings.tabsPerPage)) {
                lastItem = firstItem + this.settings.tabsPerPage,
                    $shownItems = this.$tab.slice(firstItem, lastItem);

                this.$tab.removeClass('is-shown');
                $shownItems.addClass('is-shown');
            }
        }
    }
    $.fn.tgtabs = function(settings) {
        var T = this;
        return T.each(function(index, el) {
            el.tgtabs = new TgTabs(el, settings);
        });
    }

    // **** tgtabs in watch live ****

    // function handleTabs() {
    //     var tgtabs__row = $("#tg-channel-detail-sidebar .tgtabs__row");
    //     if (tgtabs__row.length) {
    //         var tabs = tgtabs__row[0].querySelectorAll(".tgtab");
    //         var row_width = tgtabs__row[0].clientWidth;
    //         var tabs_width = 0;

    //         for (var i = 0; i < tabs.length; i++) {
    //             tabs_width += tabs[i].clientWidth;
    //         }
    //     }

    //     if (tabs_width > row_width) {
    //         tgtabs__row.slick({
    //             slidesToShow: 2
    //         });
    //     } else {
    //         if (tgtabs__row.hasClass('slick-initialized')) {
    //             tgtabs__row.slick("unslick");
    //         }
    //     }
    // }

    // handleTabs();
    // $(window).resize($.debounce(150, false, function() {
    //     handleTabs();
    // }));


});
