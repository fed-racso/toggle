jQuery.fn.reverse = [].reverse;
jQuery(document).ready(function($) {
  'use strict';

  var $splitInserts = $('.split-insert'),
    $splitGrid = $('.split-grid'),
    $splitItems = $splitGrid.find('[data-split-index]').reverse();

  splitGrid($(window).width());

  $(window).resize(function(event) {
    splitGrid($(window).width());
  });

  function splitGrid(ww) {

    $splitItems.each(function(index, el) {
      var $splitItem = $(el),
        splitIndex = $splitItem.attr('data-split-index');

      // Shifts splitItems into respective splitInsert
      
      if (ww < phoenixVars.breakpoints.mLarge) {
        $splitInserts.each(function(index, el) {

          if (parseInt($(el).attr('data-split-index')) === parseInt(splitIndex)) {
            $(el).append($splitItem);
          }
        });
      }
      // Shifts splitItems into splitGrid
      else {
        $splitGrid.prepend($splitItem);
      }
    });


  }

});
