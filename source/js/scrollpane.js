jQuery(document).ready(function($) {
  var scrollPanes = [];
  var $videoDetailList = $('.fixed-height--episode');
  scrollPaneInitialize();

  $(window).resize(function() {
    scrollPaneResize();
  });

  // ONLY for video detail page 
  // if ($videoDetailList.length) {}

  function scrollPaneResize() {
    if ($(window).width() > 760) {
      if (scrollPanes.length == 0) {
        scrollPaneInitialize();
      }
    } else { 
      if (scrollPanes.length) {
        $.each(scrollPanes,
          function(i) {
            this.destroy();
          }
        );
        scrollPanes = [];
      }
    }
  }

  function scrollPaneInitialize() {
    var $fixedHeight = $('.fixed-height').not('.fixed-height--episode');
    var $fixedHeightEpisode = $('.fixed-height--episode');
    var $fixedHeightList = $fixedHeight.find('.fixed-height__list');
    var $fixedHeightEpisodeList = $fixedHeightEpisode.find('.fixed-height__list');

    if ($fixedHeightList.length) {
      if ($(window).width() > 760) {
        $fixedHeightList.jScrollPane({
          autoReinitialise: true
        });

        $fixedHeightList.each(
          function() {
            scrollPanes.push($(this).data().jsp);
          }
        );
      }
    }

    if ($fixedHeightEpisodeList.length) {
      if ($(window).width() > 760) {
        var scrollDiv = $fixedHeightEpisodeList.jScrollPane({
          autoReinitialise: true
        });

        $fixedHeightEpisodeList.each(
          function() {
            scrollPanes.push($(this).data().jsp);
          }
        );


        // Scroll to Now playing
        var scrollDivData = scrollDiv.data('jsp');
        var nowPlayingPos = $('li.now-playing').length?$('li.now-playing').position().top:0;
        scrollDivData.scrollToY(nowPlayingPos);
      }
    }
  }
});

// Dropkick and Scrollpanes. Aesthetic purposes for dropdown items. Cannot use with IE8
jQuery(document).ready(function($) {

  var oldIE = isIE(8, 'lte');
  var $dropKicks = $('.dk-dropdown').not('.dk-dropdown--lightbox');

  function createScrollPane() {
    var $elem = $(this.data.elem);

    $elem.find('.dk-select-options').jScrollPane();
  }
  if (!oldIE) {
    $dropKicks.dropkick({
      // mobile: true,
      open: createScrollPane,
    });
  }

  $('[data-custom-featherlight]').each(function(index, el) {
    var $el = $(el);
    var target = $el.attr('data-custom-featherlight');

    $el.featherlight(target, {
      afterContent: lightboxCreateScrollPane
    })
  });




  function lightboxCreateScrollPane(e) {
    $lightboxDropdowns = this.$content.find('.dk-dropdown--lightbox');

    $lightboxDropdowns.each(function(index, el) {
      $(el).on('click', function(event) {
        event.preventDefault();
      });
      if (!oldIE) {
        $(el).dropkick({
          // mobile: true,
          open: createScrollPane,
        });
      }
    });
  }
});
