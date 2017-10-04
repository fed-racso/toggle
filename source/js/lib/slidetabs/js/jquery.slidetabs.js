/*
 * SlideTabs jQuery Plugin - www.slidetabs.com
 *
 * @version 1.0.6
 *
 * Copyright 2013, WebStack
 *
 * You need to purchase a license if you want to use this script:
 * http://www.slidetabs.com/pricing
 *
 */

(function($) {
	
	if (!$.stExtend) { $.stExtend = {}; }
			
	function SlideTabs($container, conf) {
		
		this.$container = $container;
		this.$tabsCont = $container.find('.'+conf.classTabsContainer).first();
		this.$tabsInnerCont = this.$tabsCont.children('div');
		this.$tabs = this.$tabsInnerCont.children('ul').addClass(conf.classTabsList);
		this.$lis = this.$tabs.children('li');
		this.$a = this.$lis.find('a').addClass(conf.classTab);
		this.$contentCont = $container.find('.'+conf.classViewsContainer).first();
		this.$content = this.$contentCont; // Note: keeping this separate for now in case I decide to add another content wrapper later
		this.$views = this.$content.children('.'+conf.classView);
		this.$prev = this.$tabsCont.find('.'+conf.classBtnPrev);
		this.$next = this.$tabsCont.find('.'+conf.classBtnNext);
		this.$doc = $(document);
		this.$tab; this.$tabActive = []; this.$li; this.$liLast; this.$view; this.$viewActive; this.val = {}; this.e; this.margin = 0;
		this.conf = conf;
		
		if (!this.$a.length) { console.log('SlideTabs: No tabs added.'); return false; }
		
		this.tabs = {};
		this.content = {};
		
		this.$container.addClass('slidetabs');
				
		this.isParent = (this.$views.find('.slidetabs').length) ? true : false;
		this.$parentViews = this.$container.parents('.'+conf.classView);
		this.isChild = this.$parentViews.length > 0 ? true : false;
		
		this.tabs.total = this.$lis.length; // Get the total tab count so we can increment it later if a new tab is added
		
		this.content.animIsSlide = (this.conf.contentAnim == 'slideH' || this.conf.contentAnim == 'slideV') ? true : false;
		
		var self = this,
			href,
			fragmentId = /^#.+/,
			hrefBase,
			baseEl,
			slug;
		
		this.$a.each(function(i, a) {
			href = $(a).attr('href');
			hrefBase = href.split('#')[0];				
							
			// Normalize the href attribute for IE8 <	
			if (hrefBase && (hrefBase === location.toString().split('#')[0] || (baseEl = $('base')[0]) && hrefBase === baseEl.href)) {
				href = a.hash;
				a.href = href;
			}
															
			// Check for Ajax URL
			if (href && !fragmentId.test(href) && href !== '#') {
				$.data(a, 'load.tabs', href.replace(/#.*$/, ''));
				
				slug = self.tabs_getSlug(this);
				a.href = '#' + slug;
				
				self.$view = self.$content.children('.' + slug);
				
				// Add the content container if none is found
				if (!self.$view.length) {
					self.$view = $('<div></div>').addClass(slug + ' ' + conf.classView);
					self.$content.append(self.$view);
					self.$views = self.$views.add(self.$view);
				}
			// Check if the tab has a 'data-target' attribute if no URL is set
			} else {
				slug = $(a).attr('data-target');
				if (slug) { a.href = '#' + slug; }
			}
		});
		
		// Set the tabs markup classes
		this.$lis.first().addClass('st_li_first');
		this.$lis.last().addClass('st_li_last');
		this.$a.first().addClass('st_tab_first');
		this.$a.last().addClass('st_tab_last');
		this.$views.first().addClass('st_view_first');
		
		// Add the directional buttons
		if (!this.$next.length) { this.$next = $('<a href="#" class="'+conf.classBtnNext+'" />'); this.$tabsCont.prepend(this.$next); }
		if (!this.$prev.length) { this.$prev = $('<a href="#" class="'+conf.classBtnPrev+'" />'); this.$tabsCont.prepend(this.$prev); }
		
		// Check for touch support
		var isTouch = ('ontouchstart' in window);
		if (conf.touchSupport && isTouch) {
			this.val.isTouch = true;
		}
																
		// Get the UA
		var uaMatch = function(ua) {
			ua = ua.toLowerCase();
			var match = /(chrome)[ \/]([\w.]+)/.exec(ua) ||
				/(webkit)[ \/]([\w.]+)/.exec(ua) ||
				/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
				/(msie) ([\w.]+)/.exec(ua) ||
				ua.indexOf('compatible') < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) ||
				[];
		
			return {
				browser: match[1] || '', version: match[2] || '0'
			};
		};
		
		var matched = uaMatch(navigator.userAgent),
			browser = {};
		
		if (matched.browser) {
			browser[matched.browser] = true;
			browser.version = matched.version;
		}
		
		// Chrome is WebKit, but WebKit is also Safari.
		if (browser.chrome) { browser.webkit = true; } 
		else if (browser.webkit) { browser.safari = true; }
		
		// Check for WebKit support						
		if (conf.useWebKit) {
			if (isTouch || browser.safari) {
				// Check for WebKit support
				if ('WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix()) {
					this.$container.addClass('st_webkit');
					this.val.useWebKit = true;
					if (conf.tabsAnimSpeed == 0) { conf.tabsAnimSpeed = 1; }
					if (conf.contentAnimSpeed == 0) { conf.contentAnimSpeed = 1; }
				}
			}
		}
		
		if (conf.orientation == 'horizontal') {
			this.$tabsInnerCont.css('overflow', 'hidden');
			this.val.topleft = 'left';
			this.val.outerWH = 'outerWidth';
			this.val.WH = 'width';
			this.val.clientXY = 'clientX';
			this.val.arrPos = 4;
			if (this.val.useWebKit) { 
				this.val.css = '-webkit-transform';
				this.val.pre = 'translate3d(';
				this.val.px = 'px,0px,0px)';
			} else {
				this.val.css = 'marginLeft';
				this.val.pre = '';
				this.val.px = 'px';
			}
		} else {
			this.val.topleft = 'top';
			this.val.outerWH = 'outerHeight';
			this.val.WH = 'height';
			this.val.clientXY = 'clientY';
			this.val.arrPos = 5;
			if (this.val.useWebKit) { 
				this.val.css = '-webkit-transform';
				this.val.pre = 'translate3d(0px,';
				this.val.px = 'px,0px)';
			} else {
				this.val.css = 'marginTop';
				this.val.pre = '';
				this.val.px = 'px';
			}
			var prevBtnH = this.$prev.outerHeight(true), nextBtnH = this.$next.outerHeight(true);
			this.val.buttonsH = (prevBtnH >= nextBtnH) ? prevBtnH : nextBtnH;
		}
					
		// Set the dimensions if specified in the options			
		if (conf.totalWidth.length > 0) { this.resize_width(); }
		if (conf.totalHeight.length > 0) { this.resize_height(); }
										
		this.tabs_init();
				
		if (conf.autoplay && !this.xhr) { this.autoplay_init(); }
		
		// Add extensions
		$.each($.stExtend, function(ext, func) { func.call(self); });
	};
				
	SlideTabs.prototype = {
		
		/* 
		 * Resizing Methods
		 */
		resize_width: function() {				
			if (this.conf.totalWidth == 'auto') { this.$container.css('width', '100%'); }
			else { this.$container.css('width', this.conf.totalWidth+'px'); }								
		},
		
		resize_height: function() {
			var contentContOH = (this.$contentCont.outerHeight(true) - this.$contentCont.height()),
				newContentHeight;
			
			if (this.conf.orientation == 'vertical') {					
				var	tabsContOH = (this.$tabsCont.outerHeight(false) - this.$tabsCont.height());
				newContentHeight = (this.conf.totalHeight - contentContOH);
									
				this.$tabsCont.css('height', (this.conf.totalHeight - tabsContOH)+'px');
				this.$contentCont.css('height', newContentHeight+'px');
			} else {
				newContentHeight = (this.conf.totalHeight - (this.$tabsCont.outerHeight(true) + contentContOH));
				this.$contentCont.css('height', newContentHeight+'px');
			}
			
			this.content.orgHeight = newContentHeight;
		},
		
		
		/* 
		 * Tab Methods
		 */
		tabs_init: function() {
			var tabs = this.tabs;
			
			tabs.animated = '#' + this.$container.attr('id') + ' .' + this.conf.classTabsList + ':animated';
			tabs.loop = false;
			tabs.slugCount = this.$a.length;
			
			tabs.tabsContWH = this.$tabsCont[this.val.outerWH](false);
			tabs.tabsOH = this.$tabs.outerHeight(true);
			tabs.tabsOrgWidth = this.tabs_getTotalLength(); // Set the full original tabs width
						
			tabs.buttonsVisible = (this.$prev.is(':visible') || this.$next.is(':visible')) ? true : false;
			
			this.tabs_setSlideLength(); // Set the tabs slide length value
			this.tabs_posActive(); // Position the active tab
			this.tabs_bind(); // Bind tab events
		},
		
		tabs_getSlug: function(a) {
			var dataAttr = $(a).attr('data-target');
			return dataAttr && dataAttr.replace(/\s/g, '_').replace( /[^\w\u00c0-\uFFFF-]/g, '') || 'tab-' + this.total++;
		},
		
		tabs_setUniqueSlug: function(slug) {
			var self = this;
			
			self.$a.each(function() {
				if($(this).attr('href') == '#' + slug) {
					self.slugCount++;
					self.slug = 'tab-' + self.slugCount;
					self.tabs_setUniqueSlug(self.slug); // Run the slug check again to see if the new name has any duplicates
					return;
				}
			});
		},
		
		tabs_getTotalLength: function() {
			var self = this,
				tabsTotWH = 0;
				
			// Calculate the total width/height of the tabs
			self.$tabs.children('li').each(function() { tabsTotWH += parseInt($(this).css(self.val.WH)); });
			
			return tabsTotWH;
		},
		
		tabs_setSlideLength: function() {
			if (this.conf.tabsSlideLength == 0) {
				if (this.conf.orientation == 'horizontal') { this.val.tabsSlideLength = this.$tabsInnerCont.outerWidth(false); }
				else {
					var tabsPos = this.$tabsInnerCont.position().top;
					if (this.$container.hasClass(this.conf.classTabSlidingEnabled)) { tabsPos = (tabsPos == 0) ? this.val.buttonsH : tabsPos; }
											
					this.val.tabsSlideLength = (parseInt(this.$tabsCont.css('height')) - tabsPos);
				}
			} else {
				this.val.tabsSlideLength = this.conf.tabsSlideLength;
			}
		},
		
		tabs_bind: function() {
			var self = this, hash;
			
			if (self.conf.responsive == true) {
				var resizeTimer = null, limitXY;
				
				// Bind dynamic resizing
				$(window).resize(function() {
					if (resizeTimer) { clearTimeout(resizeTimer); }
					resizeTimer = setTimeout(function() {
						if (self.$container.is(':hidden')) { return false; } // Prevent re-positioning if the tabs are hidden
												
						if (self.conf.orientation == 'horizontal') { self.tabs_setAutoWidth(); }
						else { self.tabs_setAutoHeight(); }
										
						// Change the content container(s) height (if this is not a parent instance)
						if (self.conf.autoHeight == true && !self.isParent) { self.content_setHeight(true); }
					}, 100);
				});
			}
			
			// Bind the prev button click event
			self.$prev.click(function() {
				if (self.tabs.isAnim) { return false; }
				self['tabs_' + self.conf.buttonsFunction + 'Prev']();
				return false;
			}),
			
			// Bind the next button click event
			self.$next.click(function() {
				if (self.tabs.isAnim) { return false; }
				self['tabs_' + self.conf.buttonsFunction + 'Next']();
				return false;
			}),
			
			// Delegate the tabs click event
			self.$tabs.delegate('li a.'+self.conf.classTab, 'click', function() {
				if (self.tabs.isAnim) { return false; }
				self.tabs_click(this, true);
				if (self.conf.tabsShowHash == false) { return false; }
			});

			// Bind tabs mouse scrolling
			if ($.fn.mousewheel && self.conf.tabsScroll) {	
				self.$tabs.mousewheel(function(event, delta) {
					if (self.tabs.isAnim) { return false; }
					(delta > 0) ? self.tabs_slidePrev() : self.tabs_slideNext();					
					return false; // Prevents default scrolling
				});
			}
			
			// Bind any external tab links on the page
			if (self.conf.externalLinking) {
				$('.'+self.conf.classExtLink).each(function() {
					// Bind the links with a matching rel attribute					
					if ($(this).attr('rel') == self.$container.attr('id')) {						
						$(this).click(function() {							
							if (self.tabs.isAnim) { return false; }
							hash = self.tabs_getHash($(this));
							self.$tab = self.tabs_findByRel(hash);
							self.tabs_click(self.$tab);
							if (self.conf.tabsShowHash == false) { return false; }
						});
					};
				});
			}
		},
				
		tabs_setAutoWidth: function() {
			this.tabs_setSlideLength();
			
			var tabsTotW = this.tabs_getTotalLength(),
				tabsContW = (this.buttonsVisible) ? parseInt(this.$tabsInnerCont.css('width')) : parseInt(this.$tabsCont.css('width')); // Note: don't use position.left to get the total width as the tabs might have a negative margin
			
			if (this.$container.hasClass(this.conf.classTabSlidingEnabled)) {
				if (typeof(this.tabsDiff) == 'undefined') {
					// Set the tab-sliding enabled/disabled width difference if it's undefined and tab-sliding is enabled
					this.tabsDiff = (this.tabs.tabsOrgWidth - tabsTotW);
				} else {
					// Set the tab-sliding enabled/disabled width difference if it has been defined and tab-sliding is enabled
					if (this.tabsDiff < 5) { tabsTotW = (tabsTotW + this.tabsDiff); } // Setting a tolerance of 5px to allow small changes in the tabs total width
				}
			}
						
			if (tabsTotW <= tabsContW) {
				this.margin = (0 + this.conf.offsetBR);
				this.tabs_hideButtons();
				this.$tabs.css(this.val.css, this.val.pre + -+this.margin + this.val.px);
			} else { // The tabs are longer than their container
				var gap = parseInt(this.$tabsInnerCont.css('width')) - (this.$liLast.position().left + this.$liLast.outerWidth(false));
				
				if (gap > (0 + this.conf.offsetBR)) {
					this.margin = (this.margin - gap);
					this.tabs_posTabs(); // Position the tabs
					
					this.tabs_disableButton(this.$next);
					this.tabs_enableButton(this.$prev);
				} else {
					this.tabs_initButtons();
				}
				
				this.$container.addClass(this.conf.classTabSlidingEnabled);
				this.tabs_showButtons();
			}
			
			this.tabs_setSlideLength();
			if (this.val.isTouch) { this.tabs_setSwipeLength(); } // Set the new swipe length
		},								
											
		tabs_setAutoHeight: function() {
			if (this.resizeTimer) { clearTimeout(this.resizeTimer); }
			
			var self = this;
						
			this.resizeTimer = setTimeout(function() {
				self.tabs_setSlideLength();
								
				// If the total height of the tabs are less than the tabs container, hide the buttons and reset the tabs position
				if (self.$tabs.outerHeight(false) < self.$tabsCont.outerHeight(true)) {
					self.margin = (0 + self.conf.offsetBR);
					self.tabs_hideButtons();
					self.$tabs.css(self.val.css, self.val.pre + -+self.margin + self.val.px);					
				} else { // The tabs are longer than their container
					var $li,
						$liLast = self.$lis.last(),
						$unalignedLi,
						gap = self.val.tabsSlideLength - ($liLast.position().top + $liLast.outerHeight(false)),
						alignedTop = false, 
						alignedBottom = false;
					
					if (gap > (0 + self.conf.offsetBR)) {
						self.margin = (self.margin - gap);
						self.tabs_posTabs(); // Position the tabs
						
						self.tabs_disableButton(self.$next);
						self.tabs_enableButton(self.$prev);
					} else {
						// Check if the top and/or bottom tab is aligned
						self.$lis.each(function() {
							$li = $(this);
							gap = $li.position().top;
																							
							if (gap == (0 + self.conf.offsetTL)) {
								alignedTop = true;
							} else if ((gap + $li.children('a').outerHeight(false)) == (self.val.tabsSlideLength - self.conf.offsetBR)) {
								alignedBottom = true;
								return false;
							} else if (gap < 0) {
								$unalignedLi = $li;
							}
						});
													
						// Position the top tab if the tabs are unaligned
						if (!alignedTop && !alignedBottom) {
							self.margin = (self.margin - Math.abs($unalignedLi.position().top)); // Subtract to slide down
							self.tabs_posTabs(); // Position the tabs
						}
																						
						self.tabs_initButtons();
					}
					
					self.$container.addClass(self.conf.classTabSlidingEnabled);
					self.tabs_showButtons();
				}
				
				self.tabs_setSlideLength();
				if (self.val.isTouch) { self.tabs_setSwipeLength(); } // Set the new swipe length
			}, 200);
		},
											
		tabs_posActive: function() {
			// Get the active tab
			this.tabs_getActive();
			
			// Show the active tab's content
			this.content_init(true);
			
			this.$liLast = this.$tabs.children('li:last');
			this.$tab = this.$tabActive;
			this.$tabActive = this.$tabActive.parents('li');
					
			if ((this.$liLast[this.val.outerWH](false) + this.$liLast.position()[this.val.topleft]) > this.val.tabsSlideLength) {
				this.$container.addClass(this.conf.classTabSlidingEnabled);
									
				this.tabs_showButtons(); // Show the directional buttons
				this.tabs_setSlideLength(); // Set the tabs slide length value after the active class and buttons have been added
				this.tabs_setActivePos(this.$tab[this.val.outerWH](false), this.$tabActive.position()[this.val.topleft]); // Position the active tab
				
				// Init the button states
				if (!this.conf.tabsLoop) { this.tabs_initButtons(); }
			}								
		},
		
		tabs_setActivePos: function(elemD, elemP) {
			// Get the values needed to get the total width/height of the tabs
			this.val.elemD = elemD;
			this.val.elemP = elemP;
			
			// Calculate the active element's position
			if (this.val.elemP > this.val.tabsSlideLength) {
				this.margin = (this.val.elemD + (this.val.elemP - this.val.tabsSlideLength));
				this.margin = (this.margin + this.conf.offsetBR);
			} else if ((this.val.elemP + this.val.elemD) > this.val.tabsSlideLength) {
				this.margin = (this.val.elemD - (this.val.tabsSlideLength - this.val.elemP));
				this.margin = (this.margin + this.conf.offsetBR);
			} else {
				this.margin = (this.margin - this.conf.offsetTL);
			}
											
			this.tabs_posTabs(); // Position the tabs
		},
		
		tabs_posTabs: function() {
			// Reset the transition speed if using WebKit
			if (this.val.useWebKit) { this.$tabs.css('-webkit-transition-duration', '0ms'); }
			// Set the active element's position
			this.$tabs.css(this.val.css, this.val.pre+-this.margin+this.val.px);
		},
		
		tabs_showAppended: function(show) {
			var totLength = this.tabs_getTotalLength();
							
			if (totLength > this.val.tabsSlideLength - this.conf.offsetBR) {
				this.$container.addClass(this.conf.classTabSlidingEnabled);
				
				// Show the prev/next buttons
				this.tabs_showButtons();
				this.tabs_setButtonState();
				
				this.tabs_setSlideLength(); // Set the tabs slide length value
				
				// Slide the appended tab into view (if enabled)						
				if (show == true) {
					totLength = this.tabs_getTotalLength(); // Set total length again to fix the 1px gap on first append
					
					this.margin = (totLength-this.val.tabsSlideLength)+this.conf.offsetBR;
					this.tabs_animate(300); // Animate with the new value
				}
			}
		},
		
		tabs_initButtons: function() {
			if (this.conf.buttonsFunction == 'slide' && !this.conf.tabsLoop) {
				// Deactivate the arrow button if the tab element is at the beginning or end of the list													
				if (this.$lis.first().position()[this.val.topleft] == (0 + this.conf.offsetTL)) { this.tabs_disableButton(this.$prev); }
				else { this.tabs_enableButton(this.$prev); }
				
				if ((this.$liLast.position()[this.val.topleft] + this.$liLast[this.val.outerWH](false)) <= (this.val.tabsSlideLength - this.conf.offsetBR)) { this.tabs_disableButton(this.$next); } 
				else { this.tabs_enableButton(this.$next); }
			} else {
				this.tabs_setButtonState();
			}																
		},
					
		tabs_enableButton: function($btn) {
			$btn.removeClass(this.conf.classBtnDisabled);
		},
		
		tabs_disableButton: function($btn) {
			$btn.addClass(this.conf.classBtnDisabled);
		},
		
		tabs_showButtons:function() {
			// Show the directional buttons
			this.$prev.css('display', 'block'); this.$next.css('display', 'block');
							
			if (typeof(this.tabsDiff) == 'undefined') {
				var totLength = this.tabs_getTotalLength();
				this.tabsDiff = Math.abs(this.tabs.tabsOrgWidth - totLength);
			}
		},
		
		tabs_hideButtons: function() {
			this.$container.removeClass(this.conf.classTabSlidingEnabled);
			
			// Hide the directional buttons
			this.$prev.hide(); this.$next.hide();	
		},
		
		tabs_click: function(tab, organic, swipeSpeed, loop) {
			if (this.content.isAnim || this.proccessing) { return false; }
				
			this.$tab = $(tab);
			
			// Return false if the active tab is clicked
			if (this.$tab.hasClass(this.conf.classTabActive)) { return false; }
																		
			// Run the onTabClick callback function
			if (typeof(this.conf.onTabClick) == 'function') { this.conf.onTabClick.call(this, this.$tab); }
			
			var url = $.data(this.$tab[0], 'load.tabs');
			
			this.$li = this.$tab.parents('li');
			
			// Set the new active state
			this.tabs_setActive();
			
			// Get the element's position
			this.val.elemP = this.$li.position();
			this.val.activeElemP = this.$tabActive.parent('li').position();
			
			this.isSwipe = (swipeSpeed) ? true : false;
			
			// Slide partially hidden tab into view
			this.tabs_slideClicked();
			
			if (this.conf.autoplay == true) {
				if (organic) {
					if (this.conf.autoplayClickStop) {
						// Disable autoplay
						this.conf.autoplay = false;
						this.autoplay_clearInterval();
					} else {
						this.val.index = this.$tab.parents('li').index(); // Set the clicked tab's index
						if (!this.isPause) { this.autoplay_setInterval(); }
					}
				}
			}
							
			this.tabs.loop = (loop) ? loop : false; // Set the tabs.loop value to determine the content animation direction later
								
			if (url) {
				this.tabs_load(this.$tab, url, swipeSpeed, true);
			} else {
				this.tabs_show(this.$tab, swipeSpeed);
			}
		},
		
		// Todo: move to content.load()
		tabs_load: function($tab, url, swipeSpeed, show) {
			this.proccessing = true;
							
			if (this.xhr) {
				this.xhr.abort();
				delete this.xhr;
			}
			
			if (this.conf.autoplay == true) {
				this.autoplay_clearInterval();
			}										
			
			if (this.conf.ajaxSpinner == true) { this.$container.append('<span id="st_spinner"></span>'); }
			
			var self = this;
									
			this.xhr = $.ajax({
				url: url,
				dataType: 'html',
				success: function(r) {
					$(self.$views[$tab.parent('li').index()]).html('<div class="'+self.conf.classViewInner+'">'+r+'</div>');							

					// Remove the url data if the content should be cached
					if (self.conf.ajaxCache) { $tab.removeData('load.tabs'); }
					
					// Run the onAjaxComplete callback function
					if (typeof(self.conf.onAjaxComplete) == 'function') { self.conf.onAjaxComplete.call(self, $tab); }
				},
				error: function() {
					$(self.$views[$tab.parent('li').index()]).html('<div class="' + self.conf.classViewInner + '">' + self.conf.ajaxError + '</div>');
				},
				complete: function() {
					if (show) { self.tabs_show($tab, swipeSpeed); } 
					else { if (self.conf.autoHeight == true) { self.content_setHeight(false); } } // First content loading
					self.proccessing = false;
					self.xhr = false;
					$('#st_spinner').remove();							
					if (self.conf.autoplay) {
						self.val.index = $tab.parents('li').index();
						self.autoplay_setInterval();
					}
				}
			});
		},
		
		// Todo: move to content.show()
		tabs_show: function($tab, swipeSpeed) {
			this.content_setIsAnim(true, 'pause');
			
			// Get the clicked tab's hash value
			this.val.hash = this.tabs_getHash($tab);
										
			// Set the content vars and remove/add the active class
			this.$viewActive = this.$content.children('.'+this.conf.classViewActive).removeClass(this.conf.classViewActive);
			this.$view = this.$content.children('.'+this.val.hash).addClass(this.conf.classViewActive);
			this.$currentView = this.$view;
							
			if (this.conf.autoHeight == true) { this.content_setHeight(true); } // Run autoHeight -before- the animation
						
			if (this.val.useWebKit && this.content.animIsSlide) { this.content_bindWebKitCallback(); }
			
			if (swipeSpeed > 0 && this.content.isTouch) { 
				this['content_' + this.conf.contentAnim](swipeSpeed);
			} else {
				// Show/animate the clicked tab's content into view	
				if (this.conf.contentAnim.length > 0) {
					this['content_' + this.conf.contentAnim](swipeSpeed);
				} else {
					this.$viewActive.css({position: 'absolute', visibility: 'hidden'});
					this.$view.css({position: 'static', visibility: 'visible'});
					
					this.content.isAnim = false;
				}
			}
		},
		
		tabs_clickPrev: function() {				
			// Return false if an animation is already running				
			if (this.tabs.isAnim || $(this.content.animated).length) { return false; }
			
			// Find the previous tab
			this.val.$prevTab = this.tabs_find('prev');
			
			if (this.val.$prevTab.length) { this.tabs_click(this.val.$prevTab, true); } 
			else { if (this.conf.tabsLoop == true) { this.tabs_click(this.$tabs.children('li').find('a').last(), true, 0, 'prev'); } }
		},
		
		tabs_clickNext: function() {
			// Return false if an animation is already running				
			if (this.tabs.isAnim || $(this.content.animated).length) { return false; }
			
			// Find the next tab
			this.val.$nextTab = this.tabs_find('next');
			
			if (this.val.$nextTab.length) { this.tabs_click(this.val.$nextTab, true); } 
			else { if (this.conf.tabsLoop == true) { this.tabs_click(this.$tabs.children('li').find('a').first(), true, 0, 'next'); } }
		},						
		
		tabs_find: function(func) {				
			return this.$tab.parents('li')[func]().find('a.'+this.conf.classTab);								
		},
		
		tabs_findByRel: function(rel) {
			// Find the tab via it's rel attribute
			return this.$tabs.find('[rel='+rel+']');
		},
		
		tabs_getHash: function($tab) {
			// Get the tab's href value				
			this.val.hash = $tab.attr('href');
			return this.val.hash.substring((this.val.hash.indexOf('#')+1)); // Make sure the href only contains the hash value
		},
		
		tabs_getActive: function() {
			if (this.conf.urlLinking == true && location.hash) {
				// Use the URL's hash value to find the active-tab via it's rel attribute
				this.$tabActive = this.tabs_findByRel(location.hash.slice(1));
			}
			
			// If no tab element has been found
			if (!this.$tabActive.length) {
				// See if the active-tab id is saved in a cookie
				var savedTabIndex = (this.conf.tabsSaveState == true && $.cookie) ? $.cookie(this.$container.attr('id')) : false;
												
				if (savedTabIndex) {
					// Remove the static active class
					this.tabs_removeActive();												
					
					// Set the active class on the saved tab						
					this.$tabActive = this.$a.eq(savedTabIndex).addClass(this.conf.classTabActive);
					
					// If the saved tab is not available anymore, set the first tab element to 'active' instead
					if (!this.$tabActive.length) { this.tabs_setFirstActive(); }
				} else {					
					this.$tabActive = this.$tabs.children('li').find('.'+this.conf.classTabActive);
					
					// Set the first tab element to 'active' if no tab element has the active class
					if (!this.$tabActive.length) { this.tabs_setFirstActive(); }
				}
				
				// Add the 'active' class to the tab's parent <li> element
				this.$tabActive.parent('li').addClass(this.conf.classTabActiveParent);
			} else {
				// Remove the static active class
				this.tabs_removeActive();
				// Add the 'active' class to the tab and parent <li> element
				this.$tabActive.addClass(this.conf.classTabActive).parent('li').addClass(this.conf.classTabActiveParent);
			}
			
			this.tabs_saveActive(this.$tabActive);
		},
		
		tabs_setFirstActive: function() {
			this.$tabActive = this.$tabs.find('a:first').addClass(this.conf.classTabActive);
		},
					
		tabs_removeActive: function() {
			// Remove the current active class
			this.$tabs.children('li').find('.'+this.conf.classTabActive).removeClass(this.conf.classTabActive).parent('li').removeClass(this.conf.classTabActiveParent);
		},										
		
		tabs_setActive: function() {
			// Set new active states				
			this.$tabActive = this.$tabs.children('li').find('a.'+this.conf.classTabActive).removeClass(this.conf.classTabActive);
			this.$tabActive.parent('li').removeClass(this.conf.classTabActiveParent);
			this.$tab.addClass(this.conf.classTabActive).parent('li').addClass(this.conf.classTabActiveParent);
			this.tabs_saveActive(this.$tab);
		},
		
		tabs_saveActive: function($tab) {
			// Save the active tab's parent index value in a cookie so we can retrive it later
			if ($.cookie) { $.cookie(this.$container.attr('id'), $tab.parents('li').index()); }
		},
		
		tabs_slideClicked: function() {
			if (this.tabs.isAnim) { return false; }
			
			this.val.elemP = this.val.elemP[this.val.topleft];
			this.val.elemD = this.$li[this.val.outerWH](false);
			this.val.aD = this.$li.children('a')[this.val.outerWH](false);
			this.val.nextElemPos = (this.$li.next().length == 1) ? this.$li.next().position()[this.val.topleft] : 0;
			
			if (this.val.elemP < (0 + this.conf.offsetTL)) {
				this.tabs.isAnim = true;
				
				this.val.elemHidden = (this.val.elemD - this.val.nextElemPos);						
				this.margin = (this.margin - (this.val.elemHidden + this.conf.offsetTL));
									
				this.tabs_enableButton(this.$next);
				
				this.tabs_animate();
			} else if ((this.val.aD + this.val.elemP) > (this.val.tabsSlideLength - this.conf.offsetBR)) {
				this.tabs.isAnim = true;
				
				this.margin += (this.val.aD - (this.val.tabsSlideLength - (this.val.elemP + this.conf.offsetBR)));
																						
				this.tabs_enableButton(this.$prev);
				
				this.tabs_animate();
			}
							
			this.tabs_setButtonState();
		},
		
		tabs_slidePrev: function(swipeSpeed) {
			// Note: Leave the :animated check
			if (/*this.tabs.isAnim || */$(this.tabs.animated).length || !this.$container.hasClass(this.conf.classTabSlidingEnabled)) { return false; }
			
			this.tabs.isAnim = true;
			
			// Run the onTabPrevSlide callback function
			if (typeof(this.conf.onTabPrevSlide) == 'function') { this.conf.onTabPrevSlide.call(this, this.$tab); }
			
			var self = this,
				$lis = this.$tabs.children('li');
			
			// Find the element and set the margin 			
			$lis.each(function() {	
				self.$li = $(this);										
				self.val.elemP = self.$li.position()[self.val.topleft];
				
				if (self.val.elemP >= (-1 + self.conf.offsetTL)) {
					// Set the values for sliding multiple tabs
					if (self.conf.tabsToSlide > 1) {
						var liIdx = self.$li.index(),
							index = ((liIdx - self.conf.tabsToSlide)),
							isFirst = (liIdx > 0) ? 1 : 0;
													
						index = (index < 0) ? isFirst : (index + 1);
						
						self.$li = $lis.eq(index);
						self.val.elemP = self.$li.position()[self.val.topleft];
					}
					
					self.$li = self.$li.prev();
					
					// Slide to the last tab if tab looping is enabled
					if (!self.$li.length) {
						if (self.conf.tabsLoop && typeof(swipeSpeed) == 'undefined') {
							self.$liLast = $lis.last();
							self.val.elemP = self.$liLast.position()[self.val.topleft];
																							
							self.margin = ((((self.val.elemP + self.$liLast[self.val.outerWH](false)) - self.conf.offsetTL) - self.val.tabsSlideLength) + self.conf.offsetBR);
							
							self.$li = self.$liLast; // Set the $li variable to the first visible element
						} else {
							self.tabs.isAnim = false;
						}
					} else {
						self.val.elemHidden = (self.$li[self.val.outerWH](true) - self.val.elemP);
						self.margin = ((self.margin - self.val.elemHidden) - self.conf.offsetTL);
					}
					
					if (self.$li.length) { self.tabs_animate(swipeSpeed); }
					if (self.conf.buttonsFunction == 'slide') { self.tabs_setButtonState(self.$next); }
					
					return false;
				}																						
			});								
		},
		
		tabs_slideNext: function(swipeSpeed) {									
			// Note: Leave the :animated check
			if (/*this.tabs.isAnim || */$(this.tabs.animated).length || !this.$container.hasClass(this.conf.classTabSlidingEnabled)) { return false; }
			
			this.tabs.isAnim = true;
			
			// Run the onTabNextSlide callback function
			if (typeof(this.conf.onTabNextSlide) == 'function') { this.conf.onTabNextSlide.call(this, this.$tab); }
			
			var self = this,
				$lis = this.$tabs.children('li'), 
				$thisA;
			
			// Find the element and set the margin					
			$lis.each(function() {						
				self.$li = $(this);
				$thisA = self.$li.children('a');
				
				self.val.elemD = $thisA[self.val.outerWH](false);
				self.val.elemP = self.$li.position()[self.val.topleft];
				
				if (Math.round(self.val.elemD + self.val.elemP) > (self.val.tabsSlideLength + Math.abs(self.conf.offsetBR))) {
					
					// Get the values for sliding multiple tabs
					if (self.conf.tabsToSlide > 1) {
						self.$li = $lis.eq((self.$li.index()+self.conf.tabsToSlide)-1);
						if (!self.$li.length) { self.$li = $lis.last(); }
						$thisA = self.$li.children('a');
													
						self.val.elemD = $thisA[self.val.outerWH](false);
						self.val.elemP = self.$li.position()[self.val.topleft];
					}
					
					self.val.elemHidden = (self.val.tabsSlideLength - self.val.elemP);																																																				
					self.margin += ((self.val.elemD - self.val.elemHidden) + self.conf.offsetBR);

					self.tabs_animate(swipeSpeed);
					if (self.conf.buttonsFunction == 'slide') { self.tabs_setButtonState(self.$prev); }
					
					return false;
				} else if (self.$li.index()+1 == self.$a.length) {
					if (self.conf.tabsLoop == true && typeof(swipeSpeed) == 'undefined') {
						// Slide to the first tab if tab looping is enabled
						self.margin = (0 - self.conf.offsetTL);
						
						self.tabs_animate(swipeSpeed);
						if (self.conf.buttonsFunction == 'slide') { self.tabs_setButtonState(self.$prev); }
					} else {
						self.tabs.isAnim = false;
					}
				}																						
			});
		},
		
		tabs_animate: function(swipeSpeed) {
			var self = this,
				animSpeed = (swipeSpeed > 0) ? swipeSpeed : self.conf.tabsAnimSpeed;
			
			if (self.val.useWebKit) {
				self.tabs_bindWebKitCallback();
				
				self.$tabs.css({'-webkit-transition-duration': animSpeed+'ms', '-webkit-transition-timing-function': 'ease-out', '-webkit-transform': self.val.pre + -self.margin + self.val.px});
			} else {
				// Animate tabs with the new value
				if (self.conf.orientation == 'horizontal') {
					self.$tabs.animate({'marginLeft': -+self.margin+'px'}, animSpeed, self.conf.tabsEasing, function() {
						self.tabs_setIsAnim(false, 'resume');
					});
				} else { 
					self.$tabs.animate({'marginTop': -+self.margin+'px'}, animSpeed, self.conf.tabsEasing, function() {
						self.tabs_setIsAnim(false, 'resume');
					});
				}
			}
		},								
		
		tabs_setButtonState: function($btn) {
			if (!this.conf.tabsLoop) {
				// If the directional buttons are set to click through the tabs, get the active tab instead of the first visible
				if (this.conf.buttonsFunction == 'click') { this.$li = this.$tab.parents('li'); }
				
				if (this.$li.is(':first-child')) { this.tabs_disableButton(this.$prev); this.tabs_enableButton(this.$next); } // Is the active or visible tab the first one?
				else if (this.$li.is(':last-child')) { this.tabs_disableButton(this.$next); this.tabs_enableButton(this.$prev); } // Is the active or visible tab the last one?
				else { 
					if ($btn) {	this.tabs_enableButton($btn); } // Enable the specified button only
					else if (this.conf.buttonsFunction == 'click') { this.tabs_enableButton(this.$prev); this.tabs_enableButton(this.$next); } // Enable both buttons										
				}
			}
		},
											
		tabs_fixE: function(e) {
			if (typeof e == 'undefined') e = window.event;
			if (typeof e.layerX == 'undefined') e.layerX = e.offsetX;
			if (typeof e.layerY == 'undefined') e.layerY = e.offsetY;
			return e;
		},
					
		tabs_WebKitPosition: function($elem, arrPos) {
			var wkVal = window.getComputedStyle($elem.get(0),null).getPropertyValue('-webkit-transform'),
				wkValArray = wkVal.replace(/^matrix\(/i,'').split(/, |\)$/g),
				val = parseInt(wkValArray[arrPos], 10);
										
			//return parseInt(wkValArray[arrPos], 10) || 0; // Shorthand return, safe to use?
			return (isNaN(val)) ? 0 : val;
		},
		
		tabs_bindWebKitCallback: function() {
			var self = this;
			
			self.$tabs.unbind('webkitTransitionEnd').bind('webkitTransitionEnd', function() {
				self.tabs_setIsAnim(false, 'resume');
			});
		},
		
		tabs_setIsAnim: function(isAnim, play) {
			this.tabs.isAnim = isAnim;
			if (this.conf.autoplay) { this['autoplay_' + play](false, true); }
		},
		
	
		/* 
		 * Content Methods
		 */
		content_init: function(firstInit) {
			var content = this.content;
			
			if (this.conf.contentAnim == 'slideV') {
				content.owh = 'outerHeight';
				content.wh = 'height';
				content.clientXY = 'clientY';
				content.arrPos = 5;
				if (this.val.useWebKit) { 
					content.css = '-webkit-transform';
					content.pre = 'translate3d(0px,';
					content.px = 'px,0px)';
				} else {
					content.css = 'top';
					content.pre = '';
					content.px = 'px';
				}
			} else {
				content.owh = 'outerWidth';
				content.wh = 'width';
				content.clientXY = 'clientX';
				content.arrPos = 4;
				if (this.val.useWebKit) {
					content.css = '-webkit-transform';
					content.pre = 'translate3d(';
					content.px = 'px,0px,0px)';
				} else {
					content.css = 'left';
					content.pre = '';
					content.px = 'px';
				}
			}
			
			content.isAnim = false;
			content.dist = 0;
			
			if (firstInit == true) { 
				content.animated = '#' + this.$container.attr('id') + ' .' + this.conf.classViewsContainer + ' :animated';
				content.orgHeight = 0;
				content.height = 0;
				
				this.content_showActive();
									
				var url = $.data(this.$tabActive[0], 'load.tabs');
			
				// Load the content if the first tab has a URL
				if (url) { this.tabs_load(this.$tabActive, url); }
			}
		},
		
		content_reInit: function() {
			this.content.oldCSS = this.content.css; // Save the old CSS position style so it can be reset below
			
			this.content_init(false);
			
			if (this.val.useWebKit) { this.$views.css('-webkit-transition-duration', ''); }
			this.$views.css(this.content.oldCSS, '').css('visibility', ''); // Remove the old CSS position styles
				
			this.content_positionContent();
		},
		
		content_showActive: function() {
			var hash = this.tabs_getHash(this.$tabActive);
							
			// Show the active tab's content
			this.$view = this.$content.children('.'+hash).addClass(this.conf.classViewActive);
			this.$currentView = this.$view;
			
			// Set the content container's height if autoHeight is set to: true
			if (this.conf.autoHeight == true) {
				var $viewInner = this.$view.children('.'+this.conf.classViewInner).css('height', 'auto'); // Get the current inner content-container and set it's height to 'auto'
				if ($viewInner.length) {
					// Get the height of the inner content div
					this.content.height = $viewInner.outerHeight(true);
				} else {
					// If the inner content div is missing, set the main div to height:auto and get the height
					this.$views.css('height', 'auto');
					this.content.height = this.$view.outerHeight(true);
				}
														
				this.content.orgHeight = this.content.height; // Set the original height

				this.$content.css('height', this.content.height+'px');
			}
							
			this.content_positionContent();
		},
		
		content_positionContent: function() {
			// Set the content div's to position absolute and position them according to the config animation
			if (this.conf.contentAnim) {
				if (this.val.useWebKit) { 
					this.$views.css('-webkit-transition-duration', '0ms'); // Reset transition speed if using WebKit
					this.$view.css(this.content.css, this.content.pre + '0' + this.content.px); // Make sure translate3d is set to '0px' for the active view-container to prevent a delay on the first swipe
				}
				this.$content.children('div').css('position', 'absolute').not('div.' + this.conf.classViewActive).css(this.content.css, this.content.pre + this.conf.viewportOffset + this.content.px);
			} else {
				this.$views.not('div.'+this.conf.classViewActive).css({position: 'absolute', visibility: 'hidden'});
			}
		},
						
		content_rePositionView: function() {
			if (this.val.useWebKit) { this.$views.css('-webkit-transition-duration', '0ms'); }
			this.$viewActive.css(this.content.css, this.content.pre + this.conf.viewportOffset + this.content.px).show(); // Note: move show() to the fade callback?
			
			// If touch-swipe, make sure the div before/after the previous active view (depending on the swipe direction) is re-positioned as well
			if (this.isSwipe) {
				var $viewActivePN = (this.$currentView.index() > this.$viewActive.index()) ? this.$viewActive.prev() : this.$viewActive.next();
				$viewActivePN.css(this.content.css, this.content.pre + this.conf.viewportOffset + this.content.px).show(); // Note: move show() to the fade callback?
			}
		},
		
		content_setParentsHeight: function(animate) {
			var self = this,
				$this,
				$content,
				$viewInner,
				total = self.$parentViews.length,
				isLast,
				height;
										
			self.$parentViews.each(function(i) {
				$this = $(this);
				$content = $this.parent();
				isLast = ((i + 1) == total) ? true : false;
												
				if (isLast) {
					// Don't set the height of the first/top view-container if it's not active/visible
					if (!$this.hasClass(self.conf.classViewActive)) { return false; }
				}
				
				$viewInner = $content.children('.'+self.conf.classViewActive).children('.'+self.conf.classViewInner).css('height', 'auto');
				height = self.content_getHeight($viewInner, $this);
				
				// Only animate the first/top view-container (if enabled), so the correct value is set for the next loop
				if (isLast && self.conf.autoHeightSpeed > 0 && animate) {
					$content.animate({'height': height+'px'}, self.conf.autoHeightSpeed);
				} else {
					$content.css('height', height+'px');
				}
			});
		},
		
		content_setHeight: function(animate) {
			this.$view.css('height', 'auto');
			var $viewInner = this.$view.children('.'+this.conf.classViewInner).css('height', 'auto'); // Get the current inner content-container and set it's height to 'auto'
						
			// Get the height of the content
			this.content.height = this.content_getHeight($viewInner, this.$view);
			
			// Set the content's height
			if (!this.isChild && this.conf.autoHeightSpeed > 0 && animate) {
				this.$content.animate({'height': this.content.height+'px'}, this.conf.autoHeightSpeed);
			} else {
				this.$content.css('height', this.content.height+'px');
				if (this.isChild) { this.content_setParentsHeight(animate); } // Set the height of the parent view-container(s) if the tabs are nested
			}
		},
		
		content_getHeight: function($viewInner, $view) {
			var height = $viewInner.outerHeight(true);
			
			if (height == 0 || height == null) {
				height = $view.outerHeight(true);
				
				// Set the original height if the new height still returns 0
				if (height == 0) { height = this.content.orgHeight; }
			}
			
			return height;
		},
		
		content_resetAutoHeight: function() {
			this.$contentCont.removeAttr('style');
			this.$content.removeAttr('style');
			this.$view.children('.'+this.conf.classViewInner).removeAttr('style');
		},
		
		content_fade: function() {
			var self = this;
			
			self.$view.hide().css(self.content.css, self.content.pre + 0 + self.content.px).fadeIn(self.conf.contentAnimSpeed, function() {
				self.content_setIsAnim(false, 'resume');
				
				// Run the onContentVisible callback function
				if (typeof(self.conf.onContentVisible) == 'function') { self.conf.onContentVisible.call(self, self.$tab); }
			});
			self.$viewActive.fadeOut(self.conf.contentAnimSpeed, function() {
				// Position the previous div outside the viewport in case the content resizes
				self.content_rePositionView();
			});
		},
		
		content_fadeOutIn: function() {
			var self = this;
			
			self.$view.hide().css(self.content.css, self.content.pre + 0 + self.content.px);
			self.$viewActive.fadeOut(self.conf.contentAnimSpeed, function() {
				self.$view.fadeIn(self.conf.contentAnimSpeed, function() { 
					// Position the previous div outside the viewport in case the content resizes
					self.content_rePositionView();
					
					self.content_setIsAnim(false, 'resume'); 
				});
				
				// Run the onContentVisible callback function
				if (typeof(self.conf.onContentVisible) == 'function') { self.conf.onContentVisible.call(self, self.$tab); }
			});				
		},
		
		content_webKitSlide: function(animSpeed, easing) {
			this.$viewActive.css({'-webkit-transition-duration': animSpeed+'ms', '-webkit-transition-timing-function': easing, '-webkit-transform': this.content.pre + this.val.animVal + this.content.px});			
			this.$view.css({'-webkit-transition-duration': animSpeed+'ms', '-webkit-transition-timing-function': easing, '-webkit-transform': 'translate3d(0px,0px,0px)'});
		},
		
		content_bindWebKitCallback: function(slideback) {
			var self = this;
			
			self.$currentView.bind('webkitTransitionEnd', function() {
				self.$currentView.unbind('webkitTransitionEnd');
				
				// Position the previous view div(s) outside the viewport in case the content resizes
				if (slideback) { self.content_slideBackRePos(); }
				else { self.content_rePositionView(); }
				
				self.content_setIsAnim(false, 'resume');
				
				// Run the onContentVisible callback function
				if (typeof(self.conf.onContentVisible) == 'function') { self.conf.onContentVisible.call(self, self.$tab); }
			});
		},
		
		content_slideH: function(animSpeed) {
			var self = this;
			
			self.val.wh = self.$contentCont.width();
			self.content_setSlideValues();
							
			if (self.val.useWebKit) {
				if (animSpeed > 0) { self.content_webKitSlide(animSpeed, 'ease-out'); } 
				else {
					self.$view.css({'-webkit-transition-duration': '0ms', '-webkit-transform': 'translate3d(' + self.val.cssVal + 'px,0px,0px)'}); // Pre-position the next view
					setTimeout(function() { self.content_webKitSlide(self.conf.contentAnimSpeed, 'ease-in-out'); }, 30);
				}
			} else {
				if (animSpeed > 0) { self.val.easing = 'easeOutSine'; } 
				else {
					self.$view.css('left', self.val.cssVal);
					animSpeed = self.conf.contentAnimSpeed; 
					self.val.easing = self.conf.contentEasing;
				}
								
				self.$viewActive.animate({'left': self.val.animVal}, animSpeed, self.val.easing);
				self.$view.animate({'left': '0px'}, animSpeed, self.val.easing, function() {
					// Position the previous div outside the viewport in case the content resizes
					self.content_rePositionView();
					
					self.content_setIsAnim(false, 'resume');
					
					// Run the onContentVisible callback function
					if (typeof(self.conf.onContentVisible) == 'function') { self.conf.onContentVisible.call(self, self.$tab); }
				});
			}
		},
		
		content_slideV: function(animSpeed) {
			var self = this;
			
			self.val.wh = self.$contentCont.height();
			if (self.content.height > self.val.wh) { self.val.wh = self.content.height; } // Check if the content container's height has been set larger by the adjustHeight function
			self.content_setSlideValues();
			
			if (self.val.useWebKit) {
				if (animSpeed > 0) { self.content_webKitSlide(animSpeed, 'ease-out'); } 
				else {
					self.$view.css({'-webkit-transition-duration': '0ms', '-webkit-transform': 'translate3d(0px,' + self.val.cssVal + 'px,0px)'});
					setTimeout(function() { self.content_webKitSlide(self.conf.contentAnimSpeed, 'ease-in-out'); }, 30);
				}
			} else {
				if (animSpeed > 0) { self.val.easing = 'easeOutSine'; } 
				else {
					self.$view.css('top', self.val.cssVal);
					animSpeed = self.conf.contentAnimSpeed; self.val.easing = self.conf.contentEasing;
				}
				
				self.$viewActive.animate({'top': self.val.animVal}, animSpeed, self.val.easing);
				self.$view.animate({'top': '0px'}, animSpeed, self.val.easing, function() {
					// Position the previous div outside the viewport in case the content resizes
					self.content_rePositionView();
					
					self.content_setIsAnim(false, 'resume');
					
					// Run the onContentVisible callback function
					if (typeof(self.conf.onContentVisible) == 'function') { self.conf.onContentVisible.call(self, self.$tab); }
				});
			}
		},
		
		content_setSlideValues: function() {
			if (this.tabs.loop != false) {
				this.content.isNext = (this.tabs.loop == 'next') ? true : false; 
			} else { 
				this.content.isNext = (this.$viewActive.index() < this.$view.index()) ? true : false; 
			}
							
			if (this.content.isNext) { 
				this.val.animVal = -this.val.wh;
				this.val.cssVal = this.val.wh;
			} else { 
				this.val.animVal = this.val.wh;
				this.val.cssVal = -this.val.wh;
			}
		},
		
		content_setIsAnim: function(isAnim, play) {
			this.content.isAnim = isAnim;
			if (this.conf.autoplay) { this['autoplay_'+play](false, true); }
		},
	
		
		/* 
		 * Autoplay Methods
		 */
		autoplay_init: function() {
			this.val.index = (this.$tabActive.index() >= 0) ? this.$tabActive.index() : 0;
			this.isPause = false;
								
			this.autoplay_setInterval();
		},
		
		autoplay_setInterval: function() {
			var self = this;
			
			self.autoplay_clearInterval();
			// Set the new interval
			self.intervalId = setInterval(function() { self.autoplay_nextTab(); }, self.conf.autoplayInterval);
		},
		
		autoplay_clearInterval: function() {				
			// Clear previous interval
			clearInterval(this.intervalId);
		},
		
		autoplay_nextTab: function() {
			// Clear the interval if the main container is hidden or removed
			if (!this.$container.is(':visible')) {
				this.autoplay_clearInterval();
				return false;
			}
			
			// Set the next tab's index				
			this.val.index++; 
			if (this.val.index == this.$a.length) { this.val.index = 0; }				
			
			// Trigger the click event for the next tab
			if (this.conf.tabsLoop == true) { this.tabs_click($(this.$a[this.val.index]), false, 0, 'next'); }
			else { this.tabs_click($(this.$a[this.val.index])); }
		},
		
		autoplay_pause: function(organic) {
			if (organic) { this.conf.autoplay = false; }
			
			this.isPause = true;
			this.autoplay_clearInterval();
		},
		
		autoplay_resume: function(organic) {
			if (organic) { this.conf.autoplay = true; }
			
			this.isPause = false;
			this.autoplay_setInterval(); // Set new interval
		},
		
		
		/*
		 * API
		 */
		addTab: function(tab, cont, show) {
			var tabs = this.tabs;
			
			if ($(tabs.animated).length) { return false; }
			
			tabs.total++;
			tabs.slug = 'tab-' + tabs.total;
			this.tabs_setUniqueSlug(tabs.slug);
						
			this.$a.last().removeClass('st_tab_last').parents('li').removeClass('st_li_last'); // Remove the 'last' classes from the current last tab
			
			// Append the markup
			this.$tabs.append('<li><a href="#' + tabs.slug + '" rel="' + tabs.slug + '" class="' + this.conf.classTab + ' st_tab_' + tabs.total + '">' + tab + '</a></li>');
			this.$content.append('<div class="' + tabs.slug + ' ' + this.conf.classView + '"><div class="' + this.conf.classViewInner + '">' + cont + '</div></div>');
						
			// Set the following variables again to include the appended content
			this.$lis = this.$tabs.children('li');
			this.$li = this.$lis.last();
			this.$liLast = this.$li;
			this.$a = this.$lis.find('a');
			this.$views = this.$content.children('.'+this.conf.classView);
			
			// Is this the first tab?
			if (tabs.total == 1) {
				this.$content.children('div').addClass(this.conf.classViewActive).css('position', 'absolute').css(this.content.css, this.content.pre + '0' + this.content.px);
				this.$a.addClass('st_tab_first '+this.conf.classTabActive).parent('li').addClass('st_li_first '+this.conf.classTabActiveParent);
			} else {
				var styles = {};
				styles['position'] = 'absolute';
				if (this.conf.contentAnim) { styles[this.content.css] = this.content.pre + this.conf.viewportOffset + this.content.px; } 
				else { styles['visibility'] = 'hidden'; }
								
				this.$content.children('div').last().css(styles); // Set the appended content div to position absolute and position it according to the config
				this.$a.last().addClass('st_tab_last').parent('li').addClass('st_li_last'); // Add the 'last' classes to the appended tab
			}
			
			/*if (!this.$container.hasClass(this.conf.classTabSlidingEnabled)) { */tabs.tabsOrgWidth = this.tabs_getTotalLength();/* }*/ // Set a new original width of the tabs (for comparing the width difference in tabs_setAutoWidth())
			
			this.tabs_showAppended(show);
						
			if (this.val.isTouch) {
				this.tabs_setSwipeLength(); // Set the new swipe length
				if (this.content.animIsSlide) { this.content_bindTouch(); } // Bind the content's touch event
			}
		},
		
		removeTab: function(index) {
			if ($(this.content.animated).length) { return false; }
			
			var length = this.$tabs.children('li').length;
			
			index = index >= 1 ? index-1 : length-1;
			this.$li = this.$tabs.children('li').eq(index);
														
			// Check if the tab being removed is the 'active' tab
			if (this.$li.children('a').hasClass(this.conf.classTabActive)) {				
				var $prevTab;
				
				if (index == 0) {
					$prevTab = this.$li.next().addClass('st_li_first'); // Set the next tab to 'active' if the first one is being removed
					$prevTab = $prevTab.length > 0 ? $prevTab.children('a').addClass('st_tab_first') : this.$li.children('a'); // If the next tab doesn't exist, get the current one
				} else { 
					$prevTab = this.$li.prev().children('a');
				}
					
				this.val.hash = this.tabs_getHash($prevTab);
																		
				$prevTab.parents('li').addClass(this.conf.classTabActiveParent); // Add active class to the parent li
				$prevTab.addClass(this.conf.classTabActive); // Add active class to the tab link
															
				this.$view = this.$content.children('.'+this.val.hash).show().css(this.content.css, this.content.pre + '0' + this.content.px).addClass(this.conf.classViewActive); // Show the previous tab's content
				this.$currentView = this.$view;
				
				if (this.conf.autoHeight == true) { this.content_setHeight(true); }
								
				this.$tab = this.$li.prev().children('a.'+this.conf.classTab); // Set the previous tab as the active tab
			} 
						
			if (this.$li.hasClass('st_li_last')) { this.$li.prev().addClass('st_li_last').children('a').addClass('st_tab_last'); }
			
			this.$li.remove(); // Remove the last tab
			this.$content.children('div').eq(index).remove(); // Remove the last content
											
			var totLength = this.tabs_getTotalLength(); // Get the total size of the tabs
			
			// Get the new position
			if (totLength > /*this.val.tabsSlideLength*/this.$tabsCont[this.val.outerWH](false) - this.conf.offsetBR) {
				this.margin = totLength - this.val.tabsSlideLength + this.conf.offsetBR;
				// Add/remove active classes
				if (this.conf.buttonsFunction == 'slide') { this.tabs_enableButton(this.$prev); this.tabs_disableButton(this.$next); }
				else { if ((length-2) == this.$tab.parents('li').index()) { this.tabs_disableButton(this.$next); } }
			} else {
				this.margin = 0;
				this.$prev.hide(); this.$next.hide(); // Hide the prev/next buttons
				this.$container.removeClass(this.conf.classTabSlidingEnabled);
				this.tabs.tabsOrgWidth = this.tabs_getTotalLength(); // Set a new original width when tab sliding is disabled
				this.tabs_setSlideLength();
			}								
										
			this.tabs_animate(300); // Animate with the new value
			
			// Set the following variables again to include the appended content
			this.$lis = this.$tabs.children('li');
			this.$liLast = this.$lis.last();
			this.$a = this.$lis.find('a');
			this.$views = this.$content.children('.'+this.conf.classView);
			this.tabs.total = this.$a.length; // Set the total tab count so we can increment it later if a new tab is added
			
			if (this.val.isTouch) { this.tabs_setSwipeLength(); } // Set the new swipe length
		},
		
		goTo: function(idx) {
			var $target = this.$a.eq(idx-1);
			if ($target.length) { this.tabs_click($target); }
		},
		
		goToPrev: function() { this.tabs_clickPrev(); },
		goToNext: function() { this.tabs_clickNext(); },
		
		slidePrev: function() { this.tabs_slidePrev(); },
		slideNext: function() { this.tabs_slideNext(); },
		
		setOptions: function(new_config) {
			$.each(new_config, function(key, value) {
				if (value == 'true') { new_config[key] = true; } 
				else if (value == 'false') { new_config[key] = false; }
			});
			
			var initContent = (new_config.contentAnim != this.conf.contentAnim) ? true : false;
						
			this.conf = $.extend(true, {}, this.conf, new_config); // Extend the config object with the new settings
			
			this.content.animIsSlide = (new_config.contentAnim == 'slideH' || new_config.contentAnim == 'slideV') ? true : false;
			
			if (new_config.tabsSlideLength > 0) { 
				this.tabs_setSlideLength();
				if (this.val.isTouch) { this.tabs_setSwipeLength(); }
			}

			// Re-init the directional buttons according to the directional buttons function
			if (new_config.buttonsFunction == 'click') { this.tabs_setButtonState(); } 
			else if (new_config.buttonsFunction == 'slide') { this.$liLast = this.$tabs.children('li:last'); this.tabs_initButtons(); }
			
			// Re-init the directional buttons according to the loop setting
			if (new_config.tabsLoop == true) { this.tabs_enableButton(this.$prev); this.tabs_enableButton(this.$next); }
			else if (new_config.tabsLoop == false) { this.tabs_initButtons(); }
			
			// Set/unset scrolling 
			if (this.conf.tabsScroll == true) { 
				var self = this;
				
				self.$tabs.mousewheel(function(event, delta) {
					(delta > 0) ? self.tabs_slidePrev() : self.tabs_slideNext(); return false;
				});
			} else if (this.conf.tabsScroll == false) {
				this.$tabs.unmousewheel();
			}
			
			if (new_config.autoHeight == true) { this.content_setContentHeight(); }
			else if (new_config.autoHeight == false) { this.content_resetAutoHeight(); }
									
			if (initContent) { this.content_reInit(); }
						
			if (this.val.isTouch) {
				if (this.content.animIsSlide) { this.content_bindTouch(); } 
				else { this.content_unbindTouch(); }
			} else {
				if (new_config.touchSupport == true) {
					// Check for touch support
					if ('ontouchstart' in window) {
						this.val.isTouch = true;
						this.tabs_bindTouch(); this.content_bindTouch(); 
					}
				} else if (new_config.touchSupport == false) { 
					this.tabs_unbindTouch(); this.content_unbindTouch(); 
				}
			}
		},
				
		setContentHeight: function() {
			this.content_setHeight(true);
		},
				
		pauseAutoplay: function() {
			this.autoplay_pause(true);
		},
				
		resumeAutoplay: function() {
			this.autoplay_resume(true);
		},
		
		// Remove the tabs functionality and return back to the pre-init state
		destroy: function() {
			this.autoplay_clearInterval();
						
			this.$tabs.undelegate('li a.'+this.conf.classTab, 'click').css(this.val.css, this.val.pre+'0'+this.val.px);						
			
			this.$prev.unbind('click'); this.$next.unbind('click');
			
			this.tabs_hideButtons();
			
			if ($.fn.unmousewheel) { this.$tabs.unmousewheel(); }
						
			if (this.val.isTouch) {
				this.tabs_unbindTouch();
				this.content_unbindTouch();
			}
			
			$('a.'+this.conf.classExtLink).each(function() { $(this).unbind('click'); });
		},
		
		getSettings: function() {
			return this.conf;
		}
		
	};
		
	$.stCore = SlideTabs.prototype;
	
	$.fn.slidetabs = function(client_config) {
		var container,
			conf = $.extend(true, {}, $.fn.slidetabs.defaults, client_config),
			returnArr = [];
					
		this.each(function() {
			container = this;
			
			// Check if the plugin has already been instantiated
			if (!container.slidetabs) {
				// Create a new instance
				container.slidetabs = new SlideTabs($(container), conf);
			}            			
			
			returnArr.push(container.slidetabs);
		});
	  
		return returnArr.length > 1 ? returnArr : returnArr[0];
	};
	
	$.fn.slidetabs.defaults = {
		ajaxCache: true,
		ajaxError: 'Failed to load content.',
		ajaxSpinner: false,
		
		autoplay: false,
		autoplayClickStop: false,
		autoplayInterval: 5000,
		
		autoHeight: false,
		autoHeightSpeed: 0,
		
		buttonsFunction: 'slide',				
		
		classAutoplayCont: 'st_autoplay',
		classBtnDisabled: 'st_btn_disabled',
		classBtnNext: 'st_next',
		classBtnPrev: 'st_prev',
		classExtLink: 'st_ext',
		classNoTouch: 'st_no_touch',
		classTab: 'st_tab',
		classTabActive: 'st_tab_active',
		classTabActiveParent: 'st_li_active',
		classTabSlidingEnabled: 'st_sliding_active',
		classTabsContainer: 'st_tabs',			
		classTabsList: 'st_tabs_ul',
		classView: 'st_view',
		classViewActive: 'st_view_active',
		classViewInner: 'st_view_inner',
		classViewsContainer: 'st_views',
		classViewsInner: 'st_views_wrap',				
		
		contentAnim: 'slideH',
		contentAnimSpeed: 600,
		contentEasing: 'easeInOutExpo',
		
		externalLinking: false,
		
		offsetBR: 0, // beta
		offsetTL: 0, // beta
		
		onAjaxComplete: null,
		onContentVisible: null,
		onTabClick: null,
		onTabNextSlide: null,
		onTabPrevSlide: null,
		
		orientation: 'horizontal',
		
		responsive: false,
				
		tabsAnimSpeed: 300,								
		tabsEasing: '',
		tabsLoop: false,
		tabsSaveState: false,
		tabsScroll: true,
		tabsShowHash: false,
		tabsSlideLength: 0,
		tabsToSlide: 1,
		
		totalHeight: '',
		totalWidth: '',
		
		touchSupport: false,
		
		urlLinking: false,
		
		useWebKit: true,
		
		viewportOffset: '2560'
	};

})(jQuery);