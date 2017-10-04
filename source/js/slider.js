// // THINGS LEFT 
// // 
// // 1. Swipe Interaction

// jQuery(document).ready(function($) {
//   'use strict';

//   var Slider = window.Slider || {};

//   Slider = function(element, options) {
//     var s = this;

//     s.$element = $(element);

//     s.options = {
//       gutterOutsideWidth: 20,
//       featuredItem: 'featured-item',
//       sliderItem: 'slider-item',
//       sliderRow: 'slider-row',
//       prevArrow: 'slider-prev',
//       nextArrow: 'slider-next',
//       numItemsToShow: {}
//     };

//     s.settings = {
//       currentItemIndex: 0,
//       currentDoubleRowIndex: 0,
//       currentLeft: 0,
//       cssTransitions: null,
//       css3dTransforms: null,
//       cssTransforms: null,
//       gutterWidth: 10,
//       itemsFeatured: 0,
//       itemsToShow: null,
//       itemsToSlide: 1,
//       itemWidth: 200,
//       itemFeaturedWidth: 0,
//       oldEvent: null,
//       sliderWidth: 0,
//       slideLocations: [],
//       sliderHeight: 0,
//       totalItems: null,
//       rows: 1,
//       $prevArrow: null,
//       $nextArrow: null,
//       $sliderRow: null,
//       isLegacy: false,
//       hasAllShownOnMobile: false,
//       onImageLoaded: null,
//       featuredItemCssProps: {},
//       itemCssProps: {}
//     };

//     s.options = $.extend(true, s.options, options);

//     s.initialize();

//     return s;
//   };

//   Slider.prototype.initialize = function() {
//     var s = this,
//       ww = $(window).width();

//     s.getPrefixes();
//     s.checkLegacy();
//     s.checkCssTransitions();
//     s.buildWrap();
//     s.buildArrows();
//     s.buildLoadMore(ww);
//     s.showMoreItems(ww);
//     s.initializeCSS();
//     s.setTotalItems();
//     s.updateSettings(ww);
//     s.registerEvents(ww);
//     s.checkStates(ww);
//     s.checkViewport(ww);

//     $(window).resize($.debounce(150, false, function() {
//       var ww = $(window).width();
//       s.showMoreItems(ww);
//       s.updateSettings(ww);
//     }));
//   };

//   /**
//    * Catch & updates all settings
//    * 1. gutterWidth
//    * 2. itemsToShow
//    * 3. itemsToSlide
//    * 4. itemWidth
//    * 5. sliderWidth
//    *
//    * @param  {[number]} ww [width of window]
//    */
//   Slider.prototype.updateSettings = function(ww) {
//     var s = this;
//     s.setGutterWidth(ww);
//     s.setItemsToShow(ww);
//     s.setItemsToSlide();
//     s.checkDoubleRow(ww);
//     s.setItemWidth(ww);
//     s.calcCSSProps();
//     s.setItemCSS(ww);
//     s.setSliderWidth(ww);
//     s.snapToItem();
//       s.checkStates(ww);
//       s.checkViewport(ww);
//     // console.log(this.settings);
//   };

//   // Checks if its slider is built with legacy slider code
//   Slider.prototype.checkLegacy = function() {
//     var s = this;
//     if (_.isEmpty(s.options.numItemsToShow)) {
//       s.settings.isLegacy = true;
//     }
//   }

//   // Checks if there are Css Transitions and Transforms 
//   Slider.prototype.checkCssTransitions = function() {
//     var s = this;
//     if (Modernizr.csstransitions) {
//       s.settings.cssTransitions = true;

//     }

//     if (Modernizr.csstransforms3d) {
//       s.settings.css3dTransforms = true;
//     }

//     if (Modernizr.csstransforms) {
//       s.settings.cssTransforms = true;
//     }
//   };

//   // Gets required Vendor Prefixes
//   Slider.prototype.getPrefixes = function() {
//     var s = this;
//     var styles = window.getComputedStyle(document.documentElement, ''),
//       pre = (Array.prototype.slice
//         .call(styles)
//         .join('')
//         .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
//       )[1],
//       dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1];

//     s.settings.prefixes = {
//       dom: dom,
//       lowercase: pre,
//       css: '-' + pre + '-',
//       js: pre[0].toUpperCase() + pre.substr(1)
//     };
//   };

