/********
 * Functions for Navigation
 ********/

/**
 * Workaround for jQuery .is(:hover)
 * @param  {dom-element} what [element to check for hover]
 * @return {[type]}      [description]
 */
function mouseIsOverWorkaround(what) {
  var temp = $(what).parent().find(":hover");
  // return temp.length == 1 && temp[0] == what;
  return temp.length;
}

/**
 * Toggles Off Canvas Menu On and Off
 */
function toggleOffCanvasMenu() {
  var $body = $('.body');
  if ($body.hasClass('primary-menu-open')) {
    $body.removeClass('primary-menu-open');
    $('.nav--primary__mobile').find('ul').removeClass('is-open');
  } else {
    $body.addClass('primary-menu-open');
  }
}

function closeOffCanvasMenu() {
  var $body = $('.body');
  $body.removeClass('primary-menu-open');
  $('.nav--primary__mobile').find('ul').removeClass('is-open');
}

function closePrimaryNavDropdown() {
  $('.pnav__has-dropdown').removeClass('is-open');
}

/**
 * Toggles Local Nav On and Off
 */
function toggleLocalNav() {
  var $localNavToggle = $('.local-nav-label');
  var $localNav = $('.nav--local').find('.nav');
  var $localNavVideoExtras = $('.nav--local').find('.nav__video-extras');
  $localNav.toggleClass('is-open');
  $localNavToggle.toggleClass('is-open');
  $localNav.slideToggle(400);
  // $localNavVideoExtras.toggle(400);
}

function showLocalNav() {
  var $localNavToggle = $('.local-nav-label');
  var $localNav = $('.nav--local').find('.nav');
  var $localNavVideoExtras = $('.nav--local').find('.nav__video-extras');
  $localNav.addClass('is-open');
  $localNavToggle.addClass('is-open');
  $localNav.show();
  // $localNavVideoExtras.toggle(400);
}

function closeLocalNav() {
  var $localNavToggle = $('.local-nav-label');
  var $localNav = $('.nav--local').find('.nav');
  $localNav.removeClass('is-open');
  $localNavToggle.removeClass('is-open');
  $localNav.hide();
}

function toggleQuickNav() {
  var $quicklinksNavToggle = $('.quicklinks-nav-label');
  var $quicklinksNav = $('.nav--quicklinks').find('.nav');
  var $quicklinksNavVideoExtras = $('.nav--quicklinks').find('.nav__video-extras');
  $quicklinksNav.toggleClass('is-open');
  $quicklinksNavToggle.toggleClass('is-open');
  $quicklinksNav.slideToggle(400);
  // $quicklinksNavVideoExtras.toggle(400);
}

/**
 * Closes Modal Windows
 */
function closeModal() {
  var $modalOverlay = $('.modal-overlay'),
    $modal = $('.modal');

  $modalOverlay.removeClass('is-open');
  $modal.removeClass('is-open');
}

/**
 * Close Mega Menu
 */
function closeMegaMenu() {
  // Requires a timeout for Firefox to properly register hoverout 
  setTimeout(function() {
    var $megaMenu = $('.mega-menu--primary-nav');
    var $navMenu = $('.nav--primary').find('.nav--primary__desktop').find('.nav');
    var $megaMenuItems = $megaMenu.find('.megamenu__item');

    var isHoverOverPnav = mouseIsOverWorkaround($navMenu[0]);
    var isHoverOverMegamenu = mouseIsOverWorkaround($megaMenu[0]);

    if (!isHoverOverMegamenu && !isHoverOverPnav) {
      $megaMenu.removeClass('is-open');
      setTimeout(function() {
        $megaMenuItems.removeClass('is-open');
        $navMenu.find('li').find('a').removeClass('is-active');
      }, 300);
    }
  }, 1);
}

//EnhanceJS isIE test idea

//detect IE and version number through injected conditional comments (no UA detect, no need for cond. compilation / jscript check)

//version arg is for IE version (optional)
//comparison arg supports 'lte', 'gte', etc (optional)

function isIE(version, comparison) {
  var cc = 'IE',
    b = document.createElement('B'),
    docElem = document.documentElement,
    isIE;

  if (version) {
    cc += ' ' + version;
    if (comparison) {
      cc = comparison + ' ' + cc;
    }
  }

  b.innerHTML = '<!--[if ' + cc + ']><b id="iecctest"></b><![endif]-->';
  docElem.appendChild(b);
  isIE = !!document.getElementById('iecctest');
  docElem.removeChild(b);
  return isIE;
}

