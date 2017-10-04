jQuery(document).ready(function($){"use strict";var t=window.Slider||{};t=function(t){var e=this;return e.$element=$(t),e.options={gutterOutsideWidth:20,featuredItem:"featured-item",sliderItem:"slider-item",sliderRow:"slider-row",prevArrow:"slider-prev",nextArrow:"slider-next"},e.settings={currentItemIndex:0,currentDoubleRowIndex:0,currentLeft:0,gutterWidth:10,itemsFeatured:0,itemsToShow:null,itemsToSlide:1,itemWidth:200,itemFeaturedWidth:0,sliderWidth:0,totalItems:null,rows:1,$prevArrow:null,$nextArrow:null,$sliderRow:null},e.initialize(),e},t.prototype.initialize=function(){var t=this,e=$(window).width();t.buildWrap(),t.buildArrows(),t.setTotalItems(),t.updateSettings(e),$(window).resize($.debounce(150,!1,function(){var e=$(window).width();t.updateSettings(e),t.snapToItem()}))},t.prototype.updateSettings=function(t){var e=this;e.setGutterWidth(t),e.setItemsToShow(t),e.setItemsToSlide(),e.checkDoubleRow(t),e.setItemWidth(t),e.setItemCSS(),e.setSliderWidth(t)},t.prototype.buildWrap=function(){var t=this,e=t.$element;e.children().wrapAll('<div class="slider-wrap"><div class="'+t.options.sliderRow+'"></div></div>'),t.$sliderRow=e.find("."+t.options.sliderRow)},t.prototype.buildArrows=function(){var t=this,e=t.$element;e.append('<button class="'+this.options.prevArrow+'">prev</button><button class="'+this.options.nextArrow+'">next</button>'),t.$prevArrow=e.find("."+this.options.prevArrow),t.$nextArrow=e.find("."+this.options.nextArrow),t.$prevArrow.on("click",function(e){e.preventDefault(),e.data={message:"prev"},t.changeSlide(e)}),t.$nextArrow.on("click",function(e){e.preventDefault(),e.data={message:"next"},t.changeSlide(e)})},t.prototype.checkDoubleRow=function(t){var e=this,s=e.$element,i=s.find("."+e.options.featuredItem).length;i&&t>768?(e.settings.rows=2,e.settings.itemsFeatured=i):e.settings.rows=1},t.prototype.setGutterWidth=function(t){var e;switch(!0){case t>768:e=20;break;case t>480:e=15;break;default:e=10}this.settings.gutterWidth=e},t.prototype.setItemsToShow=function(t){var e;switch(!0){case t>1440:e=6;break;case t>1140:e=5;break;case t>768:e=4;break;case t>480:e=2.5;break;default:e=1.5}this.settings.itemsToShow=e},t.prototype.setItemsToSlide=function(){this.settings.itemsToSlide=Math.floor(this.settings.itemsToShow)},t.prototype.setItemWidth=function(t){var e=$(".wrap").width(),s=this,i,o=s.settings.itemsToShow,n=s.settings.gutterWidth,r=(o-1)*n;i=Math.floor((e-r)/o),s.settings.itemWidth=i,s.settings.itemsFeatured&&(s.settings.itemFeaturedWidth=t>768?2*i+n:i)},t.prototype.setTotalItems=function(){var t=this,e=t.$element;t.settings.totalItems=e.find("."+t.options.sliderItem).length},t.prototype.setSliderWidth=function(){var t=this,e=t.$sliderRow.find("."+t.options.sliderItem).last().position().left,s=e+t.settings.itemWidth;t.$sliderRow.css({width:s}),t.settings.sliderWidth=s},t.prototype.setItemCSS=function(){var t=this,e=t.$element,s=e.find("."+t.options.sliderItem),i=e.find("."+t.options.featuredItem),o=t.settings.itemFeaturedWidth,n=t.settings.gutterWidth,r=t.settings.itemWidth,d=0,l=9*r/16,a=9*o/16,u=0,h=0;1==t.settings.rows?s.each(function(e,s){t.setSingleRowCss(s,u,r,l),u+=r+n}):(s=s.not("."+t.options.featuredItem),i.each(function(e,s){t.setDoubleRowCss(s,h,u,o,a),u+=o+n}),d=u,s.filter(":even").each(function(e,s){t.setDoubleRowCss(s,h,u,r,l),u+=r+n}),u=d,h=9*o/16-9*r/16,s.filter(":odd").each(function(e,s){t.setDoubleRowCss(s,h,u,r,l),u+=r+n})),t.$sliderRow.css(1==t.settings.rows?{height:l}:{height:a})},t.prototype.setSingleRowCss=function(t,e,s,i){$(t).css({position:"absolute",top:0,left:e,width:s,height:i})},t.prototype.setDoubleRowCss=function(t,e,s,i,o){$(t).css({position:"absolute",top:e,left:s,width:i,height:o})},t.prototype.changeSlide=function(t){var e=this,s,i=e.settings.totalItems-1,o;switch(0==e.settings.currentItemIndex&&2==e.settings.rows?(o=e.settings.rows*e.settings.itemsToSlide-3*e.settings.itemsFeatured,console.log(o)):o=e.settings.rows*e.settings.itemsToSlide,t.data.message){case"prev":s=e.settings.currentItemIndex-o,s=s>0?s:0;break;case"next":s=e.settings.currentItemIndex+o,s+e.settings.rows*e.settings.itemsToSlide>i&&(s=i+1-e.settings.itemsToSlide*e.settings.rows);break;default:return!1}e.setLeft(s),e.settings.currentItemIndex=s},t.prototype.snapToItem=function(){var t=this,e=t.settings.currentItemIndex;t.setLeft(e)},t.prototype.setLeft=function(t){var e=this,s=e.$sliderRow.find("."+e.options.sliderItem).eq(t).position().left;e.$sliderRow.animate({left:-s},500)},$.fn.slider=function(){var e=this;return e.each(function(e,s){s.slider=new t(s)})}}),jQuery(document).ready(function($){var t=$(".slider").slider()});