//   /**
//    * Add slider-wrap and slider-row divs
//    */
//   Slider.prototype.buildWrap = function() {
//     var s = this;
//     var $el = s.$element;
//     $el.children().wrapAll('<div class="slider-wrap"><div class="' + s.options.sliderRow + '"></div></div>');

//     s.$sliderWrap = $el.find('.slider-wrap');
//     s.$sliderRow = $el.find('.' + s.options.sliderRow);
//   };

//   /**
//    * Add prev, next arrows and event handlers
//    */
//   Slider.prototype.buildArrows = function() {
//     var s = this;
//     var $el = s.$element;
//     // Creates arrows
//     $el.append('<a href="#" class="' + this.options.prevArrow + '"><i class="ti-slider-prev"></i></a><a href="#" class="' + this.options.nextArrow + '"><i class="ti-slider-next"></i></a>');

//     // Adds arrow to s
//     s.$prevArrow = $el.find('.' + this.options.prevArrow);
//     s.$nextArrow = $el.find('.' + this.options.nextArrow);
//   };

//   /**
//    * setArrowPos
//    */
//   Slider.prototype.setArrowPos = function() {
//     this.$element.find('.slider-prev, .slider-next').css({
//       position: 'absolute',
//       display: 'block',
//       top: '0',
//       bottom: '0',
//       height: '100%',
//       margin: 'auto',
//     })
//   };

//   /**
//    * Builds Load More button (that changes into Show all on click for megasliders)
//    * @return {[type]} [description]
//    */
//   Slider.prototype.buildLoadMore = function(ww) {
//     var s = this,
//       $el = s.$element;

//     // Exits if legacy 
//     if (s.isLegacy) {
//       return false;
//     }

//     $el.append('<a href="#" class="btn tg-load-more">Show More</a>');

//     $el.on('click', '.tg-load-more', function(event) {
//       // event.preventDefault();

//       s.settings.hasAllShownOnMobile = true;
//       var ww = $(window).width();
//       s.showMoreItems(ww);
//       //$(this).text('See All');
//       $(this).remove();
//     });
//   };

//   /**
//    * registers click, pan and swip events
//    */
//   Slider.prototype.registerEvents = function(ww) {
//     var s = this;
//     s.hammer = new Hammer(s.$sliderRow[0]);

//     // Adds click event handlers
//     s.$prevArrow.on('click', function(event) {
//       event.preventDefault();
//       event.data = {
//         message: 'prev'
//       };
//       s.changeSlide(event);
//       s.checkStates(ww);
//       forceRedraw(s.$element);
//     });

//     s.$nextArrow.on('click', function(event) {
//       event.preventDefault();
//       event.data = {
//         message: 'next'
//       };
//       s.changeSlide(event);
//       s.checkStates(ww);
//       forceRedraw(s.$element);
//     });

//     // Adds pan,swipe event handlers
//     s.hammer.on('panstart panmove panend', function(event) {
//       if ($(window).width() > 760) {

//         switch (event.type) {
//           case 'panstart':
//             console.log('panstart');
//             s.settings.oldEvent = event;

//             if (s.settings.cssTransitions) {
//               s.setCss(s.$sliderRow[0], 'transition', 'none');
//             }

//             break;

//           case 'panmove':
//             s.panHandler(event);
//             break;

//           case 'panend':
//             console.log('panend');
//             s.settings.oldEvent = null;

//             if (s.settings.cssTransitions) {
//               s.setCss(s.$sliderRow[0], 'transition', '0.5s ease-out');
//             }

//             s.snapToClosest();
//             s.checkStates(ww);
//             break;
//           default:
//             return false;
//         }
//       }

//     });

//     // s.hammer.on('swipe', function(event) {
//     //   if ($(window).width() > 760) {
//     //     console.log('swipe', event);
//     //     s.swipeHandler(event);
//     //   }
//     // })
//   };

//   Slider.prototype.initializeCSS = function() {
//     var s = this;
//     s.$element.css('position', 'relative');
//     if (s.settings.cssTransitions) {
//       s.setCss(s.$sliderRow[0], 'transition', '0.5s ease-out');
//     }
//   }