/**
 * Gets the absolute top position of the local Nav to fix the nav
 * @param  {jQuery Object} localNav
 * @return {int}
 */
function getLocalNavTop(localNav) {
  if (localNav.length) {
    return localNav.offset().top;
  }
}

function setLocalNavTop(localNav) {
  if (localNav.length) {
    phoenixVars.localNavTop = getLocalNavTop(localNav);
  }
}

/**
 * Function that hides / shows primary navigation item on desktops depending browser width
 * @param  {array} navMenuItems [Array of objects containing widths of all navigational items (except for "More" )]
 */
function togglePrimaryNavItems(navMenuItems) {
  var wrapWidth = $('.header .wrap').width(),
    $navMenu = $('.nav--primary'),
    $logo = $navMenu.find('.nav--primary__logo'),
    $actions = $navMenu.find('.user-actions'),
    moreWidth = $navMenu.find('.nav').children().last().width(),
    // Possible Menu Width 
    // 50 is to make room for available spacing on left & right (rhythm(2.5))
    menuWidth = wrapWidth - $actions.width() - $logo.width() - moreWidth - 50,
    availableMenuWidth = menuWidth;

  _.forEach(navMenuItems, function(el, index) {

    var currentItem = navMenuItems[index];
    availableMenuWidth -= currentItem.width;

    if (availableMenuWidth >= 0) {
      currentItem.show = true;
      currentItem.$el.css('display', 'block');
    } else {
      currentItem.show = false;
      currentItem.$el.css('display', 'none');
    }
  });
}


function setMegaMenuHeight($container) {
  imagesLoaded($container, function() {
    // sets Height
    var subnavHeight = $container.siblings('a').outerHeight();
    var containerHeight = $container.outerHeight();
    var height = subnavHeight + containerHeight - 20;

    $container.closest('ul').css('height', height);
  });
}

/**
 * Ajax Include Megamenu items
 */
function insertMegaMenuItems($el) {
  var $ajaxContainer = $el.find('.l-4up');
  var ajaxUrl = $ajaxContainer.attr('data-url') || null;
  var fetchCompleted = $ajaxContainer.attr('data-fetch-completed') || null;

  if (ajaxUrl && !fetchCompleted) {
    $.ajax({
        beforeSend: function(xhr) {
          $ajaxContainer.attr('data-fetch-completed', 'fetching');
        },
        url: ajaxUrl,
      })
      .done(function(data) {
        $ajaxContainer.append(data);
        setMegaMenuHeight($ajaxContainer);

        // sets fetch as completed
        $ajaxContainer.attr('data-fetch-completed', 'true');
      });
  }
}


/*********
 * Primary Navigation
 *********/

// Primary Nav Off canvas layout
jQuery(document).ready(function($) {
  var $primaryNavToggle = $('.primary-nav-toggle');
  var $parentalLock = $('.parental-lock');

  $primaryNavToggle.on('click', function(event) {
    event.preventDefault();
    event.stopPropagation();
    toggleOffCanvasMenu();
    //closeLocalNav();
    closeModal();
  });

  // // Closes all dropdowns when clicked outside
  // $('html').on('click', function(event) {
  //   event.preventDefault();
  //   closeOffCanvasMenu();
  // });

  $parentalLock.on('click', function(event) {
    event.preventDefault();
    $(this).toggleClass('is-active');
  });
});

// Primary Nav Mobile
jQuery(document).ready(function($) {
  var $primaryNavMobile = $('.nav--primary__mobile'),
    $mobileNavFirstLevel = $primaryNavMobile.children(),
    $mobileNavSecondLevel = $mobileNavFirstLevel.children('li').children(),
    $mobileBackButton = $('.mobile__subnav-back');

  $primaryNavMobile.on('click', 'li', function(event) {
    $(this).children('ul').addClass('is-open');
  });


  $mobileBackButton.on('click', function(event) {
    $mobileNavSecondLevel.removeClass('is-open');
    event.stopPropagation();
  });

  // Prevents propagation of events up to body
  $primaryNavMobile.on('click', function(event) {
    event.stopPropagation();
  });
});


