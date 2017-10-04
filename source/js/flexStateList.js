jQuery(document).ready(function($) {
	var _fsl = document.querySelector('#flexStateList') || 0;
    if (_fsl != 0) {

    	function createFlexList(){

    		var isScrolled = $(_fsl).find('.jspPane');
    		var _el = (isScrolled.length)?isScrolled:$('.flexStateList-list-content');
    		var _elH = _el.outerHeight();
    		var _f = $('.flexStateList-foot:visible').outerHeight() || 0;
			var _h = $('.flexStateList-list-wrap').outerHeight() - (_f + 10); 

			if(_elH > _h){
			    $('.flexStateList-list-content').height(_h);
			    $('.flexStateList-list-content').jScrollPane().css('visibility', 'visible');
			}else{
				if(isScrolled.length){
					var _lis = $('.jspPane').html();
					$('.jspScrollable, .jspContainer, .jspPane').removeAttr('style');
					$('.jspVerticalBar').hide();
				}

				$('.flexStateList-list-content').css('visibility', 'visible');
			}
		}

		createFlexList();
		$(window).resize($.debounce(150, function(event) {
		 	$('.flexStateList-list-content');
	      	createFlexList();
	  }));

	}

});