//   /**
//    * Check if there are any featured items. If there are featured items, set carousel to doublerow.
//    */
//   Slider.prototype.checkDoubleRow = function(ww) {
//     var s = this,
//       $el = s.$element;

//     var itemsFeatured = $el.find('.' + s.options.featuredItem).length;

//     if (itemsFeatured && ww > 768 || $el.hasClass('double-slider')) {
//       s.settings.rows = 2;
//       s.settings.itemsFeatured = itemsFeatured;
//     } else {
//       s.settings.rows = 1;
//     }
//   };
//   /**
//    * Sets gutter of slides
//    * 10 on mobile
//    * 15 on tablet
//    * 20 on desktop
//    *
//    * @param {number} ww [window width]
//    */
//   Slider.prototype.setGutterWidth = function(ww) {
//     var gutterWidth;

//     switch (true) {
//       case (ww >= 760):
//         gutterWidth = 20;
//         break;
//       case (ww > 480):
//         gutterWidth = 15;
//         break;
//       default:
//         gutterWidth = 10;
//     }
//     this.settings.gutterWidth = gutterWidth;
//   };

//   /**
//    * Sets the number of items shown on screen
//    * Items to Show is
//    * 1.5 on mobile
//    * 2.5 on tablet portrait
//    * 4 on tablet landscape
//    * 5 on desktop
//    * 6 on mega wide screen
//    *
//    * @param {number} ww [window width]
//    */
//   Slider.prototype.setItemsToShow = function(ww) {

//     var s = this;
//     var itemsToShow;


//     if (!s.settings.isLegacy) {
//       itemsToShow = 1;

//       _.forIn(s.options.numItemsToShow, function(value, key) {
//         if (ww > parseInt(key)) {
//           itemsToShow = value;
//           // console.log(ww, key, itemsToShow);
//         }
//       });
//     }
//     // Legacy Slider 
//     else {
//       switch (true) {

//         case ww > 1440:
//           itemsToShow = 6;
//           break;

//         case ww > 1140:
//           itemsToShow = 5;
//           break;

//         case ww > 768:
//           itemsToShow = 4;
//           break;

//         case ww > 480:
//           itemsToShow = 2.5;
//           break;

//         default:
//           itemsToShow = 2.1;
//       }
//     }

//     this.settings.itemsToShow = itemsToShow;
//   };

//   /**
//    * Set Number of Items to slide
//    */
//   Slider.prototype.setItemsToSlide = function() {
//     this.settings.itemsToSlide = Math.floor(this.settings.itemsToShow);
//   };

//   /**
//    * Set slider width
//    * @param {[number]} ww [window width]
//    */
//   Slider.prototype.setItemWidth = function(ww) {
//     var s = this;
//     var wrapWidth = s.$element.find('.slider-wrap').width();
//     var itemWidth;
//     var itemsToShow = s.settings.itemsToShow;
//     var gutterWidth = s.settings.gutterWidth;
//     var totalGutterWidth = (itemsToShow - 1) * gutterWidth;

//     // Calculates and sets item width 
//     itemWidth = Math.floor((wrapWidth - totalGutterWidth) / itemsToShow);
//     s.settings.itemWidth = itemWidth;


//     // Calculates and sets itemFeatured width
//     if (s.settings.itemsFeatured) {
//       if (ww >= 760) {
//         s.settings.itemFeaturedWidth = 2 * itemWidth + gutterWidth;
//       } else {
//         s.settings.itemFeaturedWidth = itemWidth;
//       }
//     }
//   };

//   /**
//    * Set the total number of items for the slider
//    */
//   Slider.prototype.setTotalItems = function() {
//     var s = this;
//     var $el = s.$element;
//     s.settings.totalItems = $el.find('.' + s.options.sliderItem).length;
//   };

//   /**
//    * Set the slider width
//    */
//   Slider.prototype.setSliderWidth = function() {
//     var s = this;

//     // Get 'left' property of last item in slider row, and and add itemWidth to find slider width
//     if (s.$sliderRow.find('.' + s.options.sliderItem).last().length) {
//       var lastItemLeft = s.$sliderRow.find('.' + s.options.sliderItem).last().position().left;
//     }