// Primary Nav Search
jQuery(document).ready(function($) {
  var $userActions= $('.user-actions'), //TGTHREE-102
    $primarySearch = $('.search-form-holder'),
    $searchButton = $('.user-actions').find('.search-button'),
    $searchForm = $primarySearch.find('.search-form'),
    $searchClose = $primarySearch.find('.search-close');

  $searchButton.on('click', function(event) {
    event.preventDefault();
    /* Act on the event */
    // $(this).children().children().toggleClass('i-search i-search-close');

    // $userActions.css( "position", "initial" );//TGTHREE-102
    // $searchButton.css( "position", "initial" );//TGTHREE-102
    $primarySearch.addClass('is-open');
    $searchForm.find('input').focus();
  });

  $searchClose.on('click', function(event) {
    event.preventDefault();
    event.stopPropagation();
    // $userActions.css( "position", "relative" );//TGTHREE-102
    // $searchButton.css( "position", "absolute" );//TGTHREE-102
    $primarySearch.removeClass('is-open');
    $searchForm.find('input').focusout();
  });
});

// Primary Nav Dropdowns
jQuery(document).ready(function($) {
  var $pnavDropdownParent = $('.pnav__has-dropdown');

  $pnavDropdownParent.on('click', function(event) {
    //event.preventDefault();
    event.stopPropagation();
    var $el = $(this);
    $el.toggleClass('is-open');
    $el.siblings().removeClass('is-open');
  });

  // Closes all dropdowns when clicked outside
  // $('html').on('click', function(event) {
  //   event.preventDefault();
  //   $pnavDropdownParent.removeClass('is-open');
  // });
});

// Primary Menu (hiding / showing stuff on screen resize on desktop)

jQuery(document).ready(function($) {
  // uses load to make sure CSS is already painted before calculating width 
  $(window).load(function() {
    var $menu = $('.nav--primary').find('.nav');

    var test = 0;
    $menu.children().not(':last-child').each(function(index, el) {
      var item = {
        $el: $(el),
        width: $(el).width(),
        show: false,
      };
      test = $(el).width();1
      phoenixVars.navItems.push(item);
    });

    togglePrimaryNavItems(phoenixVars.navItems);

    // // Patch for In skin
    // setTimeout(function(){  
    //   // console.log("loaded");
    //   // console.log(document.querySelector('.in-skin') != null);
    //   if(document.querySelector('.in-skin') != null){
    //     var _ms = document.querySelectorAll('.megaslider');
    //     if(_ms.length){
    //       $.fn.updateSliders(_ms);
    //     }
    //     $(window).trigger('resize');
    //   }
    // }, 0);
    // // End  - Patch for In skin

    $(window).resize(function() {
      togglePrimaryNavItems(phoenixVars.navItems);
    });
  });
});

