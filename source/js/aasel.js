jQuery(document).ready(function($) {
  var Aasel = window.Aasel || {};

  Aasel = function(element, settings) {
    var A = this;
    var $el = $(element);
    A.$el = $el;
    A.$aaselItems = $el.find('.aasel__item');
    A.$aaselInnerItems = $el.find('.aasel__inner-item-holder');

    A.settings = {
      aaselMobileHeight: 0,
      aaselHeight: 0,
      currentLeft: 0,
      currentMobilePage: 1,
      currentPage: 1,
      gutterSize: '0',
      gutterSizePx: 0,
      HeightWidthRatio: '0.5625',
      itemWidths: {
        small: '25%',
        medium: '50%',
        large: '75%',
        half: '50%',
        full: '100%'
      },
      itemWidthsPx: {},
      itemHeightsPx: {},
      mobileGutterSize: '0',
      mobileGutterSizePx: 0,
      mobileItemsPerPage: 6,
      mobilePageLocations: [],
      mobileWrapWidth: 0,
      totalMobilePages: 0,
      totalPages: 4,
      wrapWidth: 0,
      autoScrollTimeInSeconds: 5,
	  autoScrollTimeout: null
    }

    A.aaselTypes = {
      six: $el.find('.aasel__item--6'),
      four: $el.find('.aasel__item--4'),
      two: $el.find('.aasel__item--2'),
      one: $el.find('.aasel__item--1')
    }

    A.settings = $.extend(true, A.settings, settings);

    A.initialize();

    return A;
  }

  Aasel.prototype.swipedetect = function(el, callback) {
    var touchsurface = el,
      swipedir,
      startX,
      startY,
      distX,
      distY,
      threshold = 150, //required min distance traveled to be considered swipe
      restraint = 100, // maximum distance allowed at the same time in perpendicular direction
      allowedTime = 300, // maximum time allowed to travel that distance
      elapsedTime,
      startTime,
      handleswipe = callback || function(swipedir) {}

    touchsurface.addEventListener('touchstart', function(e) {
      var touchobj = e.changedTouches[0]
      swipedir = 'none'
      dist = 0
      startX = touchobj.pageX
      startY = touchobj.pageY
      startTime = new Date().getTime() // record time when finger first makes contact with surface
      // e.preventDefault()

    }, false)

    touchsurface.addEventListener('touchmove', function(e) {
      // e.preventDefault() // prevent scrolling when inside DIV
    }, false)

    touchsurface.addEventListener('touchend', function(e) {
      var touchobj = e.changedTouches[0]
      distX = touchobj.pageX - startX // get horizontal dist traveled by finger while in contact with surface
      distY = touchobj.pageY - startY // get vertical dist traveled by finger while in contact with surface
      elapsedTime = new Date().getTime() - startTime // get time elapsed
      if (elapsedTime <= allowedTime) { // first condition for awipe met
        if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) { // 2nd condition for horizontal swipe met
          swipedir = (distX < 0) ? 'left' : 'right' // if dist traveled is negative, it indicates left swipe
        } else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint) { // 2nd condition for vertical swipe met
          swipedir = (distY < 0) ? 'up' : 'down' // if dist traveled is negative, it indicates up swipe
        }
      }
      handleswipe(swipedir)
      e.preventDefault()
    }, false)
  };

  Aasel.prototype.initialize = function() {
    var A = this;
    ww = $(window).width();

    A.buildWrap();
    A.setTotalPages();
    A.buildMobileClone();
    A.buildDotsAndArrows();
    A.setWrapWidth(ww);

    A.initDotStates();
    A.initArrowStates();

    A.updateSettings(ww);

    $(window).resize($.debounce(150, false, function() {
      ww = $(window).width()
      A.updateSettings(ww);
      A.arrowStates();
    }));

	A.$el.mouseover(function() {
		clearTimeout(A.autoScrollTimeout);
		A.autoScrollPaused = true;
	});
	A.$el.mouseleave(function() {
		A.autoScrollPaused = false;
		A.scrollLater();
	});

    A.swipedetect(A.$el.get(0), function(dir) {
      if (dir == "left")
        A.$next.trigger("click");
      else
        A.$prev.trigger("click");
    });

	A.scrollLater();
  };

  Aasel.prototype.scrollLater = function() {
	var A = this;
	clearTimeout(A.autoScrollTimeout);
	A.autoScrollTimeout = setTimeout(function() { A.$next.trigger("click"); }, A.settings.autoScrollTimeInSeconds * 1000); 
  };

  /**
   * updateSettings
   * - update all values to Aasel on viewport resize or initialize
   */
  Aasel.prototype.updateSettings = function(ww) {
    var A = this;
    A.setWrapWidth(ww);
    A.setGutterSize(ww);

    if (ww < 760) {
      // Mobile Stuff 
      A.setOuterLayout(A.settings.mobileWrapWidth);
      A.setMobileLocations(ww);
      A.setMobileCommonCss(ww);
      A.setAaselMobileHeight();
      A.setMobileBackgroundImage();

    } else {
      // Desktop Stuff 
      A.setOuterLayout(A.settings.wrapWidth);
      A.setCommonCss(A.settings.wrapWidth);

      A.positionAaselItems();

      A.setAaselHeight();
      A.setDesktopBackgroundImage();
    }

    A.setAaselArrowTop(); 
    A.SnapToClosest(ww);
  };

  // ==========
  // BUILDS
  // ==========

  /**
   * buildWrap
   * - Builds .aasel-wrap and .aasel-row divs
   */
  Aasel.prototype.buildWrap = function() {
    var A = this;
    var $el = A.$el;
    $el.children().wrapAll('<div class="aasel__wrap"><div class="aasel__row"></div></div>');

    // Adds wrap and row into A object
    A.$wrap = $el.find('.aasel__wrap');
    A.$row = $el.find('.aasel__row');

    // Build Mobile Wrappers 
    A.$el.prepend('<div class="aasel__mobile-wrap"><div class="aasel__mobile-row"></div></div>');

    A.$mobileWrap = $el.find('.aasel__mobile-wrap');
    A.$mobileRow = $el.find('.aasel__mobile-row');
  }

  Aasel.prototype.buildMobileClone = function() {
    var A = this;
    var aaselMobilePages = [];
    var aaselClones = _.cloneDeep(A.$aaselInnerItems);
    var outputHTML = '';

    A.settings.totalMobilePages = Math.ceil((A.$aaselInnerItems.length - 3) / A.settings.mobileItemsPerPage) + 1;

    // Creates X number of arrays according to the total number of pages 
    for (var i = 0; i < A.settings.totalMobilePages; i++) {
      aaselMobilePages.push([]);
    };

    // Place items into array to recreate mobile paging
    _.forIn(aaselClones, function(value, key) {

      if (isNaN(key)) {
        return;
      }

      // First key will always go into first div      
      switch (key) {
        case "0":
        case "1":
        case "2":
          aaselMobilePages[0].push(value);
          break;

        default:
          var num = Math.ceil((key - 2) / A.settings.mobileItemsPerPage);
          aaselMobilePages[num].push(value);
      }
    });

    // Converts aaselMobilePages array into the correct HTML format
    _.forEach(aaselMobilePages, function(aaselDivArray) {
      outputHTML += '<div class="aasel__mobile-item">'
      _.forEach(aaselDivArray, function(aaselItem) {
        outputHTML += aaselItem.outerHTML;
      });
      outputHTML += '</div>'
    });

    // Outputs mobile HTML
    A.$mobileRow.append(outputHTML);

    // Saves mobile stuff to A for easy access. 
    A.$aaselMobileItems = A.$el.find('.aasel__mobile-item');
    A.$aaselMobileInnerItems = A.$aaselMobileItems.find('.aasel__inner-item-holder');

    if (((A.$aaselInnerItems.length - 3) % A.settings.mobileItemsPerPage) != 0)
      A.settings.totalMobilePages--;

    // sets all data-dotdot to 1 (except for first)
    A.$aaselMobileInnerItems.find('.item__title').slice(1).attr('data-dotdot', '1');
  };

  Aasel.prototype.buildDotsAndArrows = function() {
    var A = this;

    // Append arrow div
    A.$el.append('<div class="aasel__arrows"></div>');
    A.$arrows = A.$el.find('.aasel__arrows');

    // Add left arrow
    A.$arrows.append('<a href="#" class="aasel__prev"><i class="ti-slider-prev"></i></a>');

    // Add right arrow 
    A.$arrows.append('<a href="#" class="aasel__next"><i class="ti-slider-next"></i></a>');

    A.$el.append('<div class="aasel__dots-holder">');
    A.$dotHolder = A.$el.find('.aasel__dots-holder');

    A.$dotHolder.append('<div class="aasel__dots"></div>');

    // Append dots
    A.$dots = A.$el.find('.aasel__dots');

    // Mobile wrap 
    A.$dots.append('<div class="dots__mobile"></div>');
    A.$mobileDots = A.$dots.find('.dots__mobile')
    for (var i = A.settings.totalMobilePages; i >= 1; i--) {
      A.$mobileDots.append('<div class="dot"></div>');
    };

    // Desktop wrap
    A.$dots.append('<div class="dots__desktop"></div>');
    A.$desktopDots = A.$dots.find('.dots__desktop')

    for (var i = A.settings.totalPages; i >= 1; i--) {
      A.$desktopDots.append('<div class="dot"></div>');
    };

    // Adds arrows to A object 
    A.$prev = A.$el.find('.aasel__prev');
    A.$next = A.$el.find('.aasel__next');

    // Arrow events
    A.$prev.on('click', function(event) {
      event.preventDefault();
      event.data = {
        message: 'prev'
      }
	  clearTimeout(A.autoScrollTimeout);

      A.changePage(event);
      A.dotStates();
      A.arrowStates();
	  
	  if(!A.autoScrollPaused)
		A.scrollLater();
    });

    A.$next.on('click', function(event) {
      event.preventDefault();
      event.data = {
        message: 'next'
      }
	  clearTimeout(A.autoScrollTimeout);

      A.changePage(event);
      A.dotStates();
      A.arrowStates();

	  if(!A.autoScrollPaused)
		A.scrollLater();
    });

    // Dot events 
    $('.aasel__dots').on('click', '.dot', function(event) {
      event.preventDefault();
      /* Act on the event */

      var $el = $(this);
      var index = $el.index();

	  clearTimeout(A.autoScrollTimeout);

      A.goToPage(index);
      A.dotStates();
      A.arrowStates();

	  if(!A.autoScrollPaused)
		A.scrollLater();
    });
  };

  // ==========
  // SETS
  // ==========

  /**
   * Sets Outer Layout
   * - Aasel outer layout is straightforward. Every item has a absolute position is placed to the right of the previous item
   */
  Aasel.prototype.setOuterLayout = function(wrapWidth) {
    var A = this;
    var aItemPosLeft = 0;
    // Set aaselItem position for mobile 
    _.forEach(A.$aaselMobileItems, function(el) {
      $(el).css({
        left: aItemPosLeft,
        width: wrapWidth
      });
      aItemPosLeft += wrapWidth;
    });

    // Set aaselItem position for desktop
    _.forEach(A.$aaselItems, function(el) {
      $(el).css({
        left: aItemPosLeft,
        width: wrapWidth
      });
      aItemPosLeft += wrapWidth;
    });
  }

  /**
   * setGutterSize
   * - Changes gutterSize from a percentage to pixel.
   */
  Aasel.prototype.setGutterSize = function(ww) {
    var A = this;
    A.settings.gutterSizePx = Math.floor(ww * parseFloat(A.settings.gutterSize) / 100);
    A.settings.mobileGutterSizePx = Math.floor(ww * parseFloat(A.settings.mobileGutterSize) / 100);
  };

  // Set Total Number of Pages for both Mobile and Desktop
  Aasel.prototype.setTotalPages = function() {
    var A = this;
    A.settings.totalPages = A.$aaselItems.length;
    // console.log(A.settings.totalMobilePages);
  };

  Aasel.prototype.setWrapWidth = function(ww) {
    var A = this;
    A.settings.wrapWidth = parseInt(A.$wrap.css('width'));
    A.settings.mobileWrapWidth = parseInt(A.$mobileWrap.css('width'));
  };
  /**
   * setMobileCommonCss
   * - Sets the common CSS for all aasel inner items.
   */
  Aasel.prototype.setMobileCommonCss = function(ww) {
    var A = this,
      $el = A.$el;

    var itemWidth = Math.floor(parseFloat('50%') * ww / 100)
    var itemHeight = Math.floor(itemWidth * A.settings.HeightWidthRatio);

    // Common Mobile items are on page 2 and above
    A.$aaselMobileItems.slice(1).children().css({
      width: itemWidth,
      height: itemHeight,
      padding: A.settings.mobileGutterSizePx
    });

    // First page of mobile items
    A.$aaselMobileItems.eq(0).children().css({
      width: itemWidth,
      height: itemHeight,
      padding: A.settings.mobileGutterSizePx
    });
    A.$aaselMobileItems.eq(0).children().eq(0).css({
      width: '100%',
      height: itemHeight * 2,
    });

    A.settings.aaselMobileHeight = itemHeight * 3;
  }

  /**
   * setCommonCss
   * - Sets the common CSS for all aasel inner items.
   */
  Aasel.prototype.setCommonCss = function(wrapWidth) {
    var A = this;

    // Loops through itemWidths and sets width values
    _.forEach(A.settings.itemWidths, function(value, key) {
      var itemWidth = Math.floor(parseFloat(value) * wrapWidth / 100)
      var itemHeight = Math.floor(itemWidth * A.settings.HeightWidthRatio);

      // Adjust item Width of medium to always be a multiple of 2. 
      // Pushes 1px gap to the right instead of hanging it in the middle on 6 items
      if (key === 'medium') {
        if (itemWidth % 2 === 1) {
          itemWidth -= 1
        }
      }

      // Adjust large item to 3x height of small item
      if (key === 'large') {
        itemHeight = A.settings.itemHeightsPx.small * 3;
      }

      A.settings.itemWidthsPx[key] = itemWidth;
      A.settings.itemHeightsPx[key] = itemHeight;

      A.$row.find('.item--' + key).css({
        'width': itemWidth,
        'height': itemHeight
      });

      if (key === 'half' || key === 'full') {
        A.$row.find('.item--' + key).css({
          height: A.settings.itemHeightsPx.large,
        });
      }
    });

    // Sets position absolute for all aasel inner items 
    A.$aaselInnerItems.css({
      position: 'relative',
      padding: A.settings.gutterSizePx
    });
  }

  /**
   * setAaselMobileHeight
   * - Sets the height of the aasel__mobile-wrap
   */
  Aasel.prototype.setAaselMobileHeight = function(ww) {
    var A = this;

    A.$mobileRow.css({
      height: A.settings.aaselMobileHeight,
    })
  };

  Aasel.prototype.positionAaselItems = function() {
    var A = this;

    _.forEach(A.$aaselItems, function(val, key) {
      var $el = $(val);
      var xPos = 0;
      var yPos = 0;

      if ($el.hasClass('aasel__item--6')) {
        // Items 1 and 6 are of medium size,
        // Items 2,3,4 and 5 are of small size. 

        _.forEach($el.children(), function(val, index) {

          switch (index) {
            case 0:
              break;
            case 1:
              xPos = xPos + A.settings.itemWidthsPx.medium;
              break;
            case 2:
              xPos = xPos + A.settings.itemWidthsPx.medium + A.settings.itemWidthsPx.small;
              break;
            case 3:
              yPos = A.settings.itemHeightsPx.medium;
              break;
            case 4:
              xPos = xPos + A.settings.itemWidthsPx.small;
              yPos = A.settings.itemHeightsPx.medium;
              break;
            case 5:
              xPos = xPos + A.settings.itemWidthsPx.medium;
              yPos = A.settings.itemHeightsPx.small;
              break;
            default:
              return false;
          }

          A.setInnerItemCss($(val), xPos, yPos);

          // Resets X & Y Pos 
          xPos = 0;
          yPos = 0;

        });

      } else if ($el.hasClass('aasel__item--4')) {

        _.forEach($el.children(), function(val, index) {
          switch (index) {
            case 0:
              break;
            case 1:
              xPos = A.settings.itemWidthsPx.large;
              break;
            case 2:
              xPos = A.settings.itemWidthsPx.large;
              yPos = A.settings.itemHeightsPx.small;
              break;
            case 3:
              xPos = A.settings.itemWidthsPx.large;
              yPos = A.settings.itemHeightsPx.small * 2;
              break;
            default:
              return false;
          }

          A.setInnerItemCss($(val), xPos, yPos);

          // Resets X & Y Pos 
          xPos = 0;
          yPos = 0;

        });
      }

    });
  };

  /**
   * setAaselHeight
   * - Sets the height of the Aasel Wrap
   * - Aasel height is always the height of a large-sized-item (75% of width)
   */
  Aasel.prototype.setAaselHeight = function(ww) {
    var A = this;
    var fullSizeWidth = A.settings.itemWidthsPx.full;
    var largeSizeHeight = A.settings.itemHeightsPx.large;
    var gutteredSpace = A.settings.gutterSizePx * 2;
    A.$wrap.css({
      'transform': 'scale(' + (largeSizeHeight + gutteredSpace) / largeSizeHeight + ',' + (fullSizeWidth + gutteredSpace) / fullSizeWidth + ')'
    });

    A.$row.css({
      height: largeSizeHeight,
    })

    A.settings.aaselHeight = largeSizeHeight;
  };

  Aasel.prototype.setBackgroundImage = function(attr, $viewportRow, gutterSizePx) {
    var A = this;
    var $images = $viewportRow.find('[' + attr + ']');

    _.forEach($images, function(el) {
      var imageWidth = parseInt($(el).closest('.aasel__inner-item-holder').css('width'));
      var imageHeight = parseInt($(el).closest('.aasel__inner-item-holder').css('height'));

      $(el).css({
        width: Math.floor(imageWidth - gutterSizePx * 2),
        height: Math.floor(imageHeight - gutterSizePx * 2),
        backgroundImage: 'url("' + $(el).attr(attr) + '")'
      })
    });
  };

  /**
   * setMobileBackgroundImage
   * - Sets background image size of Aasel images to 16x9 height
   */
  Aasel.prototype.setMobileBackgroundImage = function() {
    var A = this;
    A.setBackgroundImage('aasel-mobile-background-image', A.$mobileRow, A.settings.mobileGutterSizePx);

    // Sets 1st page image to 100% width, no padding
    A.$aaselMobileItems.eq(0).find('.item__image').css({
      width: '100%',
      padding: 0
    });
  };

  /**
   * setDesktopBackgroundImage
   * - Sets background image size of Aasel images to 16x9 height
   */
  Aasel.prototype.setDesktopBackgroundImage = function() {
    var A = this;
    A.setBackgroundImage('aasel-background-image', A.$row, A.settings.gutterSizePx);
  };

  /**
   * setLeftDesktop
   * - Sets the left property for aasel__row on large screens
   */
  Aasel.prototype.setLeftDesktop = function(targetPage) {
    var A = this;

    var targetLeft = parseInt(A.$aaselItems.eq(targetPage - 1).css('left'));

    A.$row.animate({
      left: -targetLeft
    }, 400);

    A.settings.currentLeft = targetLeft;
  };

  /**
   * setLeftMobile
   * - Sets the left property for aasel__row on small screens
   */
  Aasel.prototype.setLeftMobile = function(targetPage) {
    var A = this;

    var targetLeft = parseInt(A.$aaselMobileItems.eq(targetPage - 1).css('left'));

    A.$mobileRow.animate({
      left: -targetLeft
    }, 400);

    A.settings.currentLeft = targetLeft;
  };

  /**
   * setMobileLocations
   * - Set all possible mobile left locations depending on number of pages
   */
  Aasel.prototype.setMobileLocations = function(ww) {
    var A = this;
    A.settings.mobilePageLocations = [];

    for (var i = 0; i < A.settings.totalMobilePages; i++) {
      A.settings.mobilePageLocations.push(i * ww);
    };
  };

  Aasel.prototype.setAaselArrowTop = function () {
    var aaselHeight = ($(window).width() >=  760 ) ? this.settings.aaselHeight : this.settings.aaselMobileHeight; 

    var arrowHeight = this.$prev.outerHeight(); 

    this.$arrows.css({
      top: aaselHeight / 2 - arrowHeight / 2
    });
  }

  /**
   * SnapToClosest
   * - Snaps to closest item / group on mobile and desktop depending on viewport
   */
  Aasel.prototype.SnapToClosest = function(ww) {
    var A = this;

    if (ww >= 760) {
      A.setLeftDesktop(A.settings.currentPage);
    } else {

      // Checks to see which page is closest to current width 
      var closestLeft = A.getClosest(A.settings.mobilePageLocations, A.settings.currentLeft);

      closestLeft = (closestLeft < 0) ? 0 : closestLeft;

      A.$mobileRow.animate({
        left: -closestLeft
      })

      // updates settings 
      A.settings.currentMobilePage = A.settings.mobilePageLocations.indexOf(closestLeft) + 1;
      A.settings.currentLeft = closestLeft;
    }
  };

  // Get Closest number array value to target
  Aasel.prototype.getClosest = function(array, target) {
    var tuples = _.map(array, function(val) {
      return [val, Math.abs(val - target)];
    });
    return _.reduce(tuples, function(memo, val) {
      return (memo[1] < val[1]) ? memo : val;
    }, [-1, 999])[0];
  }

  Aasel.prototype.setInnerItemCss = function($el, left, top) {
    $el.css({
      position: 'absolute',
      left: left,
      top: top
    })
  };

  // ==========
  // Page Switch (Prev, next, swipe)
  // ==========

  /**
   * changePage
   * - in charged of changing to the correct page on both desktop and mobile carousels
   */
  Aasel.prototype.changePage = function(event) {
    var A = this;
    switch (event.data.message) {
      case 'prev':
        A.settings.currentPage = (A.settings.currentPage == 1) ? A.settings.totalPages : (A.settings.currentPage - 1);
        A.settings.currentMobilePage = (A.settings.currentMobilePage == 1) ? A.settings.totalMobilePages : (A.settings.currentMobilePage - 1);
        break;

      case 'next':
        A.settings.currentPage = (A.settings.currentPage == A.settings.totalPages) ? 1 : (A.settings.currentPage + 1);
        A.settings.currentMobilePage = (A.settings.currentMobilePage == A.settings.totalMobilePages) ? 1 : (A.settings.currentMobilePage + 1);
        break;

      default:
        return false;
    }

    if ($(window).width() >= 760) {
      A.setLeftDesktop(A.settings.currentPage);
    } else {
      A.setLeftMobile(A.settings.currentMobilePage);
    }
  };

  Aasel.prototype.goToPage = function(index) {
    var A = this;
    var targetPage = index + 1
    if ($(window).width() > 760) {
      A.setLeftDesktop(targetPage);
      A.settings.currentPage = targetPage;
    } else {
      A.setLeftMobile(targetPage);
      A.settings.currentMobilePage = targetPage;
    }
  };

  // ==========
  // States
  // ==========

  Aasel.prototype.initDotStates = function() {
    var A = this;

    A.$mobileDots.children().eq(0).addClass('is-active');
    A.$desktopDots.children().eq(0).addClass('is-active');
  };

  Aasel.prototype.initArrowStates = function() {
    var A = this;

    A.$prev.addClass('is-disabled');
  };

  Aasel.prototype.arrowStates = function() {
    var A = this;

    // resets all arrow states 
    A.$prev.removeClass('is-disabled');
    A.$next.removeClass('is-disabled');

    // Add / Change state depending on ww & current page
    if ($(window).width() >= 760) {
      if (A.settings.currentPage === 1) {
        A.$prev.addClass('is-disabled');
      }

      if (A.settings.currentPage === A.settings.totalPages) {
        A.$next.addClass('is-disabled');
      }

    } else {
      if (A.settings.currentMobilePage === 1) {
        A.$prev.addClass('is-disabled');
      }

      if (A.settings.currentMobilePage === A.settings.totalMobilePages) {
        A.$next.addClass('is-disabled');
      }
    }
  };

  Aasel.prototype.dotStates = function() {
    var A = this;
    // Reset both mobile and desktop dot states 
    A.$dotHolder.find('.dot').removeClass('is-active');

    // Change mobile dot states 
    A.$mobileDots.children().eq(A.settings.currentMobilePage - 1).addClass('is-active');

    // Change desktop dot states 
    A.$desktopDots.children().eq(A.settings.currentPage - 1).addClass('is-active');
  };

  // ==========
  // Public functions (jquery Functions)
  // ==========

  $.fn.aasel = function(settings) {
    var A = this;
    return A.each(function(index, el) {
      el.aasel = new Aasel(el, settings);
    });
  }
});

jQuery(document).ready(function($) {
  $('.aasel').aasel();
});