//     var sliderWidth = lastItemLeft + s.settings.itemWidth;

//     s.$sliderRow.css({
//       width: sliderWidth,
//     });

//     s.settings.sliderWidth = sliderWidth;
//   };

//   Slider.prototype.setArrowHeight = function(pictureHeight) {
//     var s = this;

//     if (s.settings.rows === 1) {
//       s.$prevArrow.css({
//         'height': pictureHeight,
//         'bottom': 'auto',
//       });
//       s.$nextArrow.css({
//         'height': pictureHeight,
//         'bottom': 'auto',
//       });
//     } else {
//       s.$prevArrow.css({
//         'height': 'auto',
//         'bottom': 0
//       });
//       s.$nextArrow.css({
//         'height': 'auto',
//         'bottom': 0
//       });
//     }
//   };

//   Slider.prototype.showMoreItems = function(ww) {
//     var s = this;
//     var $allItems = s.$element.find('.tg-teaser-item, .tg-list-item, .tg-teaser-item--portrait, .tg-list-item--portrait');

//     if ($allItems.length <= 3) {
//       s.$element.find('.tg-load-more').hide();
//     }

//     if (!s.settings.hasAllShownOnMobile && ww <= 760) {
//       $allItems.slice(3).hide();
//     } else {
//       $allItems.show();
//     }
//   }


//   /**
//    * Calculates and outputs item css
//    */
//   Slider.prototype.setItemCSS = function(ww) {
//     var s = this,
//       $el = s.$element,
//       $items = $el.find('.' + s.options.sliderItem),
//       $featuredItems = $el.find('.' + s.options.featuredItem),
//       $sampleNonFeaturedItem = $items.not('.' + s.options.featuredItem).first(),
//       $sampleFeaturedItem = $featuredItems.first(),
//       featuredItemWidth = s.settings.itemFeaturedWidth,
//       gutterWidth = s.settings.gutterWidth,
//       itemWidth = s.settings.itemWidth,
//       itemWidthWithBorders = itemWidth + 0.5 * gutterWidth,
//       endOfFeaturedItemsPos = 0,
//       itemHeight,
//       posX = 0,
//       posY = 0,
//       tallestMegasliderItemHeight = 0;

//     // resets slidelocations array
//     s.settings.slideLocations = [];

//     s.tgItemCss(ww);

//     itemHeight = s.settings.featuredItemCssProps.totalHeight || s.settings.itemCssProps.totalHeight;

//     var callbackCount = $items.length;
//     var getSliderHeight;
//     var setSliderHeight;
//     var sliderHeight;

//     if (!s.settings.isLegacy) {

//       // Set Item CSS
//       _.forEach($items, function(el, index) {
//         $(el).css({
//           position: 'absolute',
//           top: 0,
//           left: posX,
//           width: itemWidthWithBorders,
//           height: itemHeight,
//           paddingRight: gutterWidth * 0.5
//         })

//         // Add item to slide locations
//         s.settings.slideLocations.push(posX);

//         posX += itemWidth + gutterWidth;
//       });

//       s.$sliderRow.css('height', itemHeight);
//       s.$element.css('height', itemHeight);
//       s.settings.sliderHeight = itemHeight;
//       s.setArrowPos();
//     }
//   };

//   Slider.prototype.getClosest = function(array, target) {
//     var tuples = _.map(array, function(val) {
//       return [val, Math.abs(val - target)];
//     });

//     console.log(tuples);

//     return _.reduce(tuples, function(memo, val) {
//       return (memo[1] < val[1]) ? memo : val;
//     }, [-1, 999])[0];
//   }

//   /**
//    * Set TG Item Height and CSS
//    */
//   Slider.prototype.tgItemCss = function(ww) {
//     var s = this;
//     var $el = s.$element;
//     var $items = $el.find('.' + s.options.sliderItem);
//     var $featuredItems = $el.find('.megaslider__item--featured');
//     var itemWidth = s.settings.itemWidth;
//     var gutterWidth = s.settings.gutterWidth;
//     var sliderHeight;

//     var threeItemsImageHeight = Math.floor((s.settings.featuredItemCssProps.totalHeight - s.settings.gutterWidth * 2) / 3);
//     var threeItemsImageWidth = Math.floor(threeItemsImageHeight * 16 / 9);

