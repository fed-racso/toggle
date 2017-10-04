/*
 * SlideTabs - Touch Extension
 *
 * @version 1.0
 * 
 */

(function($) {
	
	$.extend($.stCore, {
		
		/* 
		 * Tabs Touch Interaction
		 */
		tabs_initTouch: function() {
			if (this.val.isTouch) {
				this.tabs_setSwipeLength();
				this.tabs.maxXY = 0 + this.conf.offsetBR; // Including offset
				
				this.tabs_bindTouch();
				
				this.tabs.isAnim = false;
				this.tabs.dist = 0;
			}
		},
		
		tabs_setSwipeLength: function() {
			var tabsTotWH = this.tabs_getTotalLength(),
				limitXY = (tabsTotWH - this.val.tabsSlideLength);
											
			this.tabs.minXY = -limitXY - this.conf.offsetTL; // Including offset
		},
		
		tabs_bindTouch: function() {
			var self = this;
			
			self.$a.unbind('dragstart').bind('dragstart', function() { return false; });
			self.$tabsInnerCont.unbind('touchstart').bind('touchstart', function(e) { self.tabs_touchStart(e); });
			//self.$tabsInnerCont.unbind('mousedown').bind('mousedown', function(e) { self.tabs_touchStart(e); });
		},
		
		tabs_unbindTouch: function() {
			this.$tabsInnerCont.unbind('touchstart');
		},
		
		tabs_touchStart: function(event) {
			if (this.tabs.isAnim) { event.preventDefault(); return false; }
			
			var self = this,
				te = event.originalEvent.touches;
			
			if (te && te.length == 1) { self.e = te[0]; } 
			else { return false; }
			// For mouse testing
			/*self.e = self.tabs_fixE(event);
			event.preventDefault();*/
						
			self.$doc.bind('touchmove', function(e) { self.tabs_touchMove(e); });
			self.$doc.bind('touchend', function(e) { self.tabs_touchEnd(e); });
			//self.$doc.bind('mousemove', function(e) { self.tabs_touchMove(e); });
			//self.$doc.bind('mouseup', function(e) { self.tabs_touchEnd(e); });
																												
			if (self.val.useWebKit) { self.$tabs.css('-webkit-transition-duration', '0'); }
								
			self.tabs.eXY = self.tabs.start = self.e[self.val.clientXY];
			
			if (self.val.useWebKit) { self.tabs.startXY = self.tabs_WebKitPosition(self.$tabs, self.val.arrPos); } 
			else { self.tabs.startXY = parseInt(self.$tabs.css(self.val.css)); }
							
			self.tabs.minMouseXY = self.tabs.eXY - self.tabs.startXY + self.tabs.minXY;
			self.tabs.maxMouseXY = self.tabs.minMouseXY + self.tabs.maxXY - self.tabs.minXY;
												
			self.tabs.acc = self.tabs.startXY;
			self.tabs.startTs = Date.now();

			return false;
		},
		
		tabs_touchMove: function(event) {
			event.preventDefault();
							
			var te = event.originalEvent.touches;
			
			if (te.length > 1) { return false; }
			this.e = te[0];
			// For mouse testing
			//this.e = this.tabs_fixE(event);
						
			var eXY = this.tabs.end = this.e[this.val.clientXY];
			
			// Set the max/min slide values
			eXY = Math.max(eXY, this.tabs.minMouseXY);
			eXY = Math.min(eXY, this.tabs.maxMouseXY);
			
			this.tabs.lastPos = this.tabs.currPos;
			
			this.tabs.dist = (eXY - this.tabs.eXY);
			
			if (this.tabs.lastPos != this.tabs.dist) {
				this.tabs.currPos = this.tabs.dist;
			}
							
			this.tabs.newXY = this.tabs.startXY + this.tabs.dist;
							
			if (Math.abs(this.tabs.end - this.tabs.eXY) > 0) {
				this.tabs_setIsAnim(true, 'pause');
			}
			
			this.$tabs.css(this.val.css, this.val.pre+this.tabs.newXY+this.val.px);
			
			var ts = Date.now();
			if (ts - this.tabs.startTs > 350) {
				this.tabs.startTs = ts;
				this.tabs.acc = this.tabs.startXY + this.tabs.dist;
			}
			
			return false;
		},

		tabs_touchEnd: function(event) {
			this.$doc.unbind('touchmove').unbind('touchend');
			//this.$doc.unbind('mousemove').unbind('mouseup');
			
			if (this.val.useWebKit) { this.tabs.endXY = this.tabs_WebKitPosition(this.$tabs, this.val.arrPos); } 
			else { this.tabs.endXY = parseInt(this.$tabs.css(this.val.css)); }
			this.tabs.endXY = (isNaN(this.tabs.endXY)) ? 0 : this.tabs.endXY;
			
			this.margin = Math.abs(this.tabs.endXY);
							
			var self = this,
				dist = Math.abs(this.tabs.dist);
						
			if (dist == 0) {
				if (this.margin == 0+this.conf.offsetTL) { 
					setTimeout(function() { 
						self.tabs.isAnim = false; 
					}, 100); 
				} else if (this.margin == Math.abs(this.tabs.minXY)) { 
					setTimeout(function() { 
						self.tabs.isAnim = false; 
					}, 100); 
				}
				return false;  
			}
															
			var time = Math.max(40, (Date.now()) - this.tabs.startTs),
				accDist = Math.abs(this.tabs.acc - this.tabs.endXY),
				speed = accDist / time,
				subtDist = Math.abs(this.val.tabsSlideLength - dist);
								
			this.tabs.swipeSpeed = Math.max((subtDist) / speed, 200);
			this.tabs.swipeSpeed = Math.min(this.tabs.swipeSpeed, 600);
			this.tabs.swipeSpeed = (isNaN(this.tabs.swipeSpeed)) ? 300 : this.tabs.swipeSpeed;
			
			if (this.margin == 0) {
				if (this.conf.buttonsFunction == 'slide' && !this.conf.tabsLoop) { this.tabs_disableButton(this.$prev); this.tabs_enableButton(this.$next); }
				setTimeout(function() { 
					self.tabs_setIsAnim(false, 'resume'); 
				}, 100);
				return false; 
			} else if (this.margin == Math.abs(this.tabs.minXY)) {
				if (this.conf.buttonsFunction == 'slide' && !this.conf.tabsLoop) { this.tabs_disableButton(this.$next); this.tabs_enableButton(this.$prev); }
				setTimeout(function() { 
					self.tabs_setIsAnim(false, 'resume'); 
				}, 100);
				return false;
			}
			
			if (dist > 30) { // Todo: change the distance limit depending on the tabs orientation
				if (this.tabs.start > this.tabs.end) {
					if (this.tabs.lastPos < this.tabs.currPos) { this.tabs_slideBack(this.tabs.swipeSpeed); return false; }
					this.tabs_slideNext(this.tabs.swipeSpeed);
				} else if (this.tabs.start < this.tabs.end) {
					if (this.tabs.lastPos > this.tabs.currPos) { this.tabs_slideBack(this.tabs.swipeSpeed); return false; }
					this.tabs_slidePrev(this.tabs.swipeSpeed);
				} else {
					this.tabs_slideBack(200); 
				}
			} else {
				this.tabs_slideBack(200);
			}
			
			this.tabs.dist = 0; // Reset the distance
			return false;
		},
		
		tabs_slideBack: function(animSpeed) {
			var self = this;
			
			if (self.val.useWebKit) {
				self.tabs_bindWebKitCallback();
				self.$tabs.css({'-webkit-transition-duration': animSpeed+'ms', '-webkit-transition-timing-function': 'ease-out'}).css(self.val.css, self.val.pre+self.tabs.startXY+self.val.px);
			} else {
				if (self.conf.orientation == 'horizontal') {
					self.$tabs.animate({'marginLeft': self.tabs.startXY+'px'}, animSpeed, 'easeOutSine', function() { 
						self.tabs_setIsAnim(false, 'resume'); 
					});
				} else {
					self.$tabs.animate({'marginTop': self.tabs.startXY+'px'}, animSpeed, 'easeOutSine', function() { 
						self.tabs_setIsAnim(false, 'resume'); 
					});
				}
			}
			
			self.margin = Math.abs(self.tabs.startXY);
		},
		
		
		/* 
		 * Content Touch Interaction
		 */
		content_initTouch: function() {
			if (this.val.isTouch) {
				if (this.$a.length > 1 && this.content.animIsSlide) {
					this.content.isTouch = true;
					
					this.content.startEvent = 'touchstart';
					this.content.moveEvent = 'touchmove';
					this.content.endEvent = 'touchend';
					this.content.cancelEvent = 'touchcancel';
					// For mouse testing
					/*this.content.startEvent = 'mousedown';
					this.content.moveEvent = 'mousemove';
					this.content.endEvent = 'mouseup';*/
										
					this.content_bindTouch();
				}
			}
		},
		
		content_bindTouch: function() {
			var self = this;
						
			self.$contentCont.find('.'+self.conf.classNoTouch).unbind('mousedown').unbind('touchstart').bind('mousedown touchstart', function(elem) { elem.stopImmediatePropagation(); });
			//self.$views.unbind('dragstart').bind('dragstart', function() { return false; });
			self.$views.unbind(this.content.startEvent).bind(this.content.startEvent, function(e) { self.content_touchStart(e); });
		},
		
		content_unbindTouch: function() {
			this.content.isTouch = false;
			this.$views.unbind(this.content.startEvent);
		},
		
		content_slideBack: function(animSpeed) {
			this.content.isAnim = true;
			
			var self = this;
			
			if (self.val.useWebKit) {
				self.content_bindWebKitCallback(true);
				
				self.$currentView.css({'-webkit-transition-duration': animSpeed+'ms', '-webkit-transition-timing-function': 'ease-out'}).css(self.content.css, self.content.pre + '0' + self.content.px);
				self.$prevView.css({'-webkit-transition-duration': animSpeed+'ms', '-webkit-transition-timing-function': 'ease-out'}).css(self.content.css, self.content.pre + -self.content.slideLength + self.content.px);
				self.$nextView.css({'-webkit-transition-duration': animSpeed+'ms', '-webkit-transition-timing-function': 'ease-out'}).css(self.content.css, self.content.pre + self.content.slideLength + self.content.px);
			} else {
				if (self.conf.contentAnim == 'slideV') {					
					self.$prevView.animate({'top': -self.content.slideLength+'px'}, animSpeed, 'easeOutSine');
					self.$nextView.animate({'top': self.content.slideLength+'px'}, animSpeed, 'easeOutSine');
					self.$currentView.animate({'top': '0px'}, animSpeed, 'easeOutSine', function() { 
						self.content_setIsAnim(false, 'resume');
						self.content_slideBackRePos();
					});
				} else {
					self.$prevView.animate({'left': -self.content.slideLength+'px'}, animSpeed, 'easeOutSine');
					self.$nextView.animate({'left': self.content.slideLength+'px'}, animSpeed, 'easeOutSine');
					self.$currentView.animate({'left': '0px'}, animSpeed, 'easeOutSine', function() { 
						self.content_setIsAnim(false, 'resume');
						self.content_slideBackRePos();
					});
				}
			}
		},
						
		content_slideBackRePos: function() {
			if (this.val.useWebKit) {
				this.$prevView.css('-webkit-transition-duration', '0ms');
				this.$nextView.css('-webkit-transition-duration', '0ms');
			}
			
			this.$prevView.css(this.content.css, this.content.pre + this.conf.viewportOffset + this.content.px);
			this.$nextView.css(this.content.css, this.content.pre + this.conf.viewportOffset + this.content.px);
		},
						
		content_touchStart: function(event) {
			if (this.content.isAnim || this.tabs.isAnim || this.tabs.xhr) { return false; }
			if (this.content.isMoving) { return false; }
															
			var self = this,
				te = event.originalEvent.touches;
			
			if (te && te.length > 0) { 
				this.e = te[0];
				this.content.isMoving = true;
			} else { return false; }
			// For mouse testing
			/*this.e = this.tabs_fixE(event);
			event.preventDefault();*/
									
			this.content.dirCheck = false; // dirCheck not always reset
			
			this.$doc.bind(this.content.moveEvent, function(e) { self.content_touchMove(e); });
			this.$doc.bind(this.content.endEvent, function(e) { self.content_touchEnd(e); });
			//this.$currentView.bind(this.content.cancelEvent, function(e) { this.content_touchEnd(e, true); });
								
			this.$prevView = this.$currentView.prev('div');
			this.$nextView = this.$currentView.next('div');

			// Set the swiping limits
			var limitXY = parseInt(self.$contentCont.css(this.content.wh));
			this.content.minXY = -limitXY;
			this.content.maxXY = limitXY;
			
			this.content.prevViewWH = -this.$prevView[this.content.owh](false);
			this.content.nextViewWH = this.$contentCont[this.content.wh]();
			
			if (this.val.useWebKit) {
				this.$currentView.css('-webkit-transition-duration', '0');
				this.$prevView.css('-webkit-transition-duration', '0');
				this.$nextView.css('-webkit-transition-duration', '0');
			}
							
			// Get pageX and pageY for checking the swiping direction later
			this.content.eX = this.e.pageX;
			this.content.eY = this.e.pageY;
			
			this.content.eXY = this.content.start = this.e[this.content.clientXY];
								
			this.content.startXY = parseInt(this.$currentView.css(this.content.css));
			this.content.startXY = (isNaN(this.content.startXY)) ? 0 : this.content.startXY;
											
			this.content.minMouseXY = this.content.eXY - this.content.startXY + this.content.minXY;
			this.content.maxMouseXY = this.content.minMouseXY + this.content.maxXY - this.content.minXY;
												
			this.content.acc = this.content.startXY;
			this.content.startTs = Date.now();
		},
		
		content_touchMoveReturn: function() {
			this.$currentView.css(this.content.css, this.content.pre + 0 + this.content.px);
			this.$prevView.css(this.content.css, this.content.pre + this.content.prevViewWH + this.content.px);
			this.$nextView.css(this.content.css, this.content.pre + this.content.nextViewWH + this.content.px);
			
			this.content_setIsAnim(false, 'resume');
		},
		
		content_touchDir: function(e, horAnim) {
			var offset = (Math.abs(e.pageX-this.content.eX) - Math.abs(e.pageY-this.content.eY)) - (horAnim ? -5 : 5);
			if (offset > 5) { return 'x'; } // Horizontal swipe
			else if (offset < -5) { return 'y'; } // Vertical swipe
		},
		
		content_touchMove: function(event) {
			if (this.content.dirBlock) { return; } // Block swiping if the page is currently moving
			
			this.autoplay_pause(false);
							
			var te = event.originalEvent.touches;
			
			if (te.length > 1) {
				this.content_touchEnd(event); // 'touchend' not triggering in Chrome for Android
				return;
			} else { this.e = te[0]; }
			// For mouse testing
			//this.e = this.tabs_fixE(event);

			// Check the swiping direction -make sure this is placed directly after getting the touch event (e)
			if (!this.content.dirCheck) {
				var horAnim = (this.conf.contentAnim == 'slideH') ? true : false,
					dir = this.content_touchDir(this.e, horAnim);
																				
				if (dir == 'x') {
					if (horAnim) { event.preventDefault(); }
					else {
						this.content.dirBlock = true; // Block the y-axis if vertical sliding is enabled
						this.content_touchEnd(this.e, true);
					}
					
					this.content.dirCheck = true;
				} else if (dir == 'y') {
					if (horAnim) {
						this.content.dirBlock = true; // Block the x-axis if horizontal sliding is enabled
						this.content_touchEnd(this.e, true);
					} else { event.preventDefault(); }
					
					this.content.dirCheck = true;
				}
									
				return;
			}
			
			event.preventDefault(); // Prevent default -after- the direction check
															
			var eXY = this.content.end = this.e[this.content.clientXY];
			
			// Set the max/min slide values
			eXY = Math.max(eXY, this.content.minMouseXY);
			eXY = Math.min(eXY, this.content.maxMouseXY);
			
			this.content.lastPos = this.content.currPos;
			this.content.dist = (eXY - this.content.eXY);
			
			if (this.content.lastPos != this.content.dist) { this.content.currPos = this.content.dist; }
							
			if (!this.$prevView.length) {
				if (this.content.dist > 0) {
					this.content_touchMoveReturn();
					return false;
				}
			} else if (!this.$nextView.length) {
				if (this.content.dist < 0) {
					this.content_touchMoveReturn();
					return false;
				}
			}
			
			this.content.newXY = this.content.startXY + this.content.dist;
			
			var prevXY = this.content.newXY + this.content.prevViewWH,
				nextXY = this.content.newXY + this.content.nextViewWH;
							
			this.$currentView.css(this.content.css, this.content.pre + this.content.newXY + this.content.px);
			this.$prevView.css(this.content.css, this.content.pre + prevXY + this.content.px);
			this.$nextView.css(this.content.css, this.content.pre + nextXY + this.content.px);

			var ts = Date.now();
			if (ts - this.content.startTs > 350) {
				this.content.startTs = ts;
				this.content.acc = this.content.startXY + this.content.dist;
			}
		},

		content_touchEnd: function(event, cancel) {
			this.$doc.unbind(this.content.moveEvent).unbind(this.content.endEvent);
			//this.$currentView.unbind(this.content.cancelEvent);
			
			this.content.isMoving = false;
			this.content.dirBlock = false;
			this.content.dirCheck = false;
			
			if (cancel) { return; }
			
			this.content.slideLength = this.$contentCont[this.content.wh]();
							
			var dist = Math.abs(this.content.dist), endXY;
						
			if (this.val.useWebKit) { endXY = this.tabs_WebKitPosition(this.$currentView, this.content.arrPos); }
			else { endXY = parseInt(this.$currentView.css(this.content.css)); }
			endXY = (isNaN(endXY)) ? 0 : endXY;
						
			if (dist == 0 || endXY == 0) {
				this.content_slideBackRePos(); // Make sure the prev/next views are repositioned
				return false;
			}
							
			var time = Math.max(40, (Date.now()) - this.content.startTs),
				accDist = Math.abs(this.content.acc - this.content.dist),
				speed = accDist / time,
				subtDist = Math.abs(this.content.slideLength - dist);
			
			var self = this;
				
			this.content.swipeSpeed = Math.max((subtDist) / speed, 200);
			this.content.swipeSpeed = Math.min(this.content.swipeSpeed, 600);
			this.content.swipeSpeed = (isNaN(this.content.swipeSpeed)) ? 300 : this.content.swipeSpeed;
			
			if (dist > 60) {
				var $newTab;
									
				if (this.content.start > this.content.end) {
					if (this.content.lastPos < this.content.currPos) { this.content_slideBack(this.content.swipeSpeed); return false; }
					$newTab = this.$tab.parent('li').next('li').children('a');
				} else if (this.content.start < this.content.end) {
					if (this.content.lastPos > this.content.currPos) { this.content_slideBack(this.content.swipeSpeed); return false; }
					$newTab = this.$tab.parent('li').prev('li').children('a');
				}
				
				if ($newTab && $newTab.length) {
					this.tabs_click($newTab, false, this.content.swipeSpeed);
				} else {
					this.content_slideBack(200);
				}
				
				if (dist == this.content.maxXY) {
					this.content_setIsAnim(false, 'resume');
					this.content_rePositionView(); // Make sure the prev/next views are repositioned
				}
			} else {
				this.content_slideBack(200);
			}
			
			this.content.dist = 0; // Reset the distance
			return false;
		}
	});
	
	$.stExtend.tabsTouch = $.stCore.tabs_initTouch;
	$.stExtend.contentTouch = $.stCore.content_initTouch;

})(jQuery);