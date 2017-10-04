jQuery(document).ready(function($) {
  var $episodeMod = $('.fixed-height--episode');
  var $episodeList = $episodeMod.find('.fixed-height__list');
  var $episodes = $episodeList.children();

  if ($episodeMod.length) {
    var ww = $(window).width();
    if (ww < 760) {
      episodeListMobile();
    }

    $episodeMod.find('.tg-load-more').click(function(event) {
      event.preventDefault();
      $episodes.show();
      $(this).hide();
      /*hack for show more*/
      $episodeMod.attr('showMoreClicked', true);
      if ($(this).parent().hasClass('fixed-height')) {
        $(this).parent().find('.jspContainer').css('height', 'auto');
        $(this).parent().find('.jspPane').css('position', 'relative');
      }
    });
  }

  $(window).resize($.debounce(150, false, function(event) {
    var ww = $(window).width();
    if (ww > 760) {
      $episodeMod.find('.tg-load-more').hide();
      $episodes.show();
    } else {
      episodeListMobile();
    }
  }));

  if ($episodeMod.find('li').length < 4) {
    $('.tg-load-more').hide();
  }
});

// $(window).load(function() {});

// Find episode list 
// Set current + two more items to show
// Click load more -> show all. Scroll to current. 
// If no current, show first 3. 
function episodeListMobile() {
  var $episodeMod = $('.fixed-height--episode');
  var $episodeList = $episodeMod.find('.fixed-height__list');
  var $episodes = $episodeList.children();

  // Hide all episodes first
  $episodes.hide();

  var $nowPlaying = $episodes.filter('.now-playing');
  var nowPlayingIndex;

  if ($episodeMod.attr('showMoreClicked') === true) {
    $episodes.show();
  } else {
    if ($nowPlaying.length) {
      nowPlayingIndex = $nowPlaying.index();
      $episodes.slice(nowPlayingIndex, nowPlayingIndex + 3).show();
      $episodeMod.find('.tg-load-more').show();
    } else {
      $episodes.slice(0, 3).show();
    }
  }
}
