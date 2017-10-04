/* Quick Links 
** Desktop code
*/

jQuery(document).ready(function($) {

	var quickLinks = $('.nav-quicklinks-holder');
	
	if(quickLinks.length > 0){
		var subMenus = quickLinks.find('.collapsible__body');
		
		if(new winprops().screen > 1140){
			offsetRight(subMenus, quickLinks);
		}

		$(window).resize($.debounce(150, function(event) {
			var _s = new winprops().screen > 1140;
			if(_s){
				offsetRight(subMenus, quickLinks);
			}
		}));

	}
});

function offsetRight(arr, parentEl){
	var parentPosRight = parentEl[0].offsetWidth + parentEl.offset().left;
	// console.log(parentPosRight);
	arr.each(function(i){
		if($(this).parent().hasClass("drop-left")) $(this).parent().removeClass("drop-left");

		var pos = this.offsetWidth + $(this).offset().left;
		// console.log(pos);
		
		if(pos > parentPosRight){
			$(this).parent().addClass("drop-left");
		}
	});

}