// Mega Menu (Main Menu)
jQuery(document).ready(function($) {
  var $megaMenu = $('.mega-menu--primary-nav');
  var $navMenu = $('.nav--primary').find('.nav--primary__desktop').find('.nav');
  var $navLocal = $('.nav--local');

  function openMegaMenu(event) {
    event.preventDefault();
    var $el = $(this),
      hoveredIndex = $el.index(),
      $hoveredItem = $el.find('a'),
      $hoveredSiblings = $el.siblings().find('a'),
      hoveredClass = $hoveredItem.attr('class').split(' ')[0],
      $megaMenuItems = $megaMenu.find('.megamenu__item');

    // Mouse Over gives current item active state and removes siblings active state 
    if (!$hoveredItem.hasClass('is-active')) {
      $hoveredSiblings.removeClass('is-active');
      $hoveredItem.addClass('is-active');
    }

    // Opens Megamenu if not already opened 
    if (!$megaMenu.hasClass('is-open')) {
      $megaMenu.addClass('is-open');
    }

    // Opens the hovered megamenu item
    $megaMenuItems
      .hide()
      .eq(hoveredIndex)
      .show()
      .find('li')
      .removeClass('is-active')
      .eq(0)
      .addClass('is-active');

    $megaMenu.attr('data-background', hoveredClass);
    // insertMegaMenuItems($megaMenuItems.eq(hoveredIndex).find('li').eq(0));
    setMegaMenuHeight($megaMenuItems.eq(hoveredIndex).find('li').eq(0).find('.l-4up'));

    // Adds hovered theme to the megamenu class 

    // Changes local Nav top position
    setTimeout(function() {
      setLocalNavTop($navLocal);
    }, 400);
  }

  function closeMegaMenu() {
    // Requires a timeout for Firefox to properly register hoverout 
    setTimeout(function() {
      var $megaMenu = $('.mega-menu--primary-nav');
      var $navMenu = $('.nav--primary').find('.nav--primary__desktop').find('.nav');
      var $megaMenuItems = $megaMenu.find('.megamenu__item');

      var isHoverOverPnav = mouseIsOverWorkaround($navMenu[0]);
      var isHoverOverMegamenu = mouseIsOverWorkaround($megaMenu[0]);

      if (!isHoverOverMegamenu && !isHoverOverPnav) {
        $megaMenu.removeClass('is-open');
        setTimeout(function() {
          $megaMenuItems.removeClass('is-open');
          $navMenu.find('li').find('a').removeClass('is-active');
        }, 300);
      }
    }, 1);
  }

  function forceCloseMegaMenu() {
    setTimeout(function() {
      var $megaMenu = $('.mega-menu--primary-nav');
      var $navMenu = $('.nav--primary').find('.nav--primary__desktop').find('.nav');
      var $megaMenuItems = $megaMenu.find('.megamenu__item');
      $megaMenu.removeClass('is-open');
      setTimeout(function() {
        $megaMenuItems.removeClass('is-open');
        $navMenu.find('li').find('a').removeClass('is-active');
      }, 300);
    }, 1);
  }

  // create a noop function for hoverintent out
  function noop () {};

  $navMenu.hoverIntent({
    over: openMegaMenu,
    out: noop,
    selector: 'li',
    timeout: phoenixVars.navHoverDelay,
  });

  $navMenu.hoverIntent({
    over: noop,
    out: closeMegaMenu,
    timeout: phoenixVars.navHoverDelay,
    sensitivity: 100
  });

  $('.nav--primary').find('.user-li').hoverIntent({
    over: forceCloseMegaMenu,
    out: noop,
    timeout: phoenixVars.navHoverDelay,
  })

  $megaMenu.hoverIntent({
    over: noop,
    out: closeMegaMenu,
    timeout: phoenixVars.navHoverDelay,
  })


  // ----------
  // Hover in subnav item the correct sections
  // ----------

  megamenuMouseEnter = function(event) {
    event.preventDefault();
    insertMegaMenuItems($(this));
    $(this).addClass('is-active').siblings().removeClass('is-active hover-on-more');
    if ($(this).hasClass('more')) {
      $(this).siblings().eq(0).addClass('is-active hover-on-more');
      return false;
    }
  }

  megamenuMouseLeave = function(event) {
    event.preventDefault();
    if ($(this).hasClass('more')) {
      $(this).removeClass('is-active');
      $(this).siblings().removeClass('hover-on-more');
    }
  }

  $megaMenu.hoverIntent({
    over: megamenuMouseEnter,
    out: megamenuMouseLeave,
    selector: 'li',
    timeout: phoenixVars.navHoverDelay,
  })
});


/**********
 * Local Navigation
 *********/

// Local Nav
jQuery(document).ready(function($) {
  var $navLocal = $('.nav--local'),
    $localWrapper = $navLocal.children('div');

  if ($navLocal.length) {
    imagesLoaded($(window), function() {

      setLocalNavTop($navLocal);

      $(window).scroll(function() {
        if ($(window).scrollTop() > phoenixVars.localNavTop) {
          $navLocal.css({
            position: 'fixed',
            top: 0
          });
          $localWrapper.addClass('page-wrap');
        } else {
          $navLocal.css({
            position: 'absolute'
          });
          $localWrapper.removeClass('page-wrap');
        }
      });
    });
  }
});

