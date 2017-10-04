jQuery(document).ready(function($) {
	// Start - MEDIACORPXIN-1273
	var scrollTopBtn = $("#scroll-top-button");
	var scrollTopBtnAll = $("#scroll-top-button-all");
	if(scrollTopBtn.length){
		// if($(window).width()>760){
			scrollTopBtn.click(function() {
				$("html, body").animate({scrollTop:0}, "300", "swing");
			});

			$(document).scroll(function() {
				var y = $(this).scrollTop();
				if (y > 700) {
				scrollTopBtn.stop().fadeIn(200);
				} else {
				scrollTopBtn.stop().fadeOut(200);
				}

			});
		// }
	}
	// End - MEDIACORPXIN-1273

	// Start -  http://jira.toggle.sg/browse/TGPUB-8
	if(scrollTopBtnAll.length){
		if($(window).width()>760){$(document).scroll(function() {
				var y = $(this).scrollTop();
				if (y > 700) {
				scrollTopBtnAll.stop().fadeIn(200);
				} else {
				scrollTopBtnAll.stop().fadeOut(200);
				}

			});
			scrollTopBtnAll.click(function() {
				$("html, body").animate({scrollTop:0}, "300", "swing");
			});

			$(document).scroll(function() {
				var y = $(this).scrollTop();
				if (y > 700) {
				scrollTopBtnAll.stop().fadeIn(200);
				} else {
				scrollTopBtnAll.stop().fadeOut(200);
				}

			});
		}
	}
	// End - http://jira.toggle.sg/browse/TGPUB-8
});

// //Shared buttons on articles
// jQuery(document).ready(function($) {
// 	var share_btns = $(".article__meta .article__social-media-buttons");
// 	if(share_btns.length){
// 		var share_btns_pos = share_btns.offset().top;
// 		var screen_prop = function(){
// 			var article = $("article");
// 			var article_h = article.height() - share_btns.height();
// 			var article_left_pos = article.offset().left;
// 			var article_top_pos = article.offset().top;
// 			var article_right_pos = $("body").width() - ( article_left_pos + article.outerWidth() );

// 			return {
// 				article_right_pos : article_right_pos,
// 				share_btns_pos : share_btns_pos,
// 				article_h : article_h
// 			};
// 		};
// 		var sp = new screen_prop();
// 		$( window ).resize(function() {
// 			sp = new screen_prop();
// 			recalculate_pos();
// 			console.log(sp.article_right_pos);
// 		});
// 		console.log(sp.article_right_pos);

// 		var el = $(".article__social-media-buttons");
// 		$(document).scroll(function() {
// 			recalculate_pos();
// 		});	

		
// 	}

// 	function recalculate_pos(){
// 		var y = $(this).scrollTop();
// 		if (y > share_btns_pos) {
// 			if(y > sp.article_h){
// 				el.css({
// 		            position: "absolute",
// 		            right:0,
// 		            bottom:250,
// 		            top:"",
// 		            width: 32,
// 		            zIndex: 69	         
// 		        });
// 				console.log("else");
// 			}else{
// 				console.log("fixed");
// 				el.css({
// 		            position: "fixed",
// 		            right: sp.article_right_pos - 2,
// 		            bottom: "",
// 		            top: 50,
// 		            width: 32,
// 		            zIndex: 69
// 		        });
// 			}
// 		}else{
// 			el.css({
// 	            position: "initial",
// 	            right: "initial",
// 	            bottom: "initial",
// 	            top:"",
// 	            width: "initial",
// 	          });
// 		}
// 		console.log("y: "+ y + ", sp.share_btns_pos: "+sp.share_btns_pos+ ", sp.article_h: "+sp.article_h);
// 	}
// });