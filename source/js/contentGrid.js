jQuery(document).ready(function($) {
  // Show / hide items depending on the number of rows on various viewports 

  function showHideContentGrids(ww, rows, $el) {
    var contentType = $el.closest('.tg-content-grid').attr('data-content-grid-type');

    $el.find('.l-gi').show();

    if (contentType == '2') {
      switch (true) {
        case ww > 760:
          break;
        default:
          $el.find('.l-gi').slice(-rows).hide();
      }
    }
    
    if (contentType == '3') {
      switch (true) {
        case ww > 1140:
          $el.find('.tg-list-no-border').removeClass('tg-list-no-border');//Alignment ticket
          break;
        case ww > 760:
          $el.find('.l-gi').slice(-rows).hide();
          $el.find('.l-gi').not(':hidden').slice(-2).addClass('tg-list-no-border');//Alignment ticket
          break;
        default:
          $el.find('.l-gi').slice(-rows * 2).hide();
          $el.find('.tg-list-no-border').removeClass('tg-list-no-border');//Alignment ticket
      }
    }

    // Rests load more button on resize
    if (ww <= 760) {
      $el.siblings('.tg-load-more').show();
    }
  }

  var contentGrids = $('.tg-content-grid').find('.l-content-grid');

  _.forEach(contentGrids, function(el) {
    var numRows = $(el).closest('.tg-content-grid').attr('data-rows-on-desktop');
    var ww = $(window).width();

    if (numRows) {

      showHideContentGrids(ww, numRows, $(el));

      $(window).resize(function(event) {
        var ww = $(window).width();
        if(ww > 760){
          showHideContentGrids(ww, numRows, $(el));  
        }else{
          $('.tg-content-grid').find('.tg-list-no-border').removeClass('tg-list-no-border');
        }
      });

      $(el).closest('.tg-content-grid').on('click', '.tg-load-more', function(event) {
        event.preventDefault();
        $(el).find('.l-gi').show();
        $(el).find('[data-dotdot]').truncateToHeight();
        $(this).hide();
      });
    }

  });
});