//     var fourItemsWidth = Math.floor((s.settings.itemWidth - s.settings.gutterWidth / 2) / 2);
//     var fourItemsImageHeight = Math.floor(fourItemsWidth * 9 / 16);

//     if (ww >= 760) {
//       // Settings for megaslider__item--3
//       $el.find('.megaslider__item--3').find('.tg-list-item').children('a').css({
//         height: threeItemsImageHeight,
//         width: threeItemsImageWidth,

//       });
//       $el.find('.megaslider__item--3').find('.tg-list-item').css({
//         marginBottom: s.settings.gutterWidth * 0.5,
//         paddingBottom: s.settings.gutterWidth * 0.5
//       });

//       $el.find('.megaslider__item--3').find('.tg-list-item').filter(':last-child').css({
//         marginBottom: 0,
//         paddingBottom: 0
//       });

//       $el.find('.megaslider__item--3').find('.tg-list-item').children('.item__info').css({
//         marginLeft: threeItemsImageWidth + s.settings.gutterWidth / 2
//       });

//       // Settings for megslider__item--4 
//       $el.find('.megaslider__item--4').find('.tg-teaser-item').css({
//         // float: 'left', Needs to use CSS
//         width: fourItemsWidth
//       });
//       $el.find('.megaslider__item--4').find('.tg-teaser-item').filter(':odd').css({
//         marginLeft: Math.floor(s.settings.gutterWidth / 2 - 1)
//       });
//     }
//   };

//   /**
//    * Calc Featured CSS Props
//    */
//   Slider.prototype.calcCSSProps = function() {
//     var s = this;
//     var $el = this.$element;
//     var $featuredItem = $el.find('.megaslider__item--featured');
//     var $singleRowItem = $el.find('.megaslider__item--1');
//     var itemWidth = s.settings.itemWidth;

//     if ($featuredItem.length) {
//       s.settings.featuredItemCssProps = {
//         titleLines: parseFloat($featuredItem.find('.item__title').attr('data-dotdot')),
//         titleLineHeight: parseFloat($featuredItem.find('.item__title').css('line-height')),
//         titleMargins: parseFloat($featuredItem.find('.item__title').css('margin-top')),
//         metaLines: 1,
//         metaLineHeight: parseFloat($featuredItem.find('.meta').css('line-height')),
//         metaMargins: parseFloat($featuredItem.find('.meta').css('margin-top')) + parseFloat($featuredItem.find('.meta').css('margin-bottom')),
//         descLines: parseFloat($featuredItem.find('.desc').attr('data-dotdot')),
//         descLineHeight: parseFloat($featuredItem.find('.desc').css('line-height')),
//         imageHeight: itemWidth * 9 / 16
//       }

//       s.settings.featuredItemCssProps.totalHeight = Math.floor(s.settings.featuredItemCssProps.titleLines * s.settings.featuredItemCssProps.titleLineHeight + s.settings.featuredItemCssProps.titleMargins + s.settings.featuredItemCssProps.metaLines * s.settings.featuredItemCssProps.metaLineHeight + s.settings.featuredItemCssProps.metaMargins + s.settings.featuredItemCssProps.descLines * s.settings.featuredItemCssProps.descLineHeight + s.settings.featuredItemCssProps.imageHeight);
//     }

//     if ($singleRowItem.length) {
//       var $item = $singleRowItem.eq(0);
//       s.settings.itemCssProps = {
//         titleLines: parseFloat($item.find('.item__title').attr('data-dotdot')),
//         titleLineHeight: parseFloat($item.find('.item__title').css('line-height')),
//         titleMargins: parseFloat($item.find('.item__title').css('margin-top')),
//         metaLines: 1,
//         metaLineHeight: parseFloat($item.find('.meta').css('line-height')),
//         metaMargins: parseFloat($item.find('.meta').css('margin-top')),
//         imageHeight: itemWidth * 9 / 16
//       }

//       s.settings.itemCssProps.totalHeight = Math.floor(s.settings.itemCssProps.titleLines * s.settings.itemCssProps.titleLineHeight + s.settings.itemCssProps.titleMargins + s.settings.itemCssProps.metaLines * s.settings.itemCssProps.metaLineHeight + s.settings.itemCssProps.metaMargins + s.settings.itemCssProps.imageHeight);
//     }
//   };

