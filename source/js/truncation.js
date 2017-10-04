// Truncation with data-dotdot
jQuery(document).ready(function($) {
  $('[data-dotdot]').truncateToHeight();

  $(window).resize($.debounce(150, false, function(event) {
    $('[data-dotdot]').truncateToHeight(true);
  }));
});