// Checks Local Nav for More
jQuery(document).ready(function($) {
  var $localNavToggle = $('.local-nav-label');
  var $QuickNavToggle = $('.quicklinks-nav-label');

  if($localNavToggle.length || $QuickNavToggle.length){
    var $localNav = $('.nav--local').find('.nav__list');
    var $localNavMore = $localNav.find('.dropdown');
    var $moreItems, $moreItemsClone;
    // Total length is children length - more item
    // var localNavChildrenLength = $localNav.children().length - 1;
    // var moreLimit = parseInt($localNav.attr('data-more-limit'));

    // Initializes more item HTML
    $localNavToggle.on('click', function() {
      toggleLocalNav();
      closeOffCanvasMenu();
      closeModal();
    });

    //QuickNav
    $QuickNavToggle.on('click', function() {
      toggleQuickNav();
    });
    $('.nav--quicklinks__page-info').on('click', function() {
      if ($('.quicklinks-nav-label').css('display') != 'none') {
        toggleQuickNav();
      }
    });

    // Checks for # of items in local nav.
    // If # of items exceed specified amount, clones an the extra items into "More".
    // Hides "More" if on mobile, hides extra items on desktop

    // MEDIACORPXIN-1531
    // var w__ = /*$(window).width()*/ $('body > .page-wrap').width() - (($('.nav__video-extras').length)?$('.nav__video-extras').width():0);
    var quickmenu =  $(".nav-local-holder");
    // var quickmenu =  $(".nav-local-holder");
    var docwidth = ( quickmenu.find(".wrap").outerWidth() + quickmenu.find(".wrap")) + ( $(".skin--left")?$(".skin--left").width() * 2:0 );
    var dropdown = $(".nav--local .dropdown");
    var menus = quickmenu.find(".nav__list").find("> li").not(".dropdown");

    function filtered() {
      quickmenu.removeClass("has-more");
      return menus.filter(function(i, li) {
        var pos = li.offsetLeft + li.clientWidth + (dropdown.find("ul").outerWidth()+20) + $('.nav__video-extras').width();
        if ( pos > quickmenu.find(".wrap").outerWidth() ) {
          return li;
        }
      });
    }

    function moreMenu() {
      if (filtered().length) {
        filtered();
        dropdown.find("> ul").html(filtered().clone());
        filtered().hide();
        //dropdown.css('display', 'inline-block');
        quickmenu.addClass("has-more");
      } else {
        quickmenu.removeClass("has-more");
      }
    }

    if ( quickmenu.length && quickmenu.find(".wrap").outerWidth() + ( $(".skin--left")?$(".skin--left").width() * 2:0 ) >= 980 ) {
      moreMenu();
    }

    $(window).resize($.debounce(150, function(event) {
      if(quickmenu.length){
        menus.show();
        if ( quickmenu.length && quickmenu.find(".wrap").outerWidth() + ( $(".skin--left")?$(".skin--left").width() * 2:0 ) >= 980 ) {
          moreMenu();
        } else {
          if (dropdown) {
            quickmenu.removeClass("has-more");
          }
        }
      }
    }));
  }

});

/**********
 * Modal Windows
 **********/

// Modal Windows
jQuery(document).ready(function($) {
  var $account = $('#account'),
    $modalOverlay = $('.modal-overlay'),
    $modal = $('.modal'),
    $modalLogin = $('.modal__login'),
    loggedIn = $('body').hasClass('logged-in'),
    $modalClose = $('.modal__close');


  $account.on('click', function(event) {
    //event.preventDefault();
    if (!loggedIn) {
      $modalOverlay.addClass('is-open');
      $modal.addClass('is-open');
      closeOffCanvasMenu();
      closeLocalNav();
    }
  });

  // Closes all modal

  // Prevents bubbling of click events up to overlay
  $modal.on('click', function(event) {
    event.stopPropagation();
  });

  // Closes overlay if overlay is clicked while open
  $modalOverlay.on('click', function(event) {
    closeModal();
  });

  // Closes overlay if overlay is clicked while open
  $modalClose.on('click', function(event) {
    closeModal();
  });
});


//workaround to make hover menu always close when mouse out
// jQuery(document).ready(function($) {
//   $('.nav--primary__desktop').on('click', 'a', function(event) {
//     event.stopPropagation();
//   });

//   setInterval(function() {
//     var a = $(".mega-menu:hover").length;
//     var b = $(".mega-menu.is-open").length;
//     var c = $("ul.nav li:hover").length;

//     if(a == 0 && c == 0 && b > 0)
//       $(".mega-menu").removeClass("is-open");
//   }, 1000);
// });


var InSkinEvent = function(e, f, g) {
    if (f == 'adServed') {
        $(window).trigger('resize');
        var _ms = document.querySelectorAll('.megaslider');
        if(_ms.length){
          $.fn.updateSliders(_ms);
        }
        
    }
};