//   /**
//    * Set Single Row CSS
//    */
//   Slider.prototype.setSingleRowCss = function(el, posX, itemWidth, itemHeight) {
//     $(el).css({
//       position: 'absolute',
//       top: 0,
//       left: posX,
//       width: itemWidth,
//       height: itemHeight,
//     });
//   };

//   /**
//    * Set DoubleRow CSS
//    */
//   Slider.prototype.setDoubleRowCss = function(el, posY, posX, itemWidth, itemHeight) {
//     $(el).css({
//       position: 'absolute',
//       top: posY,
//       left: posX,
//       width: itemWidth,
//       height: itemHeight,
//     });
//   };

//   // Hammer Events: 
//   // Direction 2 = Drag Left 
//   // Direction 4 = Drag Right 

//   Slider.prototype.panHandler = function(event) {
//     var s = this;
//     s.changeLeft(event.deltaX - s.settings.oldEvent.deltaX);
//     s.settings.oldEvent = event;
//   };

//   // Slider.prototype.swipeHandler = function(event) {
//   //   var s = this;

//   //   // Swipe Direction 
//   //   switch (event.direction) {
//   //     // Swipe left
//   //     case 2:
//   //       console.log('swipe left');
//   //       s.snapToClosest(+1);
//   //       break;

//   //       // Swipe right
//   //     case 4:
//   //       console.log('swipe right');
//   //       s.snapToClosest(-1);
//   //       break;

//   //     default:
//   //       return false;
//   //   }
//   // };

//   Slider.prototype.changeLeft = function(offsetX) {
//     var s = this;
//     var transformValue;

//     var value = s.settings.currentLeft * -1 + offsetX;

//     if (s.settings.cssTransitions) {
//       if (s.settings.css3dTransforms) {
//         transformValue = 'translate3d(' + value + 'px, 0, 0)';
//       }
//     } else {

//       transformValue = 'translate(' + value + 'px, 0)';
//     }

//     s.$sliderRow.css({
//       transform: transformValue
//     });

//     s.settings.currentLeft = -value;
//     forceRedraw(s.$element);
//   };

//   /**
//    * Changes slides when arrows are clicked on
//    * @param  {[event]} event [click event]
//    */
//   Slider.prototype.changeSlide = function(event) {

//     var s = this,
//       targetItemIndex,
//       lastItemIndex = s.settings.totalItems - 1,
//       indexChange;

//     if (s.settings.currentItemIndex === 0 && s.settings.rows === 2) {
//       indexChange = (s.settings.rows * s.settings.itemsToSlide) - (s.settings.itemsFeatured * 3);
//     } else {
//       indexChange = (s.settings.rows * s.settings.itemsToSlide);
//     }

//     switch (event.data.message) {
//       case 'prev':
//         targetItemIndex = s.settings.currentItemIndex - indexChange;
//         // if target index <=0, set target index to 0. Start of row. 
//         targetItemIndex = (targetItemIndex > 0) ? targetItemIndex : 0;
//         break;

//       case 'next':

//         targetItemIndex = s.settings.currentItemIndex + indexChange;

//         if (targetItemIndex + s.settings.rows * s.settings.itemsToSlide > lastItemIndex) {
//           targetItemIndex = lastItemIndex + 1 - s.settings.itemsToSlide * s.settings.rows;
//         }
//         break;

//       default:
//         return false;
//     }

//     s.setSlide(targetItemIndex);

//     s.settings.currentItemIndex = targetItemIndex;
//   };


//   /**
//    * [snapToClosest snaps items to the closest item]
//    * @param  {int} mod [modifier to add or reduce by 1 item]
//    */
//   Slider.prototype.snapToClosest = function(mod) {
//     var s = this;
//     mod = mod ? mod : 0;
//     var closestLeft = s.getClosest(s.settings.slideLocations, s.settings.currentLeft);


//     var closestSlide = s.settings.slideLocations.indexOf(closestLeft) + mod;

//     if (closestSlide < 0) {
//       closestSlide = 0;
//     } else if (closestSlide >= s.settings.totalItems - s.settings.itemsToShow) {
//       closestSlide = s.settings.totalItems - s.settings.itemsToShow
//     }

