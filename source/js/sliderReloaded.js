 window.allSliders;

 jQuery(document).ready(function($) {
     // =======
     // Sliders
     // =======
     var Sliders = window.Sliders || {};
     var Slider = window.Slider || {};

     Sliders = function($els, sliderConfig) {
         var S = this;

         // settings for all megasliders
         this.globalSettings = {
             hasCssTransitions: false,
             hasCss3dTransforms: false,
             gutterWidth: 20,
             sliderWidth: 0,
         };

         // initial settings per megaslider type
         // --------------
         // gutterWidth: 0,
         // itemsToShow: null,
         // itemsToSlide: 1,
         // itemWidth: 0,
         // sliderHeight: 0,
         this.typeSettings = {};

         this.sliderConfig = sliderConfig;

         // loops through sliderConfig, add sliders that are present on page to typeSettings. 
         _.forEach(this.sliderConfig, function(index, key) {
             var $megasliderType = $(S.sliderConfig[key].targetClass).not(S.sliderConfig[key].ignoredClasses);

             if ($megasliderType.length) {
                 S.typeSettings[key] = {};
                 S.typeSettings[key].$els = $megasliderType;
                 S.typeSettings[key].config = S.sliderConfig[key];

             }
         });

         this.initialize();
         return this;
     };

     Sliders.prototype = {
         constructor: Sliders,

         // ===========================
         // Global Megaslider Functions
         // ===========================

         // Initializes Sliders
         // -------------------
         initialize: function() {
             var ww = $(window).width();
             var s = this;

             this.getPrefixes();
             this.detectFeatures();
             this.buildSliders();
             this.calculateSliderProperties(ww);
             this.updateSliderSettings(ww);

             $(window).resize($.debounce(150, false, function() {

                 // ensures ios scroll doesn't trigger resize
                 if (ww != $(window).width()) {
                     ww = $(window).width();
                     // Initialize sliders that aren't initialized.
                     s.calculateSliderProperties(ww);
                     s.updateSliderSettings(ww);
                     s.resetSliderToStart();
                 }
             }));
         },

         // Get Prefixes
         // ------------
         // Gets prefixes required for user browser
         getPrefixes: function() {
             var styles = window.getComputedStyle(document.documentElement, ''),
                 pre = (Array.prototype.slice
                     .call(styles)
                     .join('')
                     .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
                 )[1],
                 dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1];

             this.globalSettings.prefixes = {
                 dom: dom,
                 lowercase: pre,
                 css: '-' + pre + '-',
                 js: pre[0].toUpperCase() + pre.substr(1)
             };
         },

         // Detect Features
         // ---------------
         // Checks whether browser supports certain CSS features
         detectFeatures: function() {
             if (Modernizr.csstransitions) {
                 this.globalSettings.hasCssTransitions = true;
             }

             if (Modernizr.csstransforms3d) {
                 this.globalSettings.hasCss3dTransforms = true;
             }
         },

         // Build Sliders
         // -------------
         // Loops through each slider megaslider type, 
         // - builds all megasliders within
         // - gives it a reference number
         // - add it to a reference array for easy get
         buildSliders: function() {
             var S = this;
             var ref = 1;

             // Loops through each megaslider type
             _.forIn(this.typeSettings, function(val, type) {
                 // Create refArray to store slider references
                 S.typeSettings[type].refArray = [];

                 _.forEach(val.$els, function(el, key) {
                     // Creates individual slider 
                     el.slider = new Slider(el, ref, type, S.globalSettings);

                     // Pushes slider into reference array
                     S.typeSettings[type].refArray.push({
                         el: el,
                         ref: ref
                     });

                     ref = ref + 1;
                 });
             });

             this.totalSliders = ref;
         },

         // Calculate Slider Properties
         // ---------------------------
         // Loops through each megaslider type
         // - calculates the following properties 
         //    + gutterWidth 
         //    + itemsToShow
         //    + itemsToSlide
         //    + itemWidth
         //    + sliderHeight
         calculateSliderProperties: function(ww) {
             var S = this;
             _.forIn(this.typeSettings, function(val, megaSliderType) {
                 var config = val.config;
                 var innerConfig = config.config;

                 S.setItemsToShow(megaSliderType, innerConfig.numItemsToShow, ww);
                 S.setItemsToSlide(megaSliderType);
                 S.setItemWidth(megaSliderType, ww);
                 S.setItemHeight(megaSliderType, ww);
                 S.setInnerItemProps(megaSliderType, ww);
             });

         },

         // Set Items To Show
         // -----------------
         // Sets number of items to show for megaslider type at different breakpoints
         // - megaSliderType : <String>
         // - numItemsToShow : <Object> containing breakpoint and number of items to show
         // - ww             : <int> window width
         setItemsToShow: function(megaSliderType, numItemsToShow, ww) {
             var itemsToShow;

             _.forIn(numItemsToShow, function(val, key) {
                 if (ww > parseInt(key)) {
                     itemsToShow = val;
                 }
             });

             this.typeSettings[megaSliderType].itemsToShow = itemsToShow;
         },

         // Set Items To Slide
         // ------------------
         // Sets the number of items to slide 
         setItemsToSlide: function(megaSliderType) {
             this.typeSettings[megaSliderType].itemsToSlide = Math.floor(this.typeSettings[megaSliderType].itemsToShow);
         },

         // Set Item Width
         // --------------
         // Calculates item width of each megaslider type and sets it to typeSettings obj
         setItemWidth: function(megaSliderType, ww) {
             var $el = this.$el,
                 $items = this.$items,
                 $$type = this.typeSettings[megaSliderType],
                 $$slider,
                 wrapWidth,
                 itemWidth,
                 itemsToShow = $$type.itemsToShow,
                 gutterWidth = this.globalSettings.gutterWidth,
                 totalGutterWidth;

             // Gets wrapWidth and $$slider that is displayed
             if ($$type.refArray.length) {
                 for (var i = 0; i < $$type.refArray.length; i++) {
                     $$slider = $$type.refArray[i].el.slider;
                     wrapWidth = $$slider.$wrap.width();

                     if (wrapWidth > 0) {
                         break;
                     }
                 }
             }

             // If wrap width is STILL 0, means no such slider is present. 
             // In this case, remove all slider reference for this slider.

             // Calculates total width 
             totalGutterWidth = (itemsToShow - 1) * gutterWidth;

             // Calculates Item width 
             itemWidth = Math.round((wrapWidth - totalGutterWidth) / itemsToShow);

             // Sets wrap with back to typeSettings obj
             $$type.wrapWidth = wrapWidth;
             $$type.itemWidth = itemWidth;
         },

         // Set Item Height
         // ---------------
         // Sets the height for each type of megaslider
         // Calculations are hardcoded depending on the type of slider. Magic number height. 
         setItemHeight: function(megaSliderType, ww) {
             var $el = this.$el,
                 $$type = this.typeSettings[megaSliderType],
                 $$slider = $$type.refArray[0].el.slider,
                 itemWidth = $$type.itemWidth,
                 itemHeight;

             // Initialize variables to calculate height 
             var heightProps;

             switch (megaSliderType) {
                 // Standard megasliders, too many combinations. Use magic number 
                 case 'megaSlider':
                     console.log(this);
                     itemHeight = 1.02 * itemWidth;
                     break;

                 case 'megaSliderSingle':
                 case 'megaSliderIn8':
                 case 'megaSliderIn4':
                 case 'megaSlider3up':
                     var heightProps = {
                         titleLines: 2,
                         titleLineHeight: 16 * 1.25,
                         titleMargins: 16 * 0.625,
                         // metaLines: 1,
                         metaLines: 0.8,
                         metaLineHeight: 16 * 1.2,
                         // metaMargins: 16 * 0.3125 * 2,
                         metaMargins: 0,
                         imageHeight: itemWidth * 9 / 16
                     };

                     itemHeight = heightProps.titleLines * heightProps.titleLineHeight + heightProps.titleMargins + heightProps.metaLines * heightProps.metaLineHeight + heightProps.metaMargins + heightProps.imageHeight;

                     itemHeight = Math.round(itemHeight);
                     break;

                 case 'megaSliderPortrait':
                 case 'megaSlider3upPortrait':
                     var heightProps = {
                         titleLines: 2,
                         titleLineHeight: 16 * 1.25,
                         titleMargins: 16 * 0.625,
                         // metaLines: 1,
                         metaLines: 0.8,
                         metaLineHeight: 16 * 1.2,
                         // metaMargins: 16 * 0.3125 * 2,
                         metaMargins: 0,
                         imageHeight: itemWidth * 4 / 3
                     };

                     itemHeight = heightProps.titleLines * heightProps.titleLineHeight + heightProps.titleMargins + heightProps.metaLines * heightProps.metaLineHeight + heightProps.metaMargins + heightProps.imageHeight;

                     itemHeight = Math.round(itemHeight);

                     break;
                 default:
                     itemHeight = itemWidth;
             }
             // end switch

             $$type.itemHeight = itemHeight;
         },

         // Set Inner Item Props
         // --------------------
         // Calculates inner item properties for megasliders with 3 and 4 items. 
         setInnerItemProps: function(megaSliderType, ww) {
             if (megaSliderType == 'megaSlider') {
                 var $el = this.$el,
                     $$type = this.typeSettings[megaSliderType],
                     $$refArray = $$type.refArray,
                     gutterWidth = this.globalSettings.gutterWidth,
                     oneItemSample = null,
                     oneItemProp = {},
                     threeItemSample = null,
                     threeItemProp = {},
                     fourItemSample = null,
                     fourItemProp = {};

                 // get arrays to iterate over to find 3 & 4 item samples.
                 var arrays = _.chain($$refArray).pluck('el').pluck('slider').pluck('$items').flatten();

                 // Find threeItemSample and fouritemsample
                 arrays.forEach(function(jq_item) {
                     $(jq_item).each(function(index, item) {
                         if (threeItemSample == null && $(item).hasClass('megaslider__item--3')) {
                             threeItemSample = item;
                         } else if (fourItemSample == null && $(item).hasClass('megaslider__item--4')) {
                             fourItemSample = item;
                         } else if (oneItemSample == null && $(item).hasClass('megaslider__item--featured')) {
                             oneItemSample = item;
                         }

                         // Breaks loop once all 3 items are found

                         if (oneItemSample && threeItemSample && fourItemSample) {
                             return false;
                         }
                     });
                 });

                 if (oneItemSample && ww >= 760) {
                     var $oneItemSample = $(oneItemSample);
                     var $itemTitle = $oneItemSample.find('.item__title');
                     var $meta = $oneItemSample.find('.meta');
                     var $desc = $oneItemSample.find('.desc');

                     oneItemProp.imageHeight = Math.floor($$type.itemWidth * 9 / 16);

                     oneItemProp.titleLines = 2;
                     oneItemProp.titleLineHeight = Math.floor(parseInt($itemTitle.css('line-height')));
                     oneItemProp.titleHeight = oneItemProp.titleLines * oneItemProp.titleLineHeight;

                     oneItemProp.metaLines = 1;
                     oneItemProp.metaLineHeight = Math.floor(parseInt($meta.css('line-height')));

                     oneItemProp.descLines = 2;
                     oneItemProp.descLineHeight = Math.floor(parseInt($desc.css('line-height')));;
                     oneItemProp.descHeight = oneItemProp.descLines * oneItemProp.descLineHeight;

                     oneItemProp.totalMargins = Math.floor(parseInt($itemTitle.css('margin-top')) + parseInt($meta.css('margin-top')) + parseInt($meta.css('margin-bottom')));
                 }

                 if (threeItemSample && ww >= 760) {
                     threeItemProp.imageHeight = Math.floor(($$type.itemHeight - gutterWidth * 2) / 3);
                     threeItemProp.imageWidth = Math.floor(threeItemProp.imageHeight * 16 / 9);
                     threeItemProp.marginBottom = gutterWidth * 0.5;
                     threeItemProp.paddingBottom = gutterWidth * 0.5;
                     threeItemProp.itemInfoMargin = gutterWidth * 0.5 + threeItemProp.imageWidth;
                 }

                 if (fourItemSample && ww >= 760) {
                     var $fourItemSample = $(fourItemSample);
                     var $itemTitle = $fourItemSample.find('.item__title');
                     var $meta = $fourItemSample.find('.meta');
                     var $desc = $fourItemSample.find('.desc');

                     fourItemProp.titleLines = 2;
                     fourItemProp.titleHeight = Math.ceil(parseInt($itemTitle.css('font-size')) * 2.25);

                     fourItemProp.metaLines = 1;
                     fourItemProp.metaLineHeight = Math.ceil(parseInt($meta.css('line-height')));

                     fourItemProp.totalMargins = Math.floor(parseInt($itemTitle.css('margin-top')) + parseInt($meta.css('margin-bottom')) + parseInt($meta.css('margin-top')));

                     fourItemProp.itemWidth = Math.floor(($$type.itemWidth - gutterWidth / 2) / 2);
                     fourItemProp.imageHeight = Math.floor(fourItemProp.itemWidth * 9 / 16);

                     fourItemProp.innerItemHeight = fourItemProp.titleHeight + fourItemProp.metaLines * fourItemProp.metaLineHeight + fourItemProp.totalMargins +
                         fourItemProp.imageHeight;


                     fourItemProp.verticalGutter = Math.floor($$type.itemHeight - fourItemProp.innerItemHeight * 2);
                 }

                 $$type.oneItemProp = oneItemProp;
                 $$type.threeItemProp = threeItemProp;
                 $$type.fourItemProp = fourItemProp;
             }
         },

         // Update Slider Settings
         // ----------------------
         // Sends command to individual sliders and makes them update their settings to reflect changes to typeSettings.
         updateSliderSettings: function(ww) {
             var S = this;
             _.forIn(this.typeSettings, function(val, megasliderType) {
                 var config = val.config;
                 _.forEach(val.refArray, function(obj, key) {
                     obj.el.slider.updateSettings(val, ww);
                 });
             });
         },

         // Reset slider to start 
         // ------------
         // Reset slider currLeft to 0 when resize
         resetSliderToStart: function() {
             var S = this;
             _.forIn(this.typeSettings, function(val, megaSliderType) {
                 _.forEach(val.refArray, function(obj) {
                     obj.el.slider.resetSliderToStart();
                 });
             });
         }
     };

     // =================
     // Individual Slider
     // =================

     Slider = function(el, ref, type, globalSettings) {

         this.settings = {
             type: type,
             reference: ref,
             oldEvent: null,
             currentLeft: 0,
             currentIndex: 0,
             totalItems: null,
             slideLocations: [],
             hasAllShownOnMobile: false,
         };

         this.globalSettings = globalSettings;

         // Save elements for easy reference 
         this.$el = $(el);
         this.$items = this.$el.find('.megaslider__item');

         // Initializes slider 
         this.initializeSlider(ref, type);
         this.$el.addClass('has-loaded');

         return this;
     };

     Slider.prototype = {
         constructor: Slider,

         // ===================
         // Initializing Slider
         // ===================
         initializeSlider: function(ref, type) {
             var ww = $(window).width();

             // this.ref = ref;
             this.buildWrap(ref, type);
             this.buildArrows();
             this.buildMoreButton();
             this.registerClickHandlers(ww);
             this.registerSwipeHandlers(ww);
             this.setTotalItems();
         },

         // Build Wrap
         // ----------
         // Builds slider wrap + add slider reference and type
         buildWrap: function(ref, type) {
             var $el = this.$el;
             $el.children().wrapAll('<div class="slider-wrap" data-ref="' + ref + '" data-type="' + type + '"><div class="slider-row"></div></div>"');
             this.$dataType = type;
             this.$wrap = $el.find('.slider-wrap');
             this.$row = $el.find('.slider-row');

         },

         // Build Arrows
         // ------------
         // Build slider arrows + add event handlers
         buildArrows: function() {
             var s = this;
             var $el = this.$el;

             // Creates arrows 
             $el.append('<a href="#" class="slider-prev"><i class="ti-slider-prev"></i></a><a href="#" class="slider-next"><i class="ti-slider-next"></i></a> ');

             // Create quick references to arrows
             this.$prevArrow = $el.find('.slider-prev');
             this.$nextArrow = $el.find('.slider-next');
         },

         // Build More Button
         // -----------------
         // Builds load more button that shows all items on mobile megasliders. 
         buildMoreButton: function() {
             var s = this;
             var $el = s.$el;
             var itemLength = $el.find('.megaslider__item').length;
             if (itemLength > 3 && !$el.find('.tg-load-more').length) {
                 $el.append('<a href="#" class="btn tg-load-more">Show More</a>');
             }
             this.$loadMore = $el.find('.tg-load-more');
         },

         // Register Click Handlersz
         // ------------
         // Register click handlers for 
         // - prev arrow
         // - next arrow
         // - load more button
         registerClickHandlers: function() {
             var s = this;
             var $el = s.$el;
             var prefix = this.globalSettings.prefixes;
             this.$prevArrow.on('click', _.throttle(function(event) {
                 //console.log('prev arrow is clicked');
                 // var ww = $(window).width();
                 var ww = document.querySelector('.page-wrap');
                 event.preventDefault();
                 event.data = {
                     message: 'prev'
                 };

                 if (s.globalSettings.hasCssTransitions) {
                     s.setCss(s.$row[0], 'transition', '0.5s ease-out', prefix);
                 }

                 s.changeSlideOnClick(event);
                 s.checkArrowStates(ww);

                 if (s.globalSettings.hasCssTransitions) {
                     _.debounce(function() {
                         s.setCss(s.$row[0], 'transition', 'none', prefix);
                     }, 500);
                 }
             }, 500));

             this.$nextArrow.on('click', _.throttle(function(event) {
                 var ww = $(window).width();
                 event.preventDefault();
                 event.data = {
                     message: 'next'
                 };

                 if (s.globalSettings.hasCssTransitions) {
                     s.setCss(s.$row[0], 'transition', '0.5s ease-out', prefix);
                 }

                 s.changeSlideOnClick(event);
                 s.checkArrowStates(ww);

                 if (s.globalSettings.hasCssTransitions) {
                     _.debounce(function() {
                         s.setCss(s.$row[0], 'transition', 'none', prefix);
                     }, 500);
                 }
                 s.toggleShowImage(ww);
                 // forceRedraw($el);
             }, 500));

             this.$loadMore.on('click', function(event) {
                 var ww = $(window).width();
                 event.preventDefault();
                 s.settings.hasAllShownOnMobile = true;
                 s.showMoreItems(ww);
                 toggle.functions.showImage($el);
                 // remove load more button once load more is clicked
                 $(this).remove();
             });
         },

         // Register Swipe Handlers
         // -----------------------
         registerSwipeHandlers: function(ww) {
             var s = this;
             var $el = this.$el;
             var prefix = this.globalSettings.prefixes;

             this.hammer = new Hammer(this.$row[0]);
             this.hammer.get('pan').set({
                 direction: Hammer.DIRECTION_HORIZONTAL
             });

             s.hammer.on('panstart panmove panend pancancel', function(event) {


                 if ($(window).width() > 760) {
                     switch (event.type) {
                         // Panstart
                         case 'panstart':
                             s.settings.oldEvent = event;
                             s.setCss(s.$row[0], 'transition', 'none', prefix);

                             break;

                             // Panmove
                         case 'panmove':
                             s.panHandler(event);
                             break;

                             // Panend
                         case 'panend':
                             s.setCss(s.$row[0], 'transition', 'all 0.5s ease-out', prefix);

                             s.panendHandler(event);
                             s.checkArrowStates(ww);
                             s.toggleShowImage(ww);
                             s.settings.oldEvent = null;

                             break;
                         default:
                             return false;
                     }
                 }
             });
         },

         // Set Total Items
         // ---------------
         // Sets the total number of items for the slider
         setTotalItems: function() {
             this.settings.totalItems = this.$items.length;
         },

         // Set Slider Settings
         // -------------------
         // Sets common slider settings that have to change depending on browser width.
         updateSettings: function(val, ww) {
             // set Megaslider type settings into typeSettings property for easy access
             this.typeSettings = val;
             this.setSliderWidth();
             this.setItemCss(ww);
             this.setSliderHeight(ww);
             this.checkArrowStates(ww);
             this.showMoreItems(ww);

             // Resets index to 0;
             this.settings.currentIndex = 0;
             this.settings.currentLeft = 0;
             this.transformCss();
         },


         // Set Slider Width
         // ----------------
         // Calculates slider width based on the number of items
         setSliderWidth: function() {
             this.settings.sliderWidth = Math.floor(this.typeSettings.itemWidth * this.settings.totalItems);

             this.$row.css('width', this.settings.sliderWidth);
         },


         // Set Item Css
         // ------------
         // Sets CSS for each individual megaslider item
         setItemCss: function(ww) {
             var itemsToShow = this.typeSettings.itemsToShow;
             var gutterWidth = this.globalSettings.gutterWidth;
             var totalGutterWidth = (itemsToShow - 1) * gutterWidth;
             var wrapWidth = $(this.$el).width();
             var itemSum = Math.round((wrapWidth - totalGutterWidth) / itemsToShow);

             var s = this,
                 itemWidth = (itemSum > 0) ? itemSum : this.typeSettings.itemWidth,
                 itemHeight = this.typeSettings.itemHeight,
                 itemWidthWithBorders = itemWidth + 0.5 * gutterWidth,
                 posX = 0;
             this.typeSettings.itemWidth = this.typeSettings.itemWidth || itemWidth;
             this.$itemWidth = itemWidth;

             var sliderWidth = Math.floor((this.$itemWidth + totalGutterWidth) * this.settings.totalItems);
             this.$row.css('width', sliderWidth);
             // console.log(sliderWidth);

             this.settings.slideLocations = [];

             if (ww >= 760) {
                 _.forEach(this.$items, function(el, index) {
                     $(el).css({
                         position: 'absolute',
                         top: 0,
                         left: posX,
                         width: itemWidthWithBorders,
                         height: itemHeight,
                         paddingRight: gutterWidth * 0.5
                     });
                     s.settings.slideLocations.push(posX);
                     posX = posX + itemWidth + gutterWidth;
                 });
             } else {
                 this.$items.css({
                     position: 'relative',
                     left: 'auto',
                     height: 'auto',
                     width: '100%',
                     paddingRight: 0,
                 });
             }

             this.setInnerItemCss(ww);
             this.setArrowPos();
         },

         // Set Slider Height
         // -----------------
         setSliderHeight: function(ww) {
             // console.log(this.$itemWidth);
             // console.log(this.$dataType);

             var itemHeight;

             switch (this.$dataType) {
                 // Standard megasliders, too many combinations. Use magic number 
                 case 'megaSlider':
                     itemHeight = 1.02 * this.$itemWidth;
                     break;

                 case 'megaSliderSingle':
                 case 'megaSliderIn8':
                 case 'megaSliderIn4':
                 case 'megaSlider3up':
                     var heightProps = {
                         titleLines: 2,
                         titleLineHeight: 16 * 1.25,
                         titleMargins: 16 * 0.625,
                         // metaLines: 1,
                         metaLines: 0.8,
                         metaLineHeight: 16 * 1.2,
                         // metaMargins: 16 * 0.3125 * 2,
                         metaMargins: 0,
                         imageHeight: this.$itemWidth * 9 / 16
                     };

                     itemHeight = heightProps.titleLines * heightProps.titleLineHeight + heightProps.titleMargins + heightProps.metaLines * heightProps.metaLineHeight + heightProps.metaMargins + heightProps.imageHeight;

                     itemHeight = Math.round(itemHeight);
                     break;

                 case 'megaSliderPortrait':
                 case 'megaSlider3upPortrait':
                     var heightProps = {
                         titleLines: 2,
                         titleLineHeight: 16 * 1.25,
                         titleMargins: 16 * 0.625,
                         // metaLines: 1,
                         metaLines: 0.8,
                         metaLineHeight: 16 * 1.2,
                         // metaMargins: 16 * 0.3125 * 2,
                         metaMargins: 0,
                         imageHeight: this.$itemWidth * 4 / 3
                     };

                     itemHeight = heightProps.titleLines * heightProps.titleLineHeight + heightProps.titleMargins + heightProps.metaLines * heightProps.metaLineHeight + heightProps.metaMargins + heightProps.imageHeight;

                     itemHeight = Math.round(itemHeight);

                     break;
                 default:
                     itemHeight = this.$itemWidth;
             }
             // end switch

             this.sliderHeight = this.typeSettings.itemHeight;

             if (ww >= 760) {
                 this.$wrap.css('height', itemHeight);
             } else {
                 this.$wrap.css('height', 'auto');
             }
         },


         // Set Inner Item Css
         // ------------------
         // Sets inner CSS for megasliders with 3 and 4 items
         setInnerItemCss: function(ww) {
             var oneItemProp = this.typeSettings.oneItemProp;
             var threeItemProp = this.typeSettings.threeItemProp;
             var fourItemProp = this.typeSettings.fourItemProp;

             if (oneItemProp) {
                 var $oneItems = this.$items.filter('.megaslider__item--featured').find('.tg-teaser-item');

                 if (ww >= 760) {
                     // $oneItems.find('.desc').css({
                     //   height: oneItemProp.descHeight
                     // });

                     $oneItems.find('.item__title').css({
                         maxHeight: oneItemProp.titleHeight
                     });
                 } else {

                     $oneItems.find('.item__title').css({
                         maxHeight: 'none'
                     });
                 }
                 $oneItems.find('.desc').css({
                     height: 'auto'
                 });
             }

             if (threeItemProp) {
                 var $threeItems = this.$items.filter('.megaslider__item--3').find('.tg-list-item');

                 if (ww >= 760) {
                     $threeItems.css({
                         marginBottom: threeItemProp.marginBottom,
                         paddingBottom: threeItemProp.paddingBottom
                     });

                     $threeItems.filter(':last-child').css({
                         marginBottom: 0,
                         paddingBottom: 0
                     });

                     $threeItems.children('a').css({
                         height: threeItemProp.imageHeight,
                         width: threeItemProp.imageWidth
                     });

                     $threeItems.children('.item__info').css({
                         marginLeft: threeItemProp.itemInfoMargin
                     });
                 } else {
                     $threeItems.css({
                         marginBottom: 24,
                         paddingBottom: 0
                     });
                 }

             }

             if (fourItemProp) {
                 var $fourItems = this.$items.filter('.megaslider__item--4').find('.tg-teaser-item');
                 if (ww >= 760) {
                     $fourItems.css({
                         float: 'left',
                         width: fourItemProp.itemWidth,
                         height: '48%',
                         marginTop: 0,
                         marginBottom: 0,
                         position: 'relative',
                         //borderBottom:0
                     });
                     $fourItems.filter(function(index) {
                         return $(this).index() === 0 || $(this).index() === 1;
                     }).css({
                         marginTop: 0,
                         height: '49%',
                         marginBottom: '3%',
                         //borderBottom:'1px solid #d8d8d8',
                         overflow: 'initial'
                     });
                     $fourItems.filter(':odd').css('float', 'right');
                 } else {
                     $fourItems.css({
                         float: 'left',
                         width: '100%',
                         height: 'auto',
                         marginTop: 0,
                         marginBottom: 24,
                     });

                 }
             }
         },

         // Set Arrow Pos 
         // ------------
         // Sets arrow position correctly for each slider
         setArrowPos: function() {
             var arrowCss = {
                 position: 'absolute',
                 display: 'block',
                 top: '0',
                 bottom: '0',
                 height: '100%',
                 margin: 'auto'
             };

             this.$prevArrow.css(arrowCss);
             this.$nextArrow.css(arrowCss);
         },

         // ============
         // Interactions
         // ------------
         // For things that happen on click / swipe
         // ============

         // Change Slide On Click
         // ---------------------
         // Determines which slide to switch to when arrows are clicked
         changeSlideOnClick: function(event) {
             var targetIndex,
                 currentIndex = this.settings.currentIndex,
                 itemsToSlide = this.typeSettings.itemsToSlide,
                 totalItems = this.settings.totalItems,
                 lastIndex = totalItems - 1,
                 eventMessage = event.data.message;

             // Sets target index
             if (eventMessage == 'prev') {

                 targetIndex = currentIndex - itemsToSlide;

                 // Sets minimum target index to be 0
                 if (targetIndex < 0) {
                     targetIndex = 0;
                 }
             } else {

                 targetIndex = currentIndex + itemsToSlide;

                 // Sets maximum target index to make sure last item on the megaslider is never exceeded

                 if (targetIndex + itemsToSlide > lastIndex) {
                     targetIndex = totalItems - itemsToSlide;
                 }
             }

             this.settings.currentIndex = targetIndex;
             this.setSlide();
         },

         // Set Slide 
         // ---------
         // Sets slide to target index
         setSlide: function() {
             var s = this;
             var index = this.settings.currentIndex;
             var targetLeft;

             targetLeft = this.settings.slideLocations[index];

             this.settings.currentLeft = targetLeft;

             this.transformCss();
         },


         // Pan Handler
         // -----------
         panHandler: function(event) {
             var s = this;
             var delta = event.deltaX - this.settings.oldEvent.deltaX;

             this.settings.currentLeft = this.settings.currentLeft - delta;

             this.transformCss();

             s.settings.oldEvent = event;
         },

         // Panend Handler
         // ------------
         panendHandler: function(event) {
             var deltaX = event.deltaX;
             var modifier = (deltaX < 0) ? 1 : -1;
             var currLeft = this.settings.currentLeft;
             var itemsToSlide = this.typeSettings.itemsToSlide;
             var totalItems = this.settings.totalItems;
             var closestLeft = this.getClosestItem(currLeft);
             var closestSlide = this.settings.slideLocations.indexOf(closestLeft);
             var targetSlide = closestSlide;

             // Swipe left
             if (modifier === 1) {
                 if (closestLeft < currLeft) {
                     //targetSlide += modifier;
                     this.$nextArrow.trigger('click');
                 }
                 if (targetSlide >= totalItems - 1 - itemsToSlide) {
                     targetSlide = totalItems - itemsToSlide;
                 }
             }
             // Swipe right
             else {
                 if (closestLeft > currLeft) {
                     //targetSlide += modifier;
                     this.$prevArrow.trigger('click');
                 }
                 if (targetSlide < 0) {
                     targetSlide = 0;
                 }
             }

             // this.settings.currentLeft = this.settings.slideLocations[targetSlide];
             // this.settings.currentIndex = targetSlide;

             // this.transformCss();
         },

         // Show More Items
         // ------------
         // Logic to handle show more button for megaslider mobile
         showMoreItems: function(ww) {
             var s = this;
             var $allItems = this.$el.find('.tg-teaser-item, .tg-list-item, .tg-teaser-item--portrait, .tg-list-item--portrait');

             if ($allItems.length <= 3) {
                 this.$el.find('.tg-load-more').hide();
             }

             if (ww < 760) {
                 $allItems.slice(3).hide();
                 this.$loadMore.show();
             } else {
                 $allItems.show();
                 this.$loadMore.hide();
             }

             if (s.settings.hasAllShownOnMobile) {
                 $allItems.show();
                 this.$loadMore.remove();
             }
         },


         // Change To Closest
         // -----------------
         // Change to closest item after slide. 
         changeToClosest: function() {
             var currLeft = this.settings.currentLeft,
                 itemsToSlide = this.typeSettings.itemsToSlide,
                 totalItems = this.settings.totalItems;

             var closestLeft = this.getClosestItem(currLeft);

             var closestSlide = this.settings.slideLocations.indexOf(closestLeft);

             if (closestSlide < 0) {
                 closestSlide = 0;
             } else if (closestSlide >= totalItems - 1 - itemsToSlide) {
                 closestSlide = totalItems - itemsToSlide;
             }

             this.settings.currentLeft = this.settings.slideLocations[closestSlide];
             this.settings.currentIndex = closestSlide;

             this.transformCss();

         },



         // Transform Css
         // ------------- 
         // Sets amount to transform and calls set Css.

         transformCss: function() {
             var targetLeft = this.settings.currentLeft;
             var transformValue;
             var prefix = this.globalSettings.prefixes.js;
             if (this.globalSettings.hasCssTransitions) {
                 transformValue = this.globalSettings.hasCss3dTransforms ? 'translate3d(' + -targetLeft + 'px, 0,0)' : 'translate(' + -targetLeft + 'px, 0)';

                 this.setCss(this.$row[0], 'transform', transformValue, prefix);
             } else {
                 this.$row.animate({
                     left: -targetLeft
                 }, 500);
             }
         },

         // Sets CSS with Prefixes
         // ----------------------
         setCss: function(elem, property, value, prefix) {
             var s = this,
                 prefixedProp,
                 unprefixedProp;

             // Ensures first property is uppercase to set vendor prefixes    
             prefixedProp = prefix + property.charAt(0).toUpperCase() + property.slice(1);

             // Ensures first letter is lowercase to set prop w/o prefixes 
             unprefixedProp = property.charAt(0).toLowerCase() + property.slice(1);

             // Set styles
             elem.style[prefixedProp] = value;
             elem.style[unprefixedProp] = value;
         },

         // Get Closest Item
         // ----------------
         // Gets closes item relative to current left
         getClosestItem: function(target) {
             var array = this.settings.slideLocations;

             var tuples = _.map(array, function(val) {
                 return [val, Math.abs(val - target)];
             });

             return _.reduce(tuples, function(memo, val) {
                 return (memo[1] < val[1]) ? memo : val;
             }, [-1, 999])[0];
         },

         // Reset Slider To Start
         // ---------------------
         // Resets slider to index 0

         resetSliderToStart: function() {
             this.settings.currentIndex = 0;
             this.setSlide();
         },

         // Check States
         // ------------
         // Check arrow states for slider
         checkArrowStates: function(ww) {

             if (ww < 760) {
                 this.$prevArrow.hide();
                 this.$nextArrow.hide();
             } else {
                 this.$prevArrow.show();
                 this.$nextArrow.show();

                 if (this.settings.currentIndex === 0) {
                     this.$prevArrow.hide();
                 } else if (this.settings.currentIndex === this.settings.totalItems - this.typeSettings.itemsToSlide) {
                     this.$nextArrow.hide();
                 }

             }
             // endif 

             // Hides arrows if total # of items is lesser than those in view 
             if (this.settings.totalItems <= this.typeSettings.itemsToShow) {
                 this.$prevArrow.hide();
                 this.$nextArrow.hide();
             }
         },

         // Toggle Show Image
         // -----------------
         // Show images (tied with UFinity function)

         toggleShowImage: function(ww) {
             var $el = this.$el;
             var index = this.settings.currentIndex;
             var finalIndex = index + this.typeSettings.itemsToShow;
             var $onScreenItems = this.$items.slice(index, finalIndex + 1);

             toggle.functions.showImage($onScreenItems);
         },
     };

     $.fn.sliders = function(sliderConfig) {
         allSliders = new Sliders(this, sliderConfig);
     };

     $.fn.updateSliders = function() {
         var ww = $(window).width();
         allSliders.calculateSliderProperties(ww);
         allSliders.updateSliderSettings(ww);
     };

     $.fn.initNewSlider = function() {

         var S = allSliders;
         var $el = $(this);
         // console.log(S);
         var ref = S.totalSliders;
         var type;
         var ww = $(window).width();

         // does nothing if slider already initialized
         if (this.slider) {
             return false;
         }

         // find out what type of megaslider this is. 
         switch (true) {
             case $el.hasClass('megaslider__single'):
                 type = 'megaSliderSingle';
                 break;
             case $el.hasClass('megaslider__portrait'):
                 type = 'megaSliderPortrait';
                 break;
             case $el.hasClass('megaslider__8'):
                 type = 'megaSliderIn8';
                 break;
             case $el.hasClass('megaslider__4'):
                 type = 'megaSliderIn4';
                 break;
             case $el.hasClass('megaslider__8--3up'):
                 type = 'megaSlider3up';
                 break;
             case $el.hasClass('megaslider__8--4up-portrait'):
                 type = 'megaSlider4upPortrait';
                 break;
             default:
                 type = 'megaSlider';
         }

         // Add reference back to Sliders.
         S.totalSliders = ref + 1;

         // Build wrap for Slider. 
         if (S.typeSettings[type]) {
             this.slider = new Slider(this, ref, type, S.globalSettings);
         }

         // If has typesettings, use current props to set slider
         if (!S.typeSettings[type]) {
             S.typeSettings[type] = {};
             S.typeSettings[type].$els = $el;
             S.typeSettings[type].config = S.sliderConfig[type];
             S.typeSettings[type].refArray = [];
             this.sliders(phoenixVars.megaSliderConfigurations);
         }

         // S.typeSettings[type].refArray.push(this.slider);
         S.typeSettings[type].refArray.push({
             el: this,
             ref: ref
         });

         // update slider settings

         this.slider.updateSettings(S.typeSettings[type], ww);

     };
 });

 jQuery(document).ready(function($) {
     $('.megaslider').sliders(phoenixVars.megaSliderConfigurations);
 });
