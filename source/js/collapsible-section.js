jQuery(document).ready(function($) {
  'use strict';

  /**
   * Element will have collapsible state until a certain breakpoint.
   * If > breakpoint, element will no longer collapse.
   */

  function checkCollapse(collapseBp, $el) {
    if (!isNaN(collapseBp)) {
      if ($(window).width() > collapseBp && !$('html').hasClass('in-skin')) {
        uncollapse($el);
        hideToggle($el);
      } else {
        collapse($el);
        showToggle($el);
      }
    }
  }

  function hideToggle($el) {
    $el.find('.collapsible__toggle').hide();
  }

  function showToggle($el) {
    $el.find('.collapsible__toggle').show();
  }

  function collapse($collapsibleElement) {
    var $collapsibleBody = $collapsibleElement.find('.collapsible__body');
    $collapsibleElement.addClass('is-collapsed');
    $collapsibleBody.slideUp('400');
  }

  function uncollapse($collapsibleElement) {
    var $collapsibleBody = $collapsibleElement.find('.collapsible__body'),
      $dotdots = $collapsibleElement.find('[data-dotdot]');

    $collapsibleElement.removeClass('is-collapsed');
    $collapsibleBody.slideDown('400');
    setTimeout(function() {
      $dotdots.truncateToHeight();
    }, 400);
  }


  $('.collapsible').each(function(index, el) {
    el.ww = $(window).width();
    var collapseTill = $(el).attr('data-collapse-till');
    var collapseBp;

    // Checks collapseTill against known values 
    switch (collapseTill) {
      case "small":
        collapseBp = 479;
        break;
      case "medium":
        collapseBp = 759;
        break;
      case "m-large":
        collapseBp = 979;
        break;
      case "large":
        collapseBp = 1023;
        break;
      case "larger":
        collapseBp = 1140;
        break;
      case "":
        collapseBp = null;
      default:
        collapseBp = parseInt(collapseTill);
    }

    checkCollapse(collapseBp, $(el));

    // Mobile Safari triggers resize on scroll, hence have to hack against it. 
    $(window).resize(function(event) {
      console.log('has been resized');
      // if (el.ww != $(window).width()) {
        el.ww = $(window).width();
        var hasAd = $('html').hasClass('in-skin')?".nav--quicklinks .collapsible": el;
        checkCollapse(collapseBp, $(hasAd));
      // }
    });

    $(el).on('click', '.collapsible__toggle', function(event) {
      var $collapsibleElement = $(this).closest('.collapsible'),
        isCollapsed = $collapsibleElement.hasClass('is-collapsed');

      if (isCollapsed) {
        uncollapse($collapsibleElement);
      } else {
        collapse($collapsibleElement);
      }
    });
  });
});