//     s.settings.currentItemIndex = closestSlide;

//     s.snapToItem();

//   };


//   /**
//    * Snaps to an item on resize / swipe
//    */
//   Slider.prototype.snapToItem = function() {
//     var s = this;
//     var itemIndex = s.settings.currentItemIndex;

//     s.setSlide(itemIndex);
//   };

//   Slider.prototype.setSlide = function(targetItemIndex) {
//     var s = this;
//     var prefix;
//     var transformValue;
//     var targetLeft;

//     s.settings.currentLeft = s.settings.slideLocations[targetItemIndex];

//     // Sets target 
//     targetLeft = s.settings.currentLeft;

//     if (s.settings.cssTransitions) {
//       if (s.settings.css3dTransforms) {
//         transformValue = 'translate3d(' + -s.settings.currentLeft + 'px, 0, 0)';
//       } else {
//         transformValue = 'translate(' + -s.settings.currentLeft + 'px, 0)';
//       }

//       s.setCss(s.$sliderRow[0], 'transform', transformValue);

//     } else {
//       s.$sliderRow.animate({
//         left: -s.settings.currentLeft
//       }, 500);
//     }


//   };

//   Slider.prototype.setCss = function(elem, property, value) {
//     var s = this;
//     var prefix = s.settings.prefixes.js,
//       prefixedProp,
//       unprefixedProp;

//     // Ensures first property is uppercase to set vendor prefixes    
//     prefixedProp = prefix + property.charAt(0).toUpperCase() + property.slice(1);

//     // Ensures first letter is lowercase to set prop w/o prefixes 
//     unprefixedProp = property.charAt(0).toLowerCase() + property.slice(1)

//     // Set styles
//     elem.style[prefixedProp] = value;
//     elem.style[unprefixedProp] = value;
//   };

//   // ==========
//   // State Management
//   // ==========
//   Slider.prototype.checkStates = function(ww) {
//     var s = this;

//     if (ww > 760) {
//       s.$prevArrow.show();
//       s.$nextArrow.show();
//       if (s.settings.currentItemIndex === 0) {
//         // Hide left arrow
//         s.$prevArrow.hide();
//       } else if (s.settings.totalItems - s.settings.itemsToSlide === s.settings.currentItemIndex) {
//         s.$nextArrow.hide();
//       }
//     } else {
//       s.$prevArrow.hide();
//       s.$nextArrow.hide();
//     }

//     // Hides arrows if total number of items is less than those in view

//     if (s.settings.totalItems <= s.settings.itemsToShow) {

//       s.$prevArrow.hide();
//       s.$nextArrow.hide();
//     }
//   };

//   Slider.prototype.checkViewport = function(ww) {
//     var s = this;
//     var transformValue;
//     if (ww <= 760) {
//       s.settings.currentLeft = 0;
//       s.settings.currentItemIndex = 0;

//       if (s.settings.cssTransitions) {
//         if (s.settings.css3dTransforms) {
//           transformValue = 'translate3d(' + -s.settings.currentLeft + 'px, 0, 0)';
//         } else {
//           transformValue = 'translate(' + -s.settings.currentLeft + 'px, 0)';
//         }

//         s.setCss(s.$sliderRow[0], 'transform', transformValue);

//       } else {
//         s.$sliderRow.animate({
//           left: -s.settings.currentLeft
//         }, 500);
//       }
//     }
//   };

//   $.fn.slider = function(settings) {
//     var s = this;
//     return s.each(function(index, el) {
//       el.slider = new Slider(el, settings);
//     });
//   };

//   $.fn.reinitSlider = function() {
//     var $el = $(this);
//     return $el.each(function(index, el) {
//       var ww = $(window).width();
//       el.slider.updateSettings(ww);
//     });
//   }
// });

// jQuery(document).ready(function($) {
//   var slider = $('.slider').slider();
//   $('.slider--portrait').slider({
//     portrait: true
//   });

//   // Creates each type of megaslider as declared in phoenixVars
//   _.forEach(phoenixVars.megaSliderConfigurations, function(config) {
//     $(config.targetClass).not(config.ignoredClasses).slider(
//       config.config
//     );
//   });
// });
