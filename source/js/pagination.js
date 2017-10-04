jQuery(document).ready(function($) {
  'use strict';

  var Pagination = window.Pagination || {};

  Pagination = function(element, options) {
    var p = this;

    p.settings = {
      activePage: 1,
      pages: 1,
      onBeforeChange: function() {},
      onAfterChange: function() {}
    };

    p.$element = $(element);
    p.settings.pages = p.$element.find('.pagination__item').length;

    p.$next = p.$element.find('.pagination__next');
    p.$prev = p.$element.find('.pagination__prev');
    p.$items = p.$element.find('.pagination__item');


    // Extend options with defaults
    p.settings = $.extend(true, p.settings, options);

    p.initialize();

    return p;
  };

  Pagination.prototype.initialize = function() {
    var p = this;

    // Set active state 
    // Set disable state 
    p.$next.on('click', function() {
      p.settings.onBeforeChange();
      var el = this;
      p.nextPage(el);
      p.setStates(el);
      p.settings.onAfterChange();
    });

    p.$prev.on('click', function() {
      var el = this;
      p.settings.onBeforeChange();
      p.prevPage(el);
      p.setStates(el);
      p.settings.onAfterChange();
    });

    p.$element.on('click', '.pagination__item', function() {
      var el = this;
      p.settings.onBeforeChange();
      p.goToPage(el);
      p.setStates(el);
      p.settings.onAfterChange();
    });

    // p.addTotalPageToMobile();
  };

  /**
   * Tests if clicked item is disabled || active.
   * @param  {html}  el [html element]
   * @return {Boolean}
   */
   Pagination.prototype.isDisabled = function(el) {
    if ($(el).hasClass('is-disabled') || $(el).hasClass('is-active')) {
      return true;
    }
  };

  /**
   * Goes to previous page
   * @return {[type]} [description]
   */
   Pagination.prototype.prevPage = function(el) {
    var p = this;

    var isDisabled = p.isDisabled(el);

    // Do nothing if disabled
    if (isDisabled) {
      return false;
    }

    if (p.settings.activePage - 1 > 0) {
      p.settings.activePage -= 1;
    }
  };

  /**
   * Goes to next page
   * @return {[type]} [description]
   */
   Pagination.prototype.nextPage = function(el) {
    var p = this;

    var isDisabled = p.isDisabled(el);

    // Do nothing if disabled
    if (isDisabled) {
      return false;
    }
    if (p.settings.activePage + 1 <= p.settings.pages) {
      p.settings.activePage += 1;
    }
  };
  Pagination.prototype.goToPage = function(el) {
    var p = this;

    var isDisabled = p.isDisabled(el);

    // Do nothing if disabled
    if (isDisabled) {
      return false;
    }
    p.settings.activePage = parseInt($(el).attr('data-page'));
  };

  Pagination.prototype.setStates = function(el) {
    var p = this;
    // Set Item States
    p.$items.removeClass('is-active');
    p.$items.eq(p.settings.activePage - 1).addClass('is-active');

    p.$prev.removeClass('is-disabled');
    p.$next.removeClass('is-disabled');

    // Set Arrow States 
    if (p.settings.activePage === 1) {
      p.$prev.addClass('is-disabled');
    }

    if (p.settings.activePage === p.settings.pages) {
      p.$next.addClass('is-disabled');
    }

    forceRedraw(p.$element);
  };

  Pagination.prototype.addTotalPageToMobile = function() {
    var p = this;
    var $items = p.$element.find('.pagination__item').find('a');
    $items.append('<span> of ' + p.settings.pages + '</span>');
  };

  $.fn.pagination = function(options) {
    this.p = new Pagination(this, options);
  };

  $.fn.goToPage = function () {
    var el = this; 

    el.p.goToPage(); 
    el.p.setStates()
  }

});

jQuery(document).ready(function($) {

  var $article = $('.article');

  if ($article.length) {
    console.log('has article');
    $article.find('.pagination').pagination({
      onAfterChange: function() {
        var p = this,
        pageNo = p.activePage,
        paraIndex,
        currentPage = $("#detailsId" + pageNo),
        adHolder;

        $(".details-text-content").hide();
        $(currentPage).show();

        if (pageNo == 1) {
          paraIndex = 3;
        } else {
          paraIndex = 4;
        }

        adHolder = $(".article__body .split-insert").remove();
        if ($(currentPage).find("p").length > paraIndex) {
          $(currentPage).find("p").eq(paraIndex - 1).after(adHolder);
        } else {
          $(currentPage).append(adHolder);
        }

        $('html, body').animate({ 
          scrollTop: $('#pagingText').offset().top 
        }, 1000);
      }
    });
  } else {
    $('.pagination').each(function(index, el) {
      $(this).pagination();
    });
  }



});
