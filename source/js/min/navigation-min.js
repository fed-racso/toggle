function mouseIsOverWorkaround(e){var n=$(e).parent().find(":hover");return n.length}function toggleOffCanvasMenu(){var e=$(".body");e.toggleClass("primary-menu-open")}function closeOffCanvasMenu(){var e=$(".body");e.removeClass("primary-menu-open")}function toggleLocalNav(){var e=$(".local-nav-label"),n=$(".nav--local").find(".nav"),o=$(".nav--local").find(".nav__video-extras");n.toggleClass("is-open"),e.toggleClass("is-open"),n.slideToggle(400)}function showLocalNav(){var e=$(".local-nav-label"),n=$(".nav--local").find(".nav"),o=$(".nav--local").find(".nav__video-extras");n.addClass("is-open"),e.addClass("is-open"),n.show(),console.log("test")}function closeLocalNav(){var e=$(".local-nav-label"),n=$(".nav--local").find(".nav");n.removeClass("is-open"),e.removeClass("is-open")}function closeModal(){var e=$(".modal-overlay"),n=$(".modal");e.removeClass("is-open"),n.removeClass("is-open")}function closeMegaMenu(){setTimeout(function(){var e=$(".mega-menu--primary-nav"),n=$(".nav--primary").find(".nav--primary__desktop").find(".nav"),o=e.find(".megamenu__item"),a=mouseIsOverWorkaround(n[0]),i=mouseIsOverWorkaround(e[0]);i||a||(e.removeClass("is-open"),setTimeout(function(){o.removeClass("is-open"),n.find("li").find("a").removeClass("is-active")},300))},1)}function isIE(e,n){var o="IE",a=document.createElement("B"),i=document.documentElement,s;return e&&(o+=" "+e,n&&(o=n+" "+o)),a.innerHTML="<!--[if "+o+']><b id="iecctest"></b><![endif]-->',i.appendChild(a),s=!!document.getElementById("iecctest"),i.removeChild(a),s}function getLocalNavTop(e){return e.length?e.offset().top:void 0}function setLocalNavTop(e){phoenixVars.localNavTop=getLocalNavTop(e)}function togglePrimaryNavItems(e){var n=$(".wrap").width(),o=$(".nav--primary"),a=o.find(".nav--primary__logo"),i=o.find(".user-actions"),s=o.find(".nav").children().last().width(),t=n-i.width()-a.width()-s-50,l=t;_.forEach(e,function(n,o){var a=e[o];l-=a.width,l>=0?(a.show=!0,a.$el.css("display","block")):(a.show=!1,a.$el.css("display","none"))})}function setMegaMenuHeight(e){imagesLoaded(e,function(){var n=e.siblings("a").outerHeight(),o=e.outerHeight(),a=n+o-20;e.closest("ul").css("height",a)})}function insertMegaMenuItems(e){var n=e.find(".l-4up"),o=n.attr("data-url")||null,a=n.attr("data-fetch-completed")||null;o&&!a&&$.ajax({url:o}).done(function(e){n.append(e),setMegaMenuHeight(n),n.attr("data-fetch-completed","true")})}jQuery(document).ready(function($){var e=$(".primary-nav-toggle"),n=$(".parental-lock");e.on("click",function(e){e.preventDefault(),e.stopPropagation(),toggleOffCanvasMenu(),closeLocalNav(),closeModal()}),$("html").on("click",function(e){e.preventDefault(),closeOffCanvasMenu()}),n.on("click",function(e){e.preventDefault(),console.log("test"),$(this).toggleClass("is-active")})}),jQuery(document).ready(function($){var e=$(".nav--primary__mobile"),n=e.children(),o=n.children("li").children(),a=$(".mobile__subnav-back");e.on("click","li",function(e){$(this).children("ul").addClass("is-open")}),a.on("click",function(e){o.removeClass("is-open"),e.stopPropagation()}),e.on("click",function(e){e.stopPropagation()})}),jQuery(document).ready(function($){var e=$(".search-form-holder"),n=$(".user-actions").find(".search-button"),o=e.find(".search-form"),a=e.find(".search-close");n.on("click",function(n){n.preventDefault(),e.addClass("is-open"),o.find("input").focus()}),a.on("click",function(n){n.preventDefault(),n.stopPropagation(),e.removeClass("is-open"),o.find("input").focusout()})}),jQuery(document).ready(function($){var e=$(".pnav__has-dropdown");e.on("click",function(e){e.preventDefault(),e.stopPropagation();var n=$(this);console.log($(this)),n.toggleClass("is-open"),n.siblings().removeClass("is-open")}),$("html").on("click",function(n){n.preventDefault(),e.removeClass("is-open")})}),jQuery(document).ready(function($){$(window).load(function(){var e=$(".nav--primary").find(".nav"),n=0;e.children().not(":last-child").each(function(e,o){var a={$el:$(o),width:$(o).width(),show:!1};n=$(o).width(),phoenixVars.navItems.push(a)}),togglePrimaryNavItems(phoenixVars.navItems),$(window).resize(function(){togglePrimaryNavItems(phoenixVars.navItems)})})}),jQuery(document).ready(function($){var e=$(".mega-menu--primary-nav"),n=$(".nav--primary").find(".nav--primary__desktop").find(".nav"),o=$(".nav--local");n.on("mouseenter","li",function(n){n.preventDefault();var a=$(this),i=a.index(),s=a.find("a"),t=a.siblings().find("a"),l=s.attr("class").split(" ")[0],c=e.find(".megamenu__item");s.hasClass("is-active")||(t.removeClass("is-active"),s.addClass("is-active")),e.hasClass("is-open")||e.addClass("is-open"),c.hide().eq(i).show().find("li").removeClass("is-active").eq(0).addClass("is-active"),e.attr("data-background",l),setMegaMenuHeight(c.eq(i).find("li").eq(0).find(".l-4up")),setTimeout(function(){setLocalNavTop(o)},400)}),e.on("mouseleave",closeMegaMenu),n.on("mouseleave",closeMegaMenu),e.find("li").on("mouseenter",function(e){return e.preventDefault(),insertMegaMenuItems($(this)),$(this).addClass("is-active").siblings().removeClass("is-active hover-on-more"),$(this).hasClass("more")?($(this).siblings().eq(0).addClass("is-active hover-on-more"),!1):void 0}),e.find("li").on("mouseleave",function(e){e.preventDefault(),$(this).hasClass("more")&&($(this).removeClass("is-active"),$(this).siblings().removeClass("hover-on-more"))})}),jQuery(document).ready(function($){var e=$(".nav--local"),n=e.children("div");e.length&&imagesLoaded($(window),function(){setLocalNavTop(e),$(window).scroll(function(){$(window).scrollTop()>phoenixVars.localNavTop?(e.css({position:"fixed",top:0}),n.addClass("page-wrap")):(e.css({position:"absolute"}),n.removeClass("page-wrap"))})})}),jQuery(document).ready(function($){function e(e,n){$(window).width()>1140?(n.addClass("is-desktop"),e.hide()):(n.removeClass("is-desktop"),e.show())}var n=$(".local-nav-label"),o=$(".nav--local").find(".nav__list"),a=o.find(".dropdown"),i=o.children().length-1,s,t;n.on("click",function(){toggleLocalNav(),closeOffCanvasMenu(),closeModal()}),i>phoenixVars.localNavMoreLimit&&(s=o.children().not(".nav__video-extras").slice(phoenixVars.localNavMoreLimit,-1),t=s.clone(),t.appendTo(a.children("ul"))),s&&t&&(e(s,a),$(window).resize(function(){e(s,a),$(window).width()>1140&&showLocalNav()}))}),jQuery(document).ready(function($){var e=$("#account"),n=$(".modal-overlay"),o=$(".modal"),a=$(".modal__login"),i=$("body").hasClass("logged-in"),s=$(".modal__close");e.on("click",function(e){e.preventDefault(),i||(n.addClass("is-open"),o.addClass("is-open"),closeOffCanvasMenu(),closeLocalNav())}),o.on("click",function(e){e.stopPropagation()}),n.on("click",function(e){closeModal()}),s.on("click",function(e){closeModal()})});