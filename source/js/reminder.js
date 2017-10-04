jQuery(document).ready(function($) {
  $('.remind-me').on('click', function(event) {
    event.preventDefault();
    event.stopPropagation();

    // Close off all reminder popups 
    $('.reminder-popup').removeClass('is-shown');

    var $popup = $(this).find('.reminder-popup');

    if ($popup.hasClass('is-shown')) {
      $popup.removeClass('is-shown');
    } else {
      $popup.addClass('is-shown');
    }
  });

  $('html').on('click', function(event) {
    // Close off all reminder popups 
    $('.reminder-popup').removeClass('is-shown');
  });

  $(window).resize(function(event) {
    // Close off all reminder popups 
    $('.reminder-popup').removeClass('is-shown');
  });

  $('.reminder-popup').on('click', 'a', function(event) {
    event.preventDefault();
    event.stopPropagation();

    if ($(this).find('.i-search-close').length) {
      $('.reminder-popup').removeClass('is-shown');
    }
  });
